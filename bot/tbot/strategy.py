"""Strategy layer: turn indicators + price action into a scored trade signal.

The default strategy is a *confluence* model: several independent checks each
vote long/short, the votes are summed into a score, and a trade is only proposed
when the score clears a threshold. Stop-loss and take-profit are derived from ATR
so position sizing (in risk.py) can be volatility-aware.

Add your own strategy by subclassing ``Strategy`` and implementing ``evaluate``.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional, Sequence

from . import indicators as ind
from . import patterns as pa
from .candles import Candle, closes


@dataclass
class Signal:
    side: str  # "long" | "short" | "flat"
    score: float
    entry: float
    stop: float
    take_profit: float
    reasons: List[str] = field(default_factory=list)

    @property
    def risk_per_unit(self) -> float:
        return abs(self.entry - self.stop)

    @property
    def reward_risk(self) -> float:
        rpu = self.risk_per_unit
        if rpu == 0:
            return 0.0
        return abs(self.take_profit - self.entry) / rpu


class Strategy:
    """Base class. ``evaluate`` sees candles[0..i] and decides about bar i."""

    warmup = 50

    def evaluate(self, candles: Sequence[Candle], i: int) -> Signal:  # pragma: no cover
        raise NotImplementedError


@dataclass
class ConfluenceStrategy(Strategy):
    rsi_period: int = 14
    rsi_oversold: float = 35.0
    rsi_overbought: float = 65.0
    ema_fast: int = 20
    ema_slow: int = 50
    atr_period: int = 14
    atr_stop_mult: float = 1.5
    reward_risk: float = 2.0          # fixed 1:2 target (risk 1 to make 2)
    min_score: float = 3.0            # selectivity: require strong confluence
    # --- Quality filters (GATES) that raise win rate by trading only A+ setups ---
    use_trend_filter: bool = True     # only trade WITH the long-term trend
    trend_ema: int = 200
    use_adx_filter: bool = True       # only trade when a real trend exists
    adx_period: int = 14
    adx_min: float = 22.0
    warmup: int = 210

    def __post_init__(self) -> None:
        # Ensure enough history for whichever lookbacks are actually enabled.
        need = [self.ema_slow + 5, 2 * self.atr_period + 5]
        if self.use_trend_filter:
            need.append(self.trend_ema + 5)
        if self.use_adx_filter:
            need.append(2 * self.adx_period + 5)
        self.warmup = max(self.warmup, *need)

    def evaluate(self, candles: Sequence[Candle], i: int) -> Signal:
        flat = Signal("flat", 0.0, candles[i].close, candles[i].close, candles[i].close)
        if i < self.warmup:
            return flat

        window = candles[: i + 1]
        px = closes(window)
        cur = candles[i]

        ema_f = ind.ema(px, self.ema_fast)[i]
        ema_s = ind.ema(px, self.ema_slow)[i]
        rsi_v = ind.rsi(px, self.rsi_period)[i]
        _, _, hist = ind.macd(px)
        macd_hist = hist[i]
        atr_v = ind.atr(window, self.atr_period)[i]
        if None in (ema_f, ema_s, rsi_v, macd_hist, atr_v) or atr_v == 0:
            return flat

        # --- Quality gates: computed up front so a failed gate blocks the trade ---
        trend_long_ok = trend_short_ok = True
        if self.use_trend_filter:
            trend_ema_v = ind.ema(px, self.trend_ema)[i]
            if trend_ema_v is None:
                return flat
            trend_long_ok = cur.close > trend_ema_v
            trend_short_ok = cur.close < trend_ema_v
        if self.use_adx_filter:
            adx_v = ind.adx(window, self.adx_period)[i]
            if adx_v is None or adx_v < self.adx_min:
                return flat  # no real trend — sit out the chop to protect win rate

        long_score = 0.0
        short_score = 0.0
        reasons: List[str] = []

        # 1) Trend via EMA stack.
        if ema_f > ema_s:
            long_score += 1
            reasons.append(f"EMA{self.ema_fast}>EMA{self.ema_slow} (uptrend)")
        else:
            short_score += 1
            reasons.append(f"EMA{self.ema_fast}<EMA{self.ema_slow} (downtrend)")

        # 2) Momentum via MACD histogram.
        if macd_hist > 0:
            long_score += 1
            reasons.append("MACD hist > 0")
        elif macd_hist < 0:
            short_score += 1
            reasons.append("MACD hist < 0")

        # 3) RSI pullback (mean-reversion in the trend direction).
        if rsi_v <= self.rsi_oversold:
            long_score += 1
            reasons.append(f"RSI {rsi_v:.0f} <= {self.rsi_oversold:.0f} (oversold)")
        elif rsi_v >= self.rsi_overbought:
            short_score += 1
            reasons.append(f"RSI {rsi_v:.0f} >= {self.rsi_overbought:.0f} (overbought)")

        # 4) Price-action confirmation on the last two bars.
        prev = candles[i - 1]
        if pa.is_bullish_engulfing(prev, cur) or pa.is_hammer(cur):
            long_score += 1
            reasons.append("bullish price-action (engulfing/hammer)")
        if pa.is_bearish_engulfing(prev, cur) or pa.is_shooting_star(cur):
            short_score += 1
            reasons.append("bearish price-action (engulfing/star)")

        # 5) Breakout of recent structure.
        res = pa.recent_resistance(window, i, lookback=50)
        sup = pa.recent_support(window, i, lookback=50)
        if res is not None and cur.close > res:
            long_score += 1
            reasons.append("close above recent resistance (breakout)")
        if sup is not None and cur.close < sup:
            short_score += 1
            reasons.append("close below recent support (breakdown)")

        entry = cur.close
        if long_score >= self.min_score and long_score > short_score and trend_long_ok:
            stop = entry - self.atr_stop_mult * atr_v
            tp = entry + self.reward_risk * (entry - stop)
            return Signal("long", long_score, entry, stop, tp, _picked(reasons, "long"))
        if short_score >= self.min_score and short_score > long_score and trend_short_ok:
            stop = entry + self.atr_stop_mult * atr_v
            tp = entry - self.reward_risk * (stop - entry)
            return Signal("short", short_score, entry, stop, tp, _picked(reasons, "short"))
        return flat


def _picked(reasons: List[str], side: str) -> List[str]:
    """Keep only reasons relevant to the chosen side (for readable logs)."""
    if side == "long":
        keep = ("uptrend", "hist > 0", "oversold", "bullish", "resistance")
    else:
        keep = ("downtrend", "hist < 0", "overbought", "bearish", "support")
    return [r for r in reasons if any(k in r for k in keep)]
