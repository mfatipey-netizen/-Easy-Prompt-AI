# tbot — a price-action + indicator trading bot (Kraken / Coinbase)

A modular crypto trading bot built around **price action** (candlestick patterns,
support/resistance, breakouts) and classic **TradingView-style indicators**
(EMA, RSI, MACD, ATR, Bollinger) — with a serious **risk-management** layer and a
**backtest → paper → live** workflow.

The entire engine is **pure Python standard library**: you can backtest and
paper-trade on real market data with **zero `pip install`**. `ccxt` is needed only
if and when you place real orders.

---

## ⚠️ Read this first — the honest part

**No bot can guarantee profit, and certainly not a fixed "+1% per day."**

- +1%/day compounds to roughly **+3,700% per year**. The best quantitative funds
  in history earned tens of percent *per year*, with the world's top talent and
  billions in capital. A guaranteed daily profit is the signature promise of
  **Ponzi / HYIP scams**, not of real trading.
- Markets are noisy and adversarial. Even a genuinely good strategy has losing
  days, weeks, and months. **Risk management — not a magic signal — is what keeps
  you in the game.**
- This project's honest goal is a system with a *positive expectancy* and
  *controlled drawdown*, validated on data **before** any real money is at risk.
  On the built-in synthetic (random) data the default strategy **loses** money —
  by design, to remind you that an edge must be *proven*, never assumed.

Treat every backtest and paper result as a **hypothesis**. Never trade money you
cannot afford to lose. You are responsible for your own decisions and for
complying with the laws and taxes of your jurisdiction.

---

## What's inside

```
bot/
├── bot.py                 # CLI entry point (backtest / paper / live)
├── config.example.json    # non-secret strategy + risk parameters
├── .env.example           # API keys & notifications (live only) — never commit real one
├── requirements.txt       # core needs nothing; ccxt only for live orders
├── tbot/
│   ├── candles.py         # OHLCV candle type + helpers
│   ├── indicators.py      # EMA, SMA, RSI, MACD, ATR, Bollinger (from scratch)
│   ├── patterns.py        # swings, support/resistance, engulfing, hammer, star
│   ├── strategy.py        # ConfluenceStrategy: scores indicators + price action
│   ├── risk.py            # position sizing, daily loss cap, exposure limits
│   ├── portfolio.py       # positions, trades, equity, PnL
│   ├── backtest.py        # no-look-ahead event-driven backtest engine
│   ├── metrics.py         # win rate, profit factor, drawdown, Sharpe, expectancy
│   ├── broker.py          # PaperBroker (sim) + CcxtBroker (real, gated)
│   ├── paper.py           # live polling loop (paper or live), pure `decide()` core
│   ├── data.py            # synthetic generator + Kraken/Coinbase public REST
│   ├── notify.py          # console + optional Telegram/webhook
│   └── config.py          # JSON config + env-based secrets
└── tests/                 # 19 unit tests, stdlib `unittest` (no pytest needed)
```

## How the strategy works

`ConfluenceStrategy` never trades on a single signal. On each closed bar it
collects independent votes and only acts when the combined **score** clears a
threshold (`min_score`, default 2):

| Vote | Long when… | Short when… |
|------|-----------|-------------|
| Trend    | EMA20 > EMA50 | EMA20 < EMA50 |
| Momentum | MACD histogram > 0 | MACD histogram < 0 |
| Pullback | RSI ≤ 35 (oversold) | RSI ≥ 65 (overbought) |
| Price action | bullish engulfing / hammer | bearish engulfing / shooting star |
| Structure | close breaks recent resistance | close breaks recent support |

Stop-loss is **ATR-based** (`atr_stop_mult × ATR`), and take-profit is a fixed
reward:risk multiple (`reward_risk`, default 2:1). Position size then comes from
risk.py so a stop-out costs a fixed fraction of equity.

### Risk controls (risk.py)
- **`risk_per_trade`** (1%): a stop-out loses at most this fraction of equity.
- **`max_exposure`** (50%): cap on capital deployed in one position.
- **`max_open_positions`** (3): concurrency cap.
- **`daily_loss_limit`** (3%): after this daily drawdown, no new trades that day.
- **`min_reward_risk`** (1.5): reject signals whose R:R is too low.

## Quick start

```bash
cd bot

# 1) Backtest on built-in synthetic data — no network, no keys:
python bot.py backtest --verbose

# 2) Backtest on REAL Kraken history:
python bot.py backtest --source kraken --symbol XBTUSD --interval 3600

# 3) Backtest on REAL Coinbase history:
python bot.py backtest --source coinbase --symbol BTC-USD --interval 3600

# 4) Paper-trade on live data (virtual money; stop after N polls with --iterations):
python bot.py paper --source coinbase --symbol BTC-USD --interval 3600

# Run the tests:
python -m unittest discover -s tests
```

Use a config file instead of flags:

```bash
cp config.example.json config.json    # edit parameters
python bot.py backtest --config config.json
```

The backtest report includes win rate, profit factor, expectancy, **max
drawdown**, Sharpe, and the realised **average daily return** — printed next to
the "+1%/day" fantasy so you always see reality.

## The recommended workflow

1. **Backtest** across several symbols and market regimes (bull, bear, chop).
   Look for positive expectancy *after* fees — and a drawdown you could stomach.
2. **Tune** parameters, but beware over-fitting: a strategy tuned to look perfect
   on the past usually fails on the future. Prefer robust, boring settings.
3. **Paper-trade** on live data for a meaningful period (weeks, not hours).
4. **Only then** consider going live — with small size first.

## Going live (deliberately gated)

Live trading is **off by default** and the CLI won't do it for you. To enable it,
you write a few explicit lines using `CcxtBroker`, which itself refuses to start
unless you pass `i_understand_live_risk=True`:

```python
import os
from tbot.broker import CcxtBroker
from tbot.paper import run_loop
from tbot.strategy import ConfluenceStrategy
from tbot.risk import RiskManager, RiskConfig
from tbot.notify import Notifier
from tbot import data

broker = CcxtBroker(
    exchange="kraken",                       # or "coinbase"
    api_key=os.environ["KRAKEN_API_KEY"],
    secret=os.environ["KRAKEN_SECRET"],
    i_understand_live_risk=True,             # explicit, deliberate opt-in
)
run_loop(
    fetch=lambda: data.fetch_kraken("XBTUSD", 60),
    strategy=ConfluenceStrategy(),
    risk=RiskManager(RiskConfig()),
    broker=broker,
    notifier=Notifier(),
    symbol="XBT/USD",
    poll_seconds=60,
)
```

Keep API keys in environment variables / `.env` (never commit them), and start
with **withdrawal permissions disabled** on the exchange key and tiny position
sizes.

## Notes, limits, and honest caveats
- Stocks & forex were mentioned in the original request; this build targets the
  two crypto exchanges you asked to connect (Kraken, Coinbase). The engine is
  asset-agnostic, so a stock/forex data+broker adapter can be added later.
- Backtests assume your stop/limit fills happen at the modeled price; real fills
  suffer slippage, partial fills, and outages. PaperBroker models a little
  slippage; live results will differ.
- Public REST history is limited in depth (Coinbase ~300 bars/request). For long
  backtests, page the API or import a CSV — a natural next extension.
- This is not financial advice.
