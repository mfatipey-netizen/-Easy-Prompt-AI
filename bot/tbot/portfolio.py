"""Portfolio bookkeeping: open positions, closed trades, equity and PnL."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass
class Position:
    symbol: str
    side: str  # "long" | "short"
    qty: float
    entry: float
    stop: float
    take_profit: float
    entry_ts: int
    entry_fee: float = 0.0  # taker fee paid to open, folded into PnL at close

    def unrealized(self, price: float) -> float:
        if self.side == "long":
            return (price - self.entry) * self.qty
        return (self.entry - price) * self.qty


@dataclass
class Trade:
    symbol: str
    side: str
    qty: float
    entry: float
    exit: float
    entry_ts: int
    exit_ts: int
    pnl: float
    reason: str  # "take_profit" | "stop" | "signal" | "eod"

    @property
    def return_pct(self) -> float:
        cost = self.entry * self.qty
        return (self.pnl / cost) if cost else 0.0


@dataclass
class Portfolio:
    cash: float
    fee_rate: float = 0.0016  # 0.16% taker (Kraken/Coinbase-ish); override per venue
    positions: Dict[str, Position] = field(default_factory=dict)
    trades: List[Trade] = field(default_factory=list)

    def equity(self, prices: Dict[str, float]) -> float:
        total = self.cash
        for sym, pos in self.positions.items():
            price = prices.get(sym, pos.entry)
            total += pos.unrealized(price)
        return total

    def open(self, pos: Position) -> None:
        # Record the entry fee on the position; it is realized into PnL at close,
        # so that when flat, cash == start_cash + sum(trade.pnl) exactly.
        pos.entry_fee = pos.entry * pos.qty * self.fee_rate
        self.positions[pos.symbol] = pos

    def close(self, symbol: str, price: float, ts: int, reason: str) -> Optional[Trade]:
        pos = self.positions.pop(symbol, None)
        if pos is None:
            return None
        gross = pos.unrealized(price)
        exit_fee = price * pos.qty * self.fee_rate
        pnl = gross - pos.entry_fee - exit_fee
        self.cash += pnl
        trade = Trade(
            symbol=symbol,
            side=pos.side,
            qty=pos.qty,
            entry=pos.entry,
            exit=price,
            entry_ts=pos.entry_ts,
            exit_ts=ts,
            pnl=pnl,
            reason=reason,
        )
        self.trades.append(trade)
        return trade

    @property
    def open_count(self) -> int:
        return len(self.positions)
