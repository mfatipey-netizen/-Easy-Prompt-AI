"""Risk management: position sizing and hard safety limits.

This is the single most important module for survival. The strategy decides
*direction*; risk.py decides *how much* and *whether we are allowed to trade at
all*. Sizing is volatility-aware: we risk a fixed fraction of equity per trade
and let the (ATR-based) stop distance determine the quantity.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class RiskConfig:
    risk_per_trade: float = 0.01      # fraction of equity risked per trade (1%)
    max_open_positions: int = 3       # concurrent positions cap
    max_exposure: float = 0.5         # max fraction of equity deployed at once
    daily_loss_limit: float = 0.03    # stop trading for the day after -3% equity
    min_reward_risk: float = 1.5      # reject signals with a worse R:R than this


@dataclass
class RiskManager:
    config: RiskConfig

    def position_size(self, equity: float, entry: float, stop: float) -> float:
        """Quantity to buy/sell so that a stop-out loses `risk_per_trade` of equity."""
        stop_distance = abs(entry - stop)
        if stop_distance <= 0 or equity <= 0:
            return 0.0
        risk_amount = equity * self.config.risk_per_trade
        qty = risk_amount / stop_distance
        # Never let a single position exceed the exposure cap.
        max_qty_by_exposure = (equity * self.config.max_exposure) / entry
        return max(0.0, min(qty, max_qty_by_exposure))

    def can_open(self, open_positions: int, day_pnl_pct: float) -> tuple[bool, str]:
        if open_positions >= self.config.max_open_positions:
            return False, "max open positions reached"
        if day_pnl_pct <= -abs(self.config.daily_loss_limit):
            return False, "daily loss limit hit — halting new trades today"
        return True, ""

    def accepts_reward_risk(self, reward_risk: float) -> bool:
        return reward_risk >= self.config.min_reward_risk
