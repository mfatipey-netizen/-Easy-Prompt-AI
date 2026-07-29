"""OHLCV candle type and small helpers, using only the standard library."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Sequence


@dataclass(frozen=True)
class Candle:
    """A single OHLCV bar. ``ts`` is a unix timestamp in seconds (UTC)."""

    ts: int
    open: float
    high: float
    low: float
    close: float
    volume: float

    @property
    def is_bullish(self) -> bool:
        return self.close >= self.open

    @property
    def body(self) -> float:
        return abs(self.close - self.open)

    @property
    def range(self) -> float:
        return self.high - self.low

    @property
    def upper_wick(self) -> float:
        return self.high - max(self.open, self.close)

    @property
    def lower_wick(self) -> float:
        return min(self.open, self.close) - self.low


def closes(candles: Sequence[Candle]) -> List[float]:
    return [c.close for c in candles]


def highs(candles: Sequence[Candle]) -> List[float]:
    return [c.high for c in candles]


def lows(candles: Sequence[Candle]) -> List[float]:
    return [c.low for c in candles]


def from_rows(rows: Iterable[Sequence[float]]) -> List[Candle]:
    """Build candles from ``[ts, open, high, low, close, volume]`` rows."""
    out: List[Candle] = []
    for r in rows:
        out.append(
            Candle(
                ts=int(r[0]),
                open=float(r[1]),
                high=float(r[2]),
                low=float(r[3]),
                close=float(r[4]),
                volume=float(r[5]) if len(r) > 5 else 0.0,
            )
        )
    out.sort(key=lambda c: c.ts)
    return out
