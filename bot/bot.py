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


def _bars_per_day(interval_sec: int) -> int:
    return datamod.BARS_PER_DAY.get(interval_sec, max(1, 86400 // max(interval_sec, 1)))


def cmd_backtest(cfg: RunConfig, args) -> int:
    candles = datamod.load(cfg.source, cfg.symbol, cfg.interval_sec)
    strat = cfg.build_strategy()
    risk = RiskManager(cfg.build_risk())
    result = run_backtest(
        candles, strat, risk,
        symbol=cfg.symbol,
        start_cash=cfg.start_cash,
        fee_rate=cfg.fee_rate,
        bars_per_day=_bars_per_day(cfg.interval_sec),
        verbose=args.verbose,
    )
    print("\n=== Backtest report ===")
    print(f"Source {cfg.source} | symbol {cfg.symbol} | {len(candles)} bars @ {cfg.interval_sec}s")
    for line in result.report.as_lines():
        print("  " + line)
    print("\nReality check:")
    print(f"  A fixed '+1%/day' target would require ~{(1.01**365 - 1) * 100:,.0f}% per year.")
    print(f"  This run's realised avg daily return was {result.report.avg_daily_return_pct:+.3f}%.")
    print("  Backtest results are hypotheses, not guarantees. Validate in paper mode next.")
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
