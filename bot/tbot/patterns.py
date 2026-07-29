"""Price-action primitives: swings, support/resistance, candlestick patterns.

Everything here is deterministic and index-based so it can be reused by both the
backtest engine and the live loop.
"""

from __future__ import annotations

from typing import List, Optional, Sequence

from .candles import Candle


def swing_highs(candles: Sequence[Candle], left: int = 2, right: int = 2) -> List[int]:
    """Indices where a bar's high is the local maximum over [i-left, i+right]."""
    out: List[int] = []
    for i in range(left, len(candles) - right):
        h = candles[i].high
        if all(candles[i - k].high < h for k in range(1, left + 1)) and all(
            candles[i + k].high <= h for k in range(1, right + 1)
        ):
            out.append(i)
    return out


def swing_lows(candles: Sequence[Candle], left: int = 2, right: int = 2) -> List[int]:
    out: List[int] = []
    for i in range(left, len(candles) - right):
        lo = candles[i].low
        if all(candles[i - k].low > lo for k in range(1, left + 1)) and all(
            candles[i + k].low >= lo for k in range(1, right + 1)
        ):
            out.append(i)
    return out


def recent_resistance(candles: Sequence[Candle], upto: int, lookback: int = 50) -> Optional[float]:
    """Highest swing-high within the `lookback` bars ending at index `upto`."""
    start = max(0, upto - lookback)
    window = candles[start : upto + 1]
    highs_idx = swing_highs(window)
    if not highs_idx:
        return None
    return max(window[i].high for i in highs_idx)


def recent_support(candles: Sequence[Candle], upto: int, lookback: int = 50) -> Optional[float]:
    start = max(0, upto - lookback)
    window = candles[start : upto + 1]
    lows_idx = swing_lows(window)
    if not lows_idx:
        return None
    return min(window[i].low for i in lows_idx)


def is_bullish_engulfing(prev: Candle, cur: Candle) -> bool:
    return (
        not prev.is_bullish
        and cur.is_bullish
        and cur.close >= prev.open
        and cur.open <= prev.close
        and cur.body > prev.body
    )


def is_bearish_engulfing(prev: Candle, cur: Candle) -> bool:
    return (
        prev.is_bullish
        and not cur.is_bullish
        and cur.open >= prev.close
        and cur.close <= prev.open
        and cur.body > prev.body
    )


def is_hammer(c: Candle) -> bool:
    """Long lower wick, small body near the top — bullish rejection."""
    if c.range == 0:
        return False
    return c.lower_wick >= 2 * c.body and c.upper_wick <= c.body and c.body > 0


def is_shooting_star(c: Candle) -> bool:
    """Long upper wick, small body near the bottom — bearish rejection."""
    if c.range == 0:
        return False
    return c.upper_wick >= 2 * c.body and c.lower_wick <= c.body and c.body > 0
