"""Event-driven backtest engine for a single symbol.

Design choices that keep the results honest (no look-ahead bias):
    * A signal computed on the close of bar *i* is executed at the **open of bar
      i+1** — you can never trade on information you didn't have yet.
    * Stop-loss / take-profit are checked against each bar's high/low. If both
      could have been hit in the same bar we assume the **stop** filled first
      (pessimistic), so the backtest never flatters itself.
    * Taker fees are charged on entry and exit.

Multi-symbol portfolio backtests can be built by running this per symbol and
aggregating; the risk limits in RiskManager already support that extension.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional, Sequence

from .candles import Candle
from .metrics import Report, build_report
from .portfolio import Portfolio, Position
from .risk import RiskManager
from .strategy import Signal, Strategy


@dataclass
class BacktestResult:
    report: Report
    portfolio: Portfolio
    equity_curve: List[float]
    skipped_min_order: int = 0  # signals dropped because the position was too small


def _day_of(ts: int) -> int:
    return ts // 86400


def run_backtest(
    candles: Sequence[Candle],
    strategy: Strategy,
    risk: RiskManager,
    symbol: str = "ASSET",
    start_cash: float = 10_000.0,
    fee_rate: float = 0.0016,
    bars_per_day: int = 24,
    min_order_quote: float = 0.0,
    verbose: bool = False,
) -> BacktestResult:
    pf = Portfolio(cash=start_cash, fee_rate=fee_rate)
    equity_curve: List[float] = []
    pending: Optional[Signal] = None
    skipped_min_order = 0

    cur_day = _day_of(candles[strategy.warmup].ts) if len(candles) > strategy.warmup else 0
    day_start_equity = start_cash

    for i, c in enumerate(candles):
        price_map = {symbol: c.close}

        # New trading day? reset the daily-loss baseline.
        if _day_of(c.ts) != cur_day:
            cur_day = _day_of(c.ts)
            day_start_equity = pf.equity(price_map)

        # 1) Execute a pending entry at THIS bar's open (signal was from prior bar).
        if pending is not None and pf.open_count == 0:
            equity_now = pf.equity({symbol: c.open})
            day_pnl_pct = (equity_now - day_start_equity) / day_start_equity if day_start_equity else 0.0
            ok, _ = risk.can_open(pf.open_count, day_pnl_pct)
            if ok and risk.accepts_reward_risk(pending.reward_risk):
                qty = risk.position_size(equity_now, c.open, pending.stop)
                # Exchanges reject orders below a minimum notional. With small
                # capital the risk-sized position can fall under it — model that
                # so the backtest shows at WHICH capital the bot can actually trade.
                if qty > 0 and min_order_quote > 0 and qty * c.open < min_order_quote:
                    skipped_min_order += 1
                    qty = 0.0
                if qty > 0:
                    # Re-anchor stop/TP to the actual fill (open), preserving distances.
                    entry = c.open
                    if pending.side == "long":
                        stop = entry - pending.risk_per_unit
                        tp = entry + (pending.take_profit - pending.entry)
                    else:
                        stop = entry + pending.risk_per_unit
                        tp = entry - (pending.entry - pending.take_profit)
                    pf.open(Position(symbol, pending.side, qty, entry, stop, tp, c.ts))
                    if verbose:
                        print(f"[{c.ts}] OPEN {pending.side} {qty:.6f} @ {entry:.2f} "
                              f"stop {stop:.2f} tp {tp:.2f} | {', '.join(pending.reasons)}")
            pending = None

        # 2) Manage an open position: stop first (pessimistic), then take-profit.
        pos = pf.positions.get(symbol)
        if pos is not None:
            if pos.side == "long":
                if c.low <= pos.stop:
                    pf.close(symbol, pos.stop, c.ts, "stop")
                elif c.high >= pos.take_profit:
                    pf.close(symbol, pos.take_profit, c.ts, "take_profit")
            else:  # short
                if c.high >= pos.stop:
                    pf.close(symbol, pos.stop, c.ts, "stop")
                elif c.low <= pos.take_profit:
                    pf.close(symbol, pos.take_profit, c.ts, "take_profit")
            if verbose and symbol not in pf.positions and pf.trades:
                t = pf.trades[-1]
                print(f"[{c.ts}] CLOSE {t.side} @ {t.exit:.2f} pnl {t.pnl:+.2f} ({t.reason})")

        # 3) Evaluate a new signal on this bar's close (executed next bar).
        if pf.open_count == 0 and pending is None:
            sig = strategy.evaluate(candles, i)
            if sig.side in ("long", "short"):
                pending = sig

        equity_curve.append(pf.equity({symbol: c.close}))

    # Mark-to-close: flatten any position still open at the end so the reported
    # equity is fully realized (no dangling unrealized PnL in the final number).
    if pf.open_count and candles:
        last = candles[-1]
        pf.close(symbol, last.close, last.ts, "eod")
        if equity_curve:
            equity_curve[-1] = pf.cash

    report = build_report(pf.trades, equity_curve, bars_per_day=bars_per_day)
    return BacktestResult(report=report, portfolio=pf, equity_curve=equity_curve,
                          skipped_min_order=skipped_min_order)
