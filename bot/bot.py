#!/usr/bin/env python3
"""tbot command-line entry point.

Examples
--------
Backtest on built-in synthetic data (no network, no keys):
    python bot.py backtest

Backtest on real Kraken history:
    python bot.py backtest --source kraken --symbol XBTUSD --interval 3600

Paper-trade on live Coinbase data (virtual money, no keys needed for data):
    python bot.py paper --source coinbase --symbol BTC-USD --interval 3600

Live trading is intentionally gated — see README before enabling it.
"""

from __future__ import annotations

import argparse
import sys

from tbot import data as datamod
from tbot.backtest import run_backtest
from tbot.broker import PaperBroker
from tbot.config import RunConfig, load_config, secret
from tbot.notify import Notifier
from tbot.paper import run_loop
from tbot.risk import RiskManager
from tbot.strategy import Spike2LegsStrategy


def _bars_per_day(interval_sec: int) -> int:
    return datamod.BARS_PER_DAY.get(interval_sec, max(1, 86400 // max(interval_sec, 1)))


def _run_and_print(cfg: RunConfig, candles, strat, risk, label, verbose, min_order=0.0):
    result = run_backtest(
        candles, strat, risk,
        symbol=cfg.symbol,
        start_cash=cfg.start_cash,
        fee_rate=cfg.fee_rate,
        bars_per_day=_bars_per_day(cfg.interval_sec),
        min_order_quote=min_order,
        verbose=verbose,
    )
    print(f"\n--- {label} ({len(candles)} bars) ---")
    for line in result.report.as_lines():
        print("  " + line)
    if result.skipped_min_order:
        print(f"  Skipped (below min order): {result.skipped_min_order} "
              f"— raise --cash until this hits 0 to find the capital the bot needs.")
    return result


def cmd_backtest(cfg: RunConfig, args) -> int:
    candles = datamod.load(cfg.source, cfg.symbol, cfg.interval_sec, max_bars=args.max_bars)
    if not candles:
        print("No candles loaded.", file=sys.stderr)
        return 2
    if args.save_csv:
        datamod.save_csv(candles, args.save_csv)
        print(f"Saved {len(candles)} candles to {args.save_csv}")

    strat = Spike2LegsStrategy() if args.strategy == "sp2l" else cfg.build_strategy()
    risk_cfg = cfg.build_risk()
    # Don't let the risk-manager's min R:R gate reject a strategy that legitimately
    # trades a lower reward:risk (SP2L is 1:1). Align the gate to the strategy.
    rr = getattr(strat, "reward_risk", None)
    if rr is not None:
        risk_cfg.min_reward_risk = min(risk_cfg.min_reward_risk, rr)
    risk = RiskManager(risk_cfg)
    mo = args.min_order

    print("\n=== Backtest report ===")
    print(f"Strategy {args.strategy} | source {cfg.source} | symbol {cfg.symbol} | "
          f"{len(candles)} bars @ {cfg.interval_sec}s")

    if args.split and 0.0 < args.split < 1.0:
        cut = int(len(candles) * args.split)
        in_sample, out_sample = candles[:cut], candles[cut:]
        if len(in_sample) <= strat.warmup or len(out_sample) <= strat.warmup:
            print("  (not enough bars on one side of the split; running whole set instead)")
            result = _run_and_print(cfg, candles, strat, risk, "Full sample", args.verbose, mo)
        else:
            _run_and_print(cfg, in_sample, strat, risk, "In-sample (train)", args.verbose, mo)
            result = _run_and_print(cfg, out_sample, strat, risk, "Out-of-sample (test)", args.verbose, mo)
            print("\n  ^ Judge the strategy on the OUT-OF-SAMPLE numbers. If they are much")
            print("    worse than in-sample, the parameters are over-fit to the past.")
    else:
        result = _run_and_print(cfg, candles, strat, risk, "Full sample", args.verbose, mo)

    print("\nReality check:")
    wr = result.report.win_rate
    tgt = args.target_winrate
    print(f"  Target win rate     : {tgt:.0f}%   |   achieved (last report): {wr:.1f}%")
    if wr >= tgt:
        print(f"  ✓ This run met your {tgt:.0f}% target — verify it HOLDS out-of-sample (--split) and in paper.")
    else:
        print(f"  ✗ This run did NOT reach {tgt:.0f}%. That is the honest result, not a bug.")
    print(f"  Note: at 1:2 reward:risk the BREAKEVEN win rate is only ~33%. A {tgt:.0f}% win rate")
    print(f"  at 1:2 would be a world-class edge; high win rate and high R:R usually trade off.")
    print(f"  Realised avg daily return: {result.report.avg_daily_return_pct:+.3f}%. Backtests are")
    print("  hypotheses, not guarantees — tune on real data, confirm out-of-sample, then paper.")
    return 0


def cmd_paper(cfg: RunConfig, args) -> int:
    if cfg.source == "synthetic":
        print("Paper mode needs a live source (kraken/coinbase). Use --source coinbase.", file=sys.stderr)
        return 2
    strat = cfg.build_strategy()
    risk = RiskManager(cfg.build_risk())
    broker = PaperBroker(cash=cfg.start_cash, fee_rate=cfg.fee_rate)
    notifier = Notifier(
        telegram_token=secret("TELEGRAM_TOKEN") or None,
        telegram_chat_id=secret("TELEGRAM_CHAT_ID") or None,
        webhook_url=secret("NOTIFY_WEBHOOK") or None,
    )

    def fetch():
        return datamod.load(cfg.source, cfg.symbol, cfg.interval_sec)

    notifier.send(f"Paper trading started: {cfg.symbol} on {cfg.source} (virtual {cfg.start_cash:.0f}).")
    pf = run_loop(
        fetch, strat, risk, broker, notifier,
        symbol=cfg.symbol,
        poll_seconds=cfg.poll_seconds,
        bars_per_day=_bars_per_day(cfg.interval_sec),
        max_iterations=args.iterations,
    )
    print(f"\nPaper session ended. Virtual cash: {pf.cash:,.2f} | closed trades: {len(pf.trades)}")
    return 0


def cmd_live(cfg: RunConfig, args) -> int:
    print(
        "Live trading is disabled in this CLI on purpose.\n"
        "Enable it deliberately: instantiate tbot.broker.CcxtBroker(..., "
        "i_understand_live_risk=True) with API keys from your environment, and\n"
        "only after backtest + a meaningful paper-trading period look healthy.\n"
        "See bot/README.md -> 'Going live'.",
        file=sys.stderr,
    )
    return 2


def build_parser() -> argparse.ArgumentParser:
    # Shared options live on a parent parser so they work whether they come
    # before OR after the subcommand (e.g. `bot.py backtest --source kraken`).
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--config", help="path to JSON config", default=None)
    common.add_argument("--source", help="synthetic | kraken | coinbase")
    common.add_argument("--symbol", help="e.g. XBTUSD (kraken) or BTC-USD (coinbase)")
    common.add_argument("--interval", type=int, help="bar interval in seconds")
    common.add_argument("--cash", type=float, help="starting cash")
    common.add_argument("--iterations", type=int, default=None, help="paper: stop after N polls")
    common.add_argument("--max-bars", type=int, default=300,
                        help="max bars to fetch (coinbase pages back for depth)")
    common.add_argument("--save-csv", default=None,
                        help="write the loaded candles to this CSV path (cache/reuse)")
    common.add_argument("--split", type=float, default=None,
                        help="backtest: train/test fraction, e.g. 0.7 for 70%% in-sample")
    common.add_argument("--target-winrate", type=float, default=70.0,
                        help="win-rate goal to compare the backtest against (default 70)")
    common.add_argument("--strategy", choices=("confluence", "sp2l"), default="confluence",
                        help="which strategy to run (sp2l = Spike-2-Leg)")
    common.add_argument("--min-order", type=float, default=0.0,
                        help="exchange min order size in quote ccy; skips too-small positions")
    common.add_argument("--verbose", action="store_true", help="print each trade")

    p = argparse.ArgumentParser(
        prog="bot",
        description="tbot — price-action + indicator trading bot",
        parents=[common],
    )
    sub = p.add_subparsers(dest="command", required=True)
    for name in ("backtest", "paper", "live"):
        sub.add_parser(name, parents=[common])
    return p


def merge_cli(cfg: RunConfig, args) -> RunConfig:
    if args.source:
        cfg.source = args.source
    if args.symbol:
        cfg.symbol = args.symbol
    if args.interval:
        cfg.interval_sec = args.interval
    if args.cash:
        cfg.start_cash = args.cash
    return cfg


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    cfg = merge_cli(load_config(args.config), args)
    if args.command == "backtest":
        return cmd_backtest(cfg, args)
    if args.command == "paper":
        return cmd_paper(cfg, args)
    if args.command == "live":
        return cmd_live(cfg, args)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
