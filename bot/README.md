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

## 🖱️ Easiest way: the desktop app (no command line)

If typing commands isn't your thing, use the friendly window instead:

1. Make sure **Python** is installed (from [python.org](https://python.org) — tick
   *"Add Python to PATH"* during setup). Nothing else to install for the app.
2. **Double-click `Run-TradingBot.bat`** (Windows). On macOS/Linux run
   `python app.py` from the `bot` folder.

A window opens where you can, top to bottom:

1. **Connect** — pick Kraken or Coinbase, paste your API key/secret, click
   *Connect & get balance*. Your cash balance appears.
2. **Suggested starting capital** — the app tells you a conservative amount to
   start with and warns when fees or a small balance would eat the account.
3. **Engaged capital** — type the exact amount you want to trade with; it shows
   the resulting per-trade risk.
4. **Backtest** — pick a timeframe and click *Run backtest*; it pulls **your
   exchange's real candles** and prints the report right there.

The app **never places live orders** — it's for connecting, sizing, and
backtesting. Going live stays a separate, deliberate step (below).

> Getting the files onto your PC first: on the GitHub branch page click
> **Code → Download ZIP**, extract it, open the `bot` folder, and double-click
> `Run-TradingBot.bat`.

## What's inside

```
bot/
├── app.py                 # desktop GUI (Tkinter) — connect, size, backtest
├── Run-TradingBot.bat     # one double-click launcher for Windows
├── bot.py                 # CLI entry point (backtest / paper / live)
├── config.example.json    # non-secret strategy + risk parameters
├── .env.example           # API keys & notifications (live only) — never commit real one
├── requirements.txt       # core needs nothing; ccxt only for live orders
├── tbot/
│   ├── candles.py         # OHLCV candle type + helpers
│   ├── indicators.py      # EMA, SMA, RSI, MACD, ATR, ADX, Bollinger (from scratch)
│   ├── patterns.py        # swings, support/resistance, engulfing, hammer, star
│   ├── strategy.py        # ConfluenceStrategy: score + trend/ADX quality gates
│   ├── risk.py            # position sizing, daily loss cap, exposure limits
│   ├── portfolio.py       # positions, trades, equity, PnL
│   ├── backtest.py        # no-look-ahead event-driven backtest engine
│   ├── metrics.py         # win rate, profit factor, drawdown, Sharpe, expectancy
│   ├── broker.py          # PaperBroker (sim) + CcxtBroker (real, gated)
│   ├── paper.py           # live polling loop (paper or live), pure `decide()` core
│   ├── data.py            # synthetic + Kraken/Coinbase public REST + CSV import/export
│   ├── live.py            # ccxt helpers: connect, read balance, fetch candles
│   ├── recommend.py       # starting-capital advice (fee-aware sizing)
│   ├── notify.py          # console + optional Telegram/webhook
│   └── config.py          # JSON config + env-based secrets
└── tests/                 # 19 unit tests, stdlib `unittest` (no pytest needed)
```

## Strategies

Two are built in — pick one in the app's *Strategy* dropdown or with
`--strategy` on the CLI (`confluence` or `sp2l`).

### SP2L — Spike-2-Leg (Poursamadi)

A faithful implementation of the *published* rules of Mohammad Ali Poursamadi's
SP2L strategy (not a copy of the proprietary TradingView Pine Script, which is
closed):

1. **Spike** — a sharp, fast impulse leg (≥ `spike_atr_mult` × ATR within
   `max_spike_bars`) that creates an imbalance/inefficiency.
2. **2-leg pullback** — a corrective AB=CD-style retrace that stays beyond the
   spike's origin (structure holds).
3. **Entry** — resumption in the spike's direction (higher-low after an up-spike,
   lower-high after a down-spike) once the current bar breaks the prior extreme.
4. **Stop** — the pullback extreme (or the spike origin).
5. **Target** — fixed reward:risk; **SP2L's own default is 1:1** (`reward_risk`).

> **Honest caveat.** SP2L was designed for **M1/M5 scalping** on low-cost markets
> (forex). On a crypto venue with ~0.5–1% round-trip fees, low-timeframe scalping
> bleeds to fees. Prefer higher timeframes here, and always backtest first. Note
> the 1:1 target conflicts with a 1:2 goal — raise `reward_risk` if you want 1:2,
> but expect the win rate to drop when the target is farther away.

### Confluence (the default)

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

A trade needs a combined **score ≥ `min_score`** (default 3) — strong confluence
only. On top of the score, two **quality gates** must also pass, and their whole
job is to lift the **win rate** by trading only high-probability setups:

