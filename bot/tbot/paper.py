"""Live loop for paper (and, with a real broker, live) trading.

The decision logic lives in ``decide`` — a pure function that takes the candle
history plus current position/equity and returns an Action. That makes it unit
testable and identical between paper and live; only the Broker differs.

``run_loop`` wires ``decide`` to a data source, a Broker, and a Notifier, polling
on a fixed cadence. It monitors stop-loss / take-profit against the latest price
on every poll, so exits do not wait for the next bar to close.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Callable, Dict, List, Optional, Sequence

from .broker import Broker, Fill
from .candles import Candle
from .portfolio import Portfolio, Position
from .risk import RiskManager
from .strategy import Strategy


@dataclass
class Action:
    kind: str  # "open" | "close" | "hold"
    side: str = ""            # for open
    qty: float = 0.0          # for open
    reason: str = ""
    stop: float = 0.0
    take_profit: float = 0.0


def decide(
    candles: Sequence[Candle],
    strategy: Strategy,
    risk: RiskManager,
    position: Optional[Position],
    equity: float,
    day_pnl_pct: float,
    last_price: float,
) -> Action:
    """One pure decision step over CLOSED candles + the latest price."""
    # 1) Exit management first.
    if position is not None:
        if position.side == "long":
            if last_price <= position.stop:
                return Action("close", reason="stop")
            if last_price >= position.take_profit:
                return Action("close", reason="take_profit")
        else:
            if last_price >= position.stop:
                return Action("close", reason="stop")
            if last_price <= position.take_profit:
                return Action("close", reason="take_profit")
        return Action("hold")

    # 2) Entry only when flat and allowed.
    ok, _ = risk.can_open(0 if position is None else 1, day_pnl_pct)
    if not ok:
        return Action("hold", reason="risk-halt")
    sig = strategy.evaluate(candles, len(candles) - 1)
    if sig.side in ("long", "short") and risk.accepts_reward_risk(sig.reward_risk):
        qty = risk.position_size(equity, sig.entry, sig.stop)
        if qty > 0:
            return Action(
                "open", side=sig.side, qty=qty, reason=", ".join(sig.reasons),
                stop=sig.stop, take_profit=sig.take_profit,
            )
    return Action("hold")


def run_loop(
    fetch: Callable[[], List[Candle]],
    strategy: Strategy,
    risk: RiskManager,
    broker: Broker,
    notifier,
    symbol: str = "ASSET",
    poll_seconds: int = 60,
    bars_per_day: int = 24,
    max_iterations: Optional[int] = None,
    sleep: Callable[[float], None] = time.sleep,
) -> Portfolio:
    """Poll the market, act on the last CLOSED bar, and manage exits live.

    ``max_iterations`` and ``sleep`` are injectable so tests can drive the loop
    deterministically without real time passing.
    """
    pf = Portfolio(cash=broker.balance(), fee_rate=getattr(broker, "fee_rate", 0.0016))
    last_ts: Optional[int] = None
    day_start_equity = pf.cash
    cur_day: Optional[int] = None
    iterations = 0

    while max_iterations is None or iterations < max_iterations:
        iterations += 1
        candles = fetch()
        if len(candles) < strategy.warmup + 2:
            sleep(poll_seconds)
            continue

        closed = candles[:-1]  # last bar may still be forming
        last = closed[-1]
        last_price = candles[-1].close
        price_map: Dict[str, float] = {symbol: last_price}

        day = last.ts // 86400
        if cur_day is None:
            cur_day = day
            day_start_equity = pf.equity(price_map)
        elif day != cur_day:
            cur_day = day
            day_start_equity = pf.equity(price_map)

        equity = pf.equity(price_map)
        day_pnl_pct = (equity - day_start_equity) / day_start_equity if day_start_equity else 0.0

        # Exit check happens every poll; entry check only on a newly closed bar.
        position = pf.positions.get(symbol)
        act = decide(closed, strategy, risk, position, equity, day_pnl_pct, last_price)

        if act.kind == "close" and position is not None:
            fill = broker.market_order(symbol, "sell" if position.side == "long" else "buy",
                                       position.qty, last_price, last.ts)
            pf.close(symbol, fill.price, last.ts, act.reason)
            notifier.send(f"CLOSE {position.side} {symbol} @ {fill.price:.2f} ({act.reason})")
        elif act.kind == "open" and position is None and last.ts != last_ts:
            fill: Fill = broker.market_order(symbol, "buy" if act.side == "long" else "sell",
                                             act.qty, last_price, last.ts)
            pf.open(Position(symbol, act.side, act.qty, fill.price, act.stop, act.take_profit, last.ts))
            notifier.send(
                f"OPEN {act.side} {act.qty:.6f} {symbol} @ {fill.price:.2f} "
                f"stop {act.stop:.2f} tp {act.take_profit:.2f} | {act.reason}"
            )
            last_ts = last.ts

        sleep(poll_seconds)

    return pf
