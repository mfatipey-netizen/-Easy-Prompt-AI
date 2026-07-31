"""Capital-sizing advice: how much to start with so fees don't destroy the account.

Pure functions (no I/O) so the logic is unit-testable and the GUI stays thin.

The core honest point encoded here: every round trip pays the taker fee twice, so
a strategy must clear ~2×fee *just to break even*. If your capital is tiny, that
friction plus exchange minimum order sizes dominates everything — which is why we
recommend a conservative starting slice and warn loudly below a sensible floor.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

# Representative taker fees by exchange (worst realistic retail tier).
# ccxt can report the account's real fee; these are only fallbacks.
DEFAULT_TAKER_FEE = {"kraken": 0.0026, "coinbase": 0.006}


@dataclass
class Recommendation:
    balance: float
    taker_fee: float
    round_trip_fee_pct: float
    engage_pct: float
    engage_amount: float
    risk_per_trade: float
    risk_amount_per_trade: float
    min_sensible_capital: float
    warnings: List[str] = field(default_factory=list)
    notes: List[str] = field(default_factory=list)


def recommend_sizing(
    balance: float,
    taker_fee: float,
    risk_per_trade: float = 0.01,
    engage_pct: float = 0.10,
    min_notional: float = 10.0,
    floor: float = 200.0,
) -> Recommendation:
    """Advise how much capital to put to work.

    balance         : total account value (quote currency, e.g. USD).
    taker_fee       : per-side taker fee as a fraction (e.g. 0.0026 = 0.26%).
    risk_per_trade  : fraction of engaged capital risked per trade (default 1%).
    engage_pct      : conservative fraction of balance to deploy at first (10%).
    min_notional    : exchange minimum order size in quote currency.
    floor           : hard sensible-minimum capital for automated trading.
    """
    taker_fee = max(0.0, taker_fee)
    round_trip = 2.0 * taker_fee
    engage_amount = max(0.0, balance) * engage_pct
    risk_amount = engage_amount * risk_per_trade
    min_sensible = max(floor, min_notional * 20.0)

    warnings: List[str] = []
    notes: List[str] = []

    notes.append(
        f"Round-trip taker fee ≈ {round_trip * 100:.2f}%. Every trade must gain at "
        f"least that much just to break even — before any profit."
    )
    notes.append(
        f"Recommended start: put {engage_pct * 100:.0f}% of your balance to work "
        f"= {engage_amount:,.2f}. Risk {risk_per_trade * 100:.1f}% per trade "
        f"= {risk_amount:,.2f} at stop-out."
    )
    notes.append(
        "Start small on purpose. Increase engaged capital only after weeks of "
        "healthy paper (and then small live) results — never before."
    )

    if balance < min_sensible:
        warnings.append(
            f"Your balance ({balance:,.2f}) is below the sensible minimum "
            f"(~{min_sensible:,.0f}) for automated trading. At this size, fees and "
            f"exchange minimum orders will dominate your P&L. Strongly prefer PAPER "
            f"trading until your capital (or your proven edge) is larger."
        )
    if engage_amount < min_notional * 5:
        warnings.append(
            f"The recommended engaged amount ({engage_amount:,.2f}) is close to the "
            f"exchange minimum order ({min_notional:,.2f}). Positions will be coarse "
            f"and fee-heavy. Consider paper trading or a larger balance."
        )
    if round_trip >= 0.01:
        warnings.append(
            f"This venue's round-trip fee (~{round_trip * 100:.2f}%) is high. Favor "
            f"higher timeframes and fewer, higher-quality trades so fees don't "
            f"outrun your edge."
        )

    return Recommendation(
        balance=balance,
        taker_fee=taker_fee,
        round_trip_fee_pct=round_trip,
        engage_pct=engage_pct,
        engage_amount=engage_amount,
        risk_per_trade=risk_per_trade,
        risk_amount_per_trade=risk_amount,
        min_sensible_capital=min_sensible,
        warnings=warnings,
        notes=notes,
    )
