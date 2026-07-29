"""tbot — a modular, exchange-connected trading bot core (pure standard library).

The whole engine (indicators, price-action, strategy, risk, backtest) is written
with the Python standard library only, so it runs and is testable with zero
`pip install`. Only *live order execution* optionally uses ``ccxt``.

IMPORTANT — read this once:
    No trading system can guarantee a profit, let alone a fixed "+1% per day".
    This bot is a research/execution framework. Treat backtest and paper-trading
    results as hypotheses, not promises. Never risk money you cannot afford to
    lose. See bot/README.md for the full disclaimer.
"""

__version__ = "0.1.0"
