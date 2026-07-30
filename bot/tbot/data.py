"""Market data: synthetic generation (offline) and public REST fetch (live).

The public OHLCV endpoints of Kraken and Coinbase need **no API key**, so you can
backtest on real historical data with the standard library alone. API keys are
only required later for *placing orders* (see broker.py).
"""

from __future__ import annotations

import csv
import json
import math
import random
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from typing import List, Optional, Sequence

from .candles import Candle, from_rows

# Bars per day for common intervals (used for daily-return stats).
BARS_PER_DAY = {60: 1440, 300: 288, 900: 96, 3600: 24, 14400: 6, 86400: 1}


def synthetic(
    n: int = 1500,
    start_price: float = 30_000.0,
    interval_sec: int = 3600,
    seed: int = 42,
    drift: float = 0.0002,
    vol: float = 0.012,
) -> List[Candle]:
    """A reproducible geometric-random-walk price series with intrabar wicks.

    Useful for unit tests and for validating the engine offline. It is NOT a
    substitute for real market data — do not draw performance conclusions from it.
    """
    rng = random.Random(seed)
    rows = []
    price = start_price
    ts = 1_600_000_000
    for _ in range(n):
        # Occasional regime flips so trends and reversals both appear.
        local_drift = drift * (1 if rng.random() > 0.02 else -6)
        ret = local_drift + rng.gauss(0, vol)
        open_p = price
        close_p = max(0.01, price * math.exp(ret))
        hi = max(open_p, close_p) * (1 + abs(rng.gauss(0, vol / 2)))
        lo = min(open_p, close_p) * (1 - abs(rng.gauss(0, vol / 2)))
        volu = abs(rng.gauss(100, 30))
        rows.append([ts, open_p, hi, lo, close_p, volu])
        price = close_p
        ts += interval_sec
    return from_rows(rows)


def _http_get_json(url: str, timeout: int = 30) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "tbot/0.1"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


def fetch_kraken(pair: str = "XBTUSD", interval_min: int = 60) -> List[Candle]:
    """Fetch OHLC from Kraken's public API. `interval_min` in minutes (1,5,15,60,240,1440)."""
    url = "https://api.kraken.com/0/public/OHLC?" + urllib.parse.urlencode(
        {"pair": pair, "interval": interval_min}
    )
    data = _http_get_json(url)
    if data.get("error"):
        raise RuntimeError(f"Kraken API error: {data['error']}")
    result = data["result"]
    key = next(k for k in result if k != "last")
    rows = [
        [int(r[0]), r[1], r[2], r[3], r[4], r[6]]  # ts,o,h,l,c,volume
        for r in result[key]
    ]
    return from_rows(rows)


def _iso(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()


def fetch_coinbase(
    product: str = "BTC-USD",
    granularity_sec: int = 3600,
    max_bars: int = 300,
) -> List[Candle]:
    """Fetch candles from Coinbase Exchange public API, paging back for depth.

    Granularity must be one of 60,300,900,3600,21600,86400. A single request
    returns at most 300 bars, so for ``max_bars`` > 300 we walk backwards through
    time windows (politely rate-limited) and stitch the pages together.
    """
    base = f"https://api.exchange.coinbase.com/products/{product}/candles"
    collected: dict[int, list] = {}
    end = int(time.time())
    # Guard the loop so a stubborn API can never spin forever.
    max_pages = max(1, (max_bars + 299) // 300) + 2
    for _ in range(max_pages):
        if len(collected) >= max_bars:
            break
        start = end - 300 * granularity_sec
        url = base + "?" + urllib.parse.urlencode(
            {"granularity": granularity_sec, "start": _iso(start), "end": _iso(end)}
        )
        page = _http_get_json(url)
        if not page:
            break
        for r in page:  # [time, low, high, open, close, volume], newest first
            collected[int(r[0])] = [int(r[0]), r[3], r[2], r[1], r[4], r[5]]
        end = start
        if len(page) < 300:  # reached the start of available history
            break
        time.sleep(0.34)  # ~3 req/s public rate limit
    rows = sorted(collected.values())[-max_bars:]
    return from_rows(rows)


def save_csv(candles: Sequence[Candle], path: str) -> None:
    """Write candles to a CSV (ts,open,high,low,close,volume) for reuse offline."""
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["ts", "open", "high", "low", "close", "volume"])
        for c in candles:
            w.writerow([c.ts, c.open, c.high, c.low, c.close, c.volume])


def load_csv(path: str) -> List[Candle]:
    """Load candles from a CSV. Tolerates an optional header row.

    Columns must be ts,open,high,low,close[,volume] — the format ``save_csv``
    writes, and what most exchange history exporters produce.
    """
    rows: List[Sequence[float]] = []
    with open(path, newline="", encoding="utf-8") as fh:
        for record in csv.reader(fh):
            if not record:
                continue
            try:
                rows.append([float(x) for x in record[:6]])
            except ValueError:
                continue  # header or malformed line — skip
    if not rows:
        raise ValueError(f"no usable candle rows found in {path}")
    return from_rows(rows)


def load(
    source: str,
    symbol: str,
    interval_sec: int = 3600,
    max_bars: int = 300,
    **kwargs,
) -> List[Candle]:
    """Unified loader. `source` in {'synthetic','kraken','coinbase','csv'}.

    For 'csv', `symbol` is the path to a CSV file.
    """
    if source == "synthetic":
        return synthetic(interval_sec=interval_sec, **kwargs)
    if source == "kraken":
        return fetch_kraken(pair=symbol, interval_min=max(1, interval_sec // 60))
    if source == "coinbase":
        return fetch_coinbase(product=symbol, granularity_sec=interval_sec, max_bars=max_bars)
    if source == "csv":
        return load_csv(symbol)
    raise ValueError(f"unknown data source: {source}")
