"""Performance metrics computed from closed trades and an equity curve.

Kept deliberately honest: alongside the usual win-rate / profit-factor we compute
the *realised* average daily return and max drawdown, so the output can be
compared against unrealistic targets (e.g. a fixed "+1%/day") and show reality.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Sequence, Tuple

from .portfolio import Trade


@dataclass
class Report:
    start_equity: float
    end_equity: float
    num_trades: int
    wins: int
    losses: int
    win_rate: float
    total_return_pct: float
    avg_win: float
    avg_loss: float
    profit_factor: float
    expectancy: float
    max_drawdown_pct: float
    avg_daily_return_pct: float
    sharpe: float

    def as_lines(self) -> List[str]:
        return [
            f"Start equity        : {self.start_equity:,.2f}",
            f"End equity          : {self.end_equity:,.2f}",
            f"Total return        : {self.total_return_pct:+.2f}%",
            f"Trades              : {self.num_trades}  (W {self.wins} / L {self.losses})",
            f"Win rate            : {self.win_rate:.1f}%",
            f"Avg win / avg loss  : {self.avg_win:,.2f} / {self.avg_loss:,.2f}",
            f"Profit factor       : {self.profit_factor:.2f}",
            f"Expectancy / trade  : {self.expectancy:,.2f}",
            f"Max drawdown        : {self.max_drawdown_pct:.2f}%",
            f"Avg daily return    : {self.avg_daily_return_pct:+.3f}%",
            f"Sharpe (per-bar)    : {self.sharpe:.2f}",
        ]


def max_drawdown(equity_curve: Sequence[float]) -> float:
    peak = float("-inf")
    max_dd = 0.0
    for eq in equity_curve:
        peak = max(peak, eq)
        if peak > 0:
            dd = (eq - peak) / peak
            max_dd = min(max_dd, dd)
    return max_dd * 100.0


def _sharpe(returns: Sequence[float]) -> float:
    n = len(returns)
    if n < 2:
        return 0.0
    mean = sum(returns) / n
    var = sum((r - mean) ** 2 for r in returns) / (n - 1)
    sd = var ** 0.5
    if sd == 0:
        return 0.0
    return mean / sd


def _daily_returns(equity_curve: Sequence[float], bars_per_day: int) -> List[float]:
    if bars_per_day <= 0 or len(equity_curve) <= bars_per_day:
        return []
    out: List[float] = []
    for i in range(bars_per_day, len(equity_curve), bars_per_day):
        prev = equity_curve[i - bars_per_day]
        if prev > 0:
            out.append((equity_curve[i] - prev) / prev)
    return out


def build_report(
    trades: Sequence[Trade],
    equity_curve: Sequence[float],
    bars_per_day: int = 24,
) -> Report:
    start_eq = equity_curve[0] if equity_curve else 0.0
    end_eq = equity_curve[-1] if equity_curve else 0.0
    wins = [t for t in trades if t.pnl > 0]
    losses = [t for t in trades if t.pnl <= 0]
    gross_win = sum(t.pnl for t in wins)
    gross_loss = -sum(t.pnl for t in losses)
    n = len(trades)
    win_rate = (len(wins) / n * 100.0) if n else 0.0
    avg_win = (gross_win / len(wins)) if wins else 0.0
    avg_loss = (-gross_loss / len(losses)) if losses else 0.0
    profit_factor = (gross_win / gross_loss) if gross_loss > 0 else float("inf")
    expectancy = (sum(t.pnl for t in trades) / n) if n else 0.0
    total_return = ((end_eq - start_eq) / start_eq * 100.0) if start_eq else 0.0

    per_bar_returns: List[float] = []
    for i in range(1, len(equity_curve)):
        prev = equity_curve[i - 1]
        if prev > 0:
            per_bar_returns.append((equity_curve[i] - prev) / prev)

    daily = _daily_returns(equity_curve, bars_per_day)
    avg_daily = (sum(daily) / len(daily) * 100.0) if daily else 0.0

    return Report(
        start_equity=start_eq,
        end_equity=end_eq,
        num_trades=n,
        wins=len(wins),
        losses=len(losses),
        win_rate=win_rate,
        total_return_pct=total_return,
        avg_win=avg_win,
        avg_loss=avg_loss,
        profit_factor=profit_factor,
        expectancy=expectancy,
        max_drawdown_pct=max_drawdown(equity_curve),
        avg_daily_return_pct=avg_daily,
        sharpe=_sharpe(per_bar_returns),
    )
