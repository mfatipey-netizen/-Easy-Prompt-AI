"""Thin ccxt helpers for the desktop app: connect, read balance, fetch candles.

ccxt is imported lazily so the rest of the bot has no hard dependency on it. All
network/credential handling lives here; the GUI just calls these functions.
"""

from __future__ import annotations

from typing import Dict, List, Tuple

from .candles import Candle, from_rows

# ccxt timeframe string -> seconds per bar.
TIMEFRAME_SEC = {"1m": 60, "5m": 300, "15m": 900, "30m": 1800,
                 "1h": 3600, "4h": 14400, "1d": 86400}

# Currencies we treat as "cash" when summing an account's spendable value.
QUOTE_CCYS = ("USD", "USDT", "USDC", "ZUSD", "EUR", "ZEUR")


def make_client(exchange: str, api_key: str, secret: str, password: str = ""):
    """Build a ccxt client. Raises a friendly error if ccxt is missing."""
    try:
        import ccxt
    except ImportError as exc:  # pragma: no cover - environment dependent
        raise RuntimeError(
            "The 'ccxt' library is not installed. Open a terminal and run:\n"
            "    pip install ccxt"
        ) from exc
    if not hasattr(ccxt, exchange):
        raise ValueError(f"Unknown exchange '{exchange}'. Try 'kraken' or 'coinbase'.")
    cfg = {"apiKey": api_key.strip(), "secret": secret.strip(), "enableRateLimit": True}
    if password.strip():
        cfg["password"] = password.strip()
    return getattr(ccxt, exchange)(cfg)


def account_cash(client) -> Tuple[float, Dict[str, float]]:
    """Return (total cash in quote currencies, {currency: amount}) for the account.

    'Cash' here means fiat / stablecoins — the balance you can deploy. Crypto
    holdings are ignored for the sizing recommendation.
    """
    bal = client.fetch_balance()
    totals = bal.get("total", {}) or {}
    cash: Dict[str, float] = {}
    for ccy in QUOTE_CCYS:
        amt = totals.get(ccy)
        if amt:
            cash[ccy] = float(amt)
    total = sum(cash.values())
    return total, cash


def taker_fee(client, symbol: str, fallback: float) -> float:
    """Best-effort per-side taker fee for a market; fall back to a default."""
    try:
        client.load_markets()
        market = client.market(symbol)
        fee = market.get("taker")
        if fee is not None:
            return float(fee)
    except Exception:
        pass
    return fallback


def fetch_candles(client, symbol: str, timeframe: str = "1h", limit: int = 1000) -> List[Candle]:
    """Fetch OHLCV via ccxt and convert to our Candle list (ts in seconds)."""
    raw = client.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
    rows = [[int(r[0]) // 1000, r[1], r[2], r[3], r[4], r[5]] for r in raw]
    return from_rows(rows)
