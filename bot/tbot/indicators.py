"""Technical indicators implemented from scratch (no numpy / pandas / pandas-ta).

Each function takes a list of floats (usually closes) or a list of Candles and
returns a list aligned to the input length. Values that cannot be computed yet
(not enough history) are ``None`` so callers can align by index.

These match the standard TradingView / Wilder definitions:
    - EMA seeded with an SMA of the first `period` values
    - RSI / ATR / ADX use Wilder's smoothing (alpha = 1/period)
"""

from __future__ import annotations

from typing import List, Optional, Sequence

from .candles import Candle

Num = Optional[float]


def sma(values: Sequence[float], period: int) -> List[Num]:
    out: List[Num] = [None] * len(values)
    if period <= 0:
        raise ValueError("period must be > 0")
    running = 0.0
    for i, v in enumerate(values):
        running += v
        if i >= period:
            running -= values[i - period]
        if i >= period - 1:
            out[i] = running / period
    return out


def ema(values: Sequence[float], period: int) -> List[Num]:
    out: List[Num] = [None] * len(values)
    if period <= 0:
        raise ValueError("period must be > 0")
    if len(values) < period:
        return out
    alpha = 2.0 / (period + 1.0)
    # Seed with SMA of the first `period` values (TradingView convention).
    seed = sum(values[:period]) / period
    out[period - 1] = seed
    prev = seed
    for i in range(period, len(values)):
        prev = (values[i] - prev) * alpha + prev
        out[i] = prev
    return out


def rsi(values: Sequence[float], period: int = 14) -> List[Num]:
    out: List[Num] = [None] * len(values)
    if len(values) <= period:
        return out
    gains = 0.0
    losses = 0.0
    for i in range(1, period + 1):
        change = values[i] - values[i - 1]
        gains += max(change, 0.0)
        losses += max(-change, 0.0)
    avg_gain = gains / period
    avg_loss = losses / period
    out[period] = _rsi_from(avg_gain, avg_loss)
    for i in range(period + 1, len(values)):
        change = values[i] - values[i - 1]
        gain = max(change, 0.0)
        loss = max(-change, 0.0)
        avg_gain = (avg_gain * (period - 1) + gain) / period
        avg_loss = (avg_loss * (period - 1) + loss) / period
        out[i] = _rsi_from(avg_gain, avg_loss)
    return out


def _rsi_from(avg_gain: float, avg_loss: float) -> float:
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100.0 - (100.0 / (1.0 + rs))


def macd(
    values: Sequence[float],
    fast: int = 12,
    slow: int = 26,
    signal: int = 9,
) -> tuple[List[Num], List[Num], List[Num]]:
    """Return (macd_line, signal_line, histogram)."""
    ema_fast = ema(values, fast)
    ema_slow = ema(values, slow)
    macd_line: List[Num] = [
        (f - s) if (f is not None and s is not None) else None
        for f, s in zip(ema_fast, ema_slow)
    ]
    # Signal EMA over the defined portion of the macd line.
    defined = [v for v in macd_line if v is not None]
    sig_defined = ema(defined, signal)
    signal_line: List[Num] = [None] * len(macd_line)
    j = 0
    for i, v in enumerate(macd_line):
        if v is not None:
            signal_line[i] = sig_defined[j]
            j += 1
    hist: List[Num] = [
        (m - s) if (m is not None and s is not None) else None
        for m, s in zip(macd_line, signal_line)
    ]
    return macd_line, signal_line, hist


def true_range(candles: Sequence[Candle]) -> List[Num]:
    out: List[Num] = [None] * len(candles)
    for i, c in enumerate(candles):
        if i == 0:
            out[i] = c.high - c.low
        else:
            prev_close = candles[i - 1].close
            out[i] = max(
                c.high - c.low,
                abs(c.high - prev_close),
                abs(c.low - prev_close),
            )
    return out


def atr(candles: Sequence[Candle], period: int = 14) -> List[Num]:
    tr = true_range(candles)
    out: List[Num] = [None] * len(candles)
    if len(candles) <= period:
        return out
    # First ATR = simple average of the first `period` true ranges.
    first = sum(tr[1 : period + 1]) / period  # type: ignore[arg-type]
    out[period] = first
    prev = first
    for i in range(period + 1, len(candles)):
        prev = (prev * (period - 1) + tr[i]) / period  # type: ignore[operator]
        out[i] = prev
    return out


def adx(candles: Sequence[Candle], period: int = 14) -> List[Num]:
    """Average Directional Index (Wilder). Measures trend *strength*, not direction.

    A common rule of thumb: ADX < 20 = weak/choppy (avoid trend trades),
    ADX >= 25 = a trend worth trading. We use it as a quality filter to raise the
    win rate by skipping range-bound noise.
    """
    n = len(candles)
    out: List[Num] = [None] * n
    if n <= 2 * period:
        return out

    plus_dm = [0.0] * n
    minus_dm = [0.0] * n
    tr = [0.0] * n
    for i in range(1, n):
        up = candles[i].high - candles[i - 1].high
        down = candles[i - 1].low - candles[i].low
        plus_dm[i] = up if (up > down and up > 0) else 0.0
        minus_dm[i] = down if (down > up and down > 0) else 0.0
        pc = candles[i - 1].close
        tr[i] = max(candles[i].high - candles[i].low, abs(candles[i].high - pc), abs(candles[i].low - pc))

    def _dx(atr_s: float, pdm_s: float, mdm_s: float) -> float:
        if atr_s == 0:
            return 0.0
        pdi = 100 * pdm_s / atr_s
        mdi = 100 * mdm_s / atr_s
        denom = pdi + mdi
        return 100 * abs(pdi - mdi) / denom if denom else 0.0

    # Wilder-smoothed sums seeded over the first `period` diffs (indices 1..period).
    atr_s = sum(tr[1 : period + 1])
    pdm_s = sum(plus_dm[1 : period + 1])
    mdm_s = sum(minus_dm[1 : period + 1])
    dxs: List[float] = [_dx(atr_s, pdm_s, mdm_s)]  # dxs[0] aligns to candle index `period`
    for i in range(period + 1, n):
        atr_s = atr_s - atr_s / period + tr[i]
        pdm_s = pdm_s - pdm_s / period + plus_dm[i]
        mdm_s = mdm_s - mdm_s / period + minus_dm[i]
        dxs.append(_dx(atr_s, pdm_s, mdm_s))

    if len(dxs) < period:
        return out
    first_adx = sum(dxs[:period]) / period
    adx_idx = 2 * period - 1  # first ADX lands here
    out[adx_idx] = first_adx
    prev = first_adx
    for i in range(adx_idx + 1, n):
        prev = (prev * (period - 1) + dxs[i - period]) / period
        out[i] = prev
    return out


def bollinger(
    values: Sequence[float], period: int = 20, mult: float = 2.0
) -> tuple[List[Num], List[Num], List[Num]]:
    """Return (upper, middle, lower) Bollinger Bands."""
    mid = sma(values, period)
    upper: List[Num] = [None] * len(values)
    lower: List[Num] = [None] * len(values)
    for i in range(len(values)):
        if mid[i] is None:
            continue
        window = values[i - period + 1 : i + 1]
        mean = mid[i]
        var = sum((x - mean) ** 2 for x in window) / period
        sd = var ** 0.5
        upper[i] = mean + mult * sd
        lower[i] = mean - mult * sd
    return upper, mid, lower