- **Trend gate** (`use_trend_filter`, `trend_ema=200`): longs only above the
  EMA200, shorts only below it — never fight the dominant trend.
- **Trend-strength gate** (`use_adx_filter`, `adx_min=22`): trade only when ADX
  confirms a real trend; sit out choppy, range-bound noise (where win rate dies).

Stop-loss is **ATR-based** (`atr_stop_mult × ATR`); take-profit is a fixed
**1:2 reward:risk** (`reward_risk=2.0`, exactly what you asked for). Position size
comes from risk.py so a stop-out always costs a fixed fraction of equity.

> **On the "70%+ win rate" goal — read honestly.** At 1:2 reward:risk the
> *breakeven* win rate is only ~33%. A sustained **70% win rate at 1:2 would be a
> world-class edge** that essentially no public strategy achieves — high win rate
> and high reward:risk generally trade off against each other. The gates above
> give you the best *honest* shot at a high win rate, and the backtest's reality
> check tells you the **real** number and whether it met your `--target-winrate`.
> The bot will never fake the figure. Tune on real data, and judge it
> out-of-sample (`--split`) before believing any win rate.

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

### Deep history & out-of-sample validation

Public REST returns limited depth (Coinbase ~300 bars/request), so for serious
validation cache history to CSV once and reuse it — and always check performance
on data the strategy was **not** tuned on:

```bash
# Fetch deeper Coinbase history (pages backwards) and cache it to CSV:
python bot.py backtest --source coinbase --symbol BTC-USD --interval 3600 \
       --max-bars 3000 --save-csv btc_1h.csv

# Backtest from the cached CSV (offline, unlimited depth, any exporter's data):
python bot.py backtest --source csv --symbol btc_1h.csv

# Train/test split — the anti-overfitting check. Tune on the first 70%,
# then JUDGE the strategy on the untouched last 30%:
python bot.py backtest --source csv --symbol btc_1h.csv --split 0.7
```

If out-of-sample numbers are far worse than in-sample, your parameters are
over-fit to the past and will likely disappoint live — the single most common way
backtested bots lose money.

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

## Running it on forex

The engine is **market-agnostic** — it works on any OHLCV candles, and SP2L was
originally built *for* forex (where costs are far lower than crypto fees). Two ways:

**Backtest forex now — no broker, no new code.** In the app click
**“Backtest a CSV file… (forex / any market)”** and choose an OHLCV CSV, or on the
CLI use `--source csv`. Set **Fee %/side** low (majors ≈ 0.01–0.03%). Where to get
the CSV:
- **MetaTrader 4/5**: a broker chart → right-click → *Save As* / History Center export.
- **TradingView**: chart → *Export chart data* (needs a paid plan).
- **Dukascopy** historical data feed (free) or any CSV with
  `timestamp,open,high,low,close[,volume]` columns.

**Live/auto forex** needs a forex broker adapter (crypto libraries like ccxt don't
cover FX). The natural fit for a retail user is **MetaTrader 5** (official
`MetaTrader5` Python package; SP2L even ships MT4/MT5 versions) or **OANDA**
(REST API with a free practice account). That adapter isn't built yet — ask and it
can be added, mirroring the `live.py` exchange helper.

## Trading "gold" on a crypto exchange
Kraken/Coinbase don't list spot XAU. The crypto-native way to trade gold is
**PAXG (Pax Gold)** — a token where 1 PAXG ≈ 1 troy ounce of gold. Use the symbol
**`PAXG/USD`** in the app or CLI to backtest the strategy on gold's price.

## How much capital do I need? (min-order modelling)
Because sizing is `risk ÷ stop-distance` (capped by exposure), the position
*notional* is much larger than the amount you risk — so on a percentage basis the
backtest result is identical whether you start with $100 or $100k… **until** your
capital is so small that the position falls below the exchange's **minimum order
size**. Set that minimum (app: *Min order size (USD)*; CLI: `--min-order`) and the
backtest will **skip** any entry too small to place and report how many it skipped.
Raise your capital until "skipped" hits 0 — that's the smallest capital at which
the bot can actually run this strategy on this market.

## Notes, limits, and honest caveats
- **Crypto only** (Kraken & Coinbase), by request — no forex. The engine is
  asset-agnostic, so other venues could be added later, but nothing here targets FX.
- **Gold = PAXG/USD** on Kraken (tokenized gold), not spot XAU.
- Backtests assume your stop/limit fills happen at the modeled price; real fills
  suffer slippage, partial fills, and outages. PaperBroker models a little
  slippage; live results will differ.
- Public REST history is limited in depth (Coinbase ~300 bars/request). For long
  backtests, page the API or import a CSV — a natural next extension.
- This is not financial advice.
