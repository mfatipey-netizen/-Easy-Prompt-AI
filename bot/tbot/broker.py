"""Order execution brokers.

Two implementations share one interface:
    * ``PaperBroker``  — simulates fills at the current price, tracks a virtual
      balance. Uses real market data but never touches your exchange account.
    * ``CcxtBroker``   — places REAL orders on Kraken/Coinbase via ``ccxt``.
      Requires API keys and is only imported when actually used, so the rest of
      the bot has no hard dependency on ccxt.

Both return a normalized ``Fill``. The live loop (paper.py) is written against the
interface, so switching paper -> live is a one-line config change once you have
proven the strategy in backtest and paper.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Protocol


@dataclass
class Fill:
    symbol: str
    side: str  # "buy" | "sell"
    qty: float
    price: float
    fee: float
    ts: int


class Broker(Protocol):
    def market_order(self, symbol: str, side: str, qty: float, ref_price: float, ts: int) -> Fill: ...
    def balance(self) -> float: ...


@dataclass
class PaperBroker:
    cash: float
    fee_rate: float = 0.0016
    slippage: float = 0.0005  # 5 bps of adverse slippage on market orders

    def market_order(self, symbol: str, side: str, qty: float, ref_price: float, ts: int) -> Fill:
        # Model slippage as always working against us.
        price = ref_price * (1 + self.slippage) if side == "buy" else ref_price * (1 - self.slippage)
        fee = price * qty * self.fee_rate
        self.cash -= fee
        return Fill(symbol, side, qty, price, fee, ts)

    def balance(self) -> float:
        return self.cash


class CcxtBroker:
    """Live broker. Instantiated only when running in live mode.

    SAFETY: this class places real orders. It refuses to initialize unless
    ``i_understand_live_risk=True`` is passed, to make live trading an explicit,
    deliberate act rather than a default.
    """

    def __init__(
        self,
        exchange: str,
        api_key: str,
        secret: str,
        i_understand_live_risk: bool = False,
        password: Optional[str] = None,
    ):
        if not i_understand_live_risk:
            raise RuntimeError(
                "Refusing to start live trading. Pass i_understand_live_risk=True "
                "only after you have validated the strategy in backtest AND paper mode."
            )
        try:
            import ccxt  # imported lazily; only live mode needs it
        except ImportError as exc:  # pragma: no cover - environment dependent
            raise RuntimeError(
                "ccxt is required for live trading. Install it with `pip install ccxt`."
            ) from exc
        klass = getattr(ccxt, exchange)
        params = {"apiKey": api_key, "secret": secret, "enableRateLimit": True}
        if password:
            params["password"] = password
        self.client = klass(params)
        self.exchange = exchange

    def market_order(self, symbol: str, side: str, qty: float, ref_price: float, ts: int) -> Fill:  # pragma: no cover
        order = self.client.create_order(symbol, "market", side, qty)
        price = float(order.get("average") or order.get("price") or ref_price)
        fee_info = order.get("fee") or {}
        fee = float(fee_info.get("cost") or 0.0)
        return Fill(symbol, side, qty, price, fee, ts)

    def balance(self) -> float:  # pragma: no cover
        bal = self.client.fetch_balance()
        return float(bal.get("free", {}).get("USD", 0.0))
