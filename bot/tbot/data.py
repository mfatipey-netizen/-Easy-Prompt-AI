"""Market data: synthetic generation (offline) and public REST fetch (live).

The public OHLCV endpoints of Kraken and Coinbase need **no API key**, so you can
backtest on real historical data with the standard library alone. API keys are
only required later for *placing orders* (see broker.py).
"""

from __future__ import annotations

import json
import math
import random
import urllib.parse
import urllib.request
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


def fetch_coinbase(product: str = "BTC-USD", granularity_sec: int = 3600) -> List[Candle]:
    """Fetch candles from Coinbase Exchange public API.

    Granularity must be one of 60,300,900,3600,21600,86400. Returns up to 300 bars.
    """
    url = f"https://api.exchange.coinbase.com/products/{product}/candles?" + urllib.parse.urlencode(
        {"granularity": granularity_sec}
    )
    data = _http_get_json(url)
    # Coinbase returns [ time, low, high, open, close, volume ], newest first.
    rows = [
        [int(r[0]), r[3], r[2], r[1], r[4], r[5]]  # -> ts,o,h,l,c,volume
        for r in data
    ]
    return from_rows(rows)


def load(
    source: str,
    symbol: str,
    interval_sec: int = 3600,
    **kwargs,
) -> List[Candle]:
    """Unified loader. `source` in {'synthetic','kraken','coinbase'}."""
    if source == "synthetic":
        return synthetic(interval_sec=interval_sec, **kwargs)
    if source == "kraken":
        return fetch_kraken(pair=symbol, interval_min=max(1, interval_sec // 60))
    if source == "coinbase":
        return fetch_coinbase(product=symbol, granularity_sec=interval_sec)
    raise ValueError(f"unknown data source: {source}")
