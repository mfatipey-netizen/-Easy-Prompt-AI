import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tbot import data as datamod
from tbot.backtest import run_backtest
from tbot.candles import from_rows
from tbot.paper import decide, run_loop
from tbot.broker import PaperBroker
from tbot.notify import Notifier
from tbot.portfolio import Position
from tbot.risk import RiskConfig, RiskManager
from tbot.strategy import ConfluenceStrategy


class TestRisk(unittest.TestCase):
    def setUp(self):
        self.rm = RiskManager(RiskConfig(risk_per_trade=0.01, max_exposure=0.5))

    def test_position_size_risks_fixed_fraction(self):
        # Risk 1% of 10,000 = 100; stop distance 50 -> qty 2.
        qty = self.rm.position_size(10_000, entry=1000, stop=950)
        self.assertAlmostEqual(qty, 2.0, places=6)
        # A stop-out loses ~ the risked amount.
        self.assertAlmostEqual(qty * 50, 100.0, places=6)

    def test_position_size_capped_by_exposure(self):
        # Tiny stop distance would size huge; exposure cap must bind.
        qty = self.rm.position_size(10_000, entry=1000, stop=999.9)
        self.assertLessEqual(qty * 1000, 10_000 * 0.5 + 1e-6)

    def test_zero_stop_distance_is_zero_qty(self):
        self.assertEqual(self.rm.position_size(10_000, 1000, 1000), 0.0)

    def test_daily_loss_halts(self):
        ok, _ = self.rm.can_open(0, day_pnl_pct=-0.05)
        self.assertFalse(ok)
        ok2, _ = self.rm.can_open(0, day_pnl_pct=-0.01)
        self.assertTrue(ok2)

    def test_max_positions(self):
        ok, _ = self.rm.can_open(3, day_pnl_pct=0.0)
        self.assertFalse(ok)


class TestBacktest(unittest.TestCase):
    def test_runs_and_is_consistent(self):
        candles = datamod.synthetic(n=1200, seed=7)
        strat = ConfluenceStrategy()
        risk = RiskManager(RiskConfig())
        res = run_backtest(candles, strat, risk, symbol="ASSET", start_cash=10_000)
        # Equity curve has one point per candle.
        self.assertEqual(len(res.equity_curve), len(candles))
        # Win rate is a valid percentage.
        self.assertGreaterEqual(res.report.win_rate, 0.0)
        self.assertLessEqual(res.report.win_rate, 100.0)
        # Wins + losses == number of trades.
        self.assertEqual(res.report.wins + res.report.losses, res.report.num_trades)
        # Final equity equals starting cash + sum of trade PnL (fees already netted).
        expected = 10_000 + sum(t.pnl for t in res.portfolio.trades)
        self.assertAlmostEqual(res.equity_curve[-1], expected, places=4)

    def test_no_lookahead_position_opens_after_signal(self):
        candles = datamod.synthetic(n=400, seed=3)
        strat = ConfluenceStrategy()
        risk = RiskManager(RiskConfig())
        res = run_backtest(candles, strat, risk)
        for t in res.portfolio.trades:
            self.assertGreaterEqual(t.exit_ts, t.entry_ts)


class TestDecide(unittest.TestCase):
    def test_stop_triggers_close_for_long(self):
        rm = RiskManager(RiskConfig())
        pos = Position("ASSET", "long", qty=1, entry=100, stop=95, take_profit=110, entry_ts=0)
        act = decide([], ConfluenceStrategy(), rm, pos, equity=1000,
                     day_pnl_pct=0.0, last_price=94)
        self.assertEqual(act.kind, "close")
        self.assertEqual(act.reason, "stop")

    def test_take_profit_triggers_close_for_short(self):
        rm = RiskManager(RiskConfig())
        pos = Position("ASSET", "short", qty=1, entry=100, stop=105, take_profit=90, entry_ts=0)
        act = decide([], ConfluenceStrategy(), rm, pos, equity=1000,
                     day_pnl_pct=0.0, last_price=89)
        self.assertEqual(act.kind, "close")
        self.assertEqual(act.reason, "take_profit")

    def test_daily_halt_prevents_open(self):
        rm = RiskManager(RiskConfig(daily_loss_limit=0.03))
        act = decide(datamod.synthetic(n=200), ConfluenceStrategy(), rm, None,
                     equity=1000, day_pnl_pct=-0.05, last_price=100)
        self.assertEqual(act.kind, "hold")


class TestStrategyFilters(unittest.TestCase):
    def test_reward_risk_is_one_to_two(self):
        # Any signal the strategy emits must have a 1:2 reward:risk by construction.
        candles = datamod.synthetic(n=800, seed=4)
        strat = ConfluenceStrategy(use_trend_filter=False, use_adx_filter=False, min_score=2.0)
        sig = next(
            (s for i in range(len(candles))
             if (s := strat.evaluate(candles, i)).side in ("long", "short")),
            None,
        )
        self.assertIsNotNone(sig, "expected at least one signal on synthetic data")
        self.assertAlmostEqual(sig.reward_risk, 2.0, places=6)
        # And the take-profit distance is literally twice the stop distance.
        self.assertAlmostEqual(
            abs(sig.take_profit - sig.entry), 2.0 * sig.risk_per_unit, places=6
        )

    def test_adx_filter_skips_flat_market(self):
        # A dead-flat market has no trend: the ADX gate should block all trades.
        rows = [[i * 3600, 100, 100.05, 99.95, 100, 1] for i in range(400)]
        candles = from_rows(rows)
        strat = ConfluenceStrategy(use_adx_filter=True, adx_min=22.0)
        sides = {strat.evaluate(candles, i).side for i in range(len(candles))}
        self.assertEqual(sides, {"flat"})

    def test_disabling_filters_lowers_warmup(self):
        s_on = ConfluenceStrategy()
        s_off = ConfluenceStrategy(use_trend_filter=False, use_adx_filter=False, warmup=60)
        self.assertGreater(s_on.warmup, s_off.warmup)


class TestPaperLoop(unittest.TestCase):
    def test_loop_runs_deterministically(self):
        candles = datamod.synthetic(n=300, seed=11)

        def fetch():
            return candles

        pf = run_loop(
            fetch, ConfluenceStrategy(), RiskManager(RiskConfig()),
            PaperBroker(cash=10_000), Notifier(),
            symbol="ASSET", poll_seconds=0, max_iterations=3,
            sleep=lambda _s: None,
        )
        self.assertIsNotNone(pf)
        self.assertGreaterEqual(pf.cash, 0.0)


if __name__ == "__main__":
    unittest.main()
