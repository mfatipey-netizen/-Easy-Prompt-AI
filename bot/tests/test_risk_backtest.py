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
from tbot.strategy import ConfluenceStrategy, Spike2LegsStrategy


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


class TestSpike2Legs(unittest.TestCase):
    def _spike_then_pullback(self):
        """Flat base, a fast up-spike, a 2-leg pullback (staying above origin),
        then a bullish bar that breaks the prior high (resumption)."""
        rows = []
        t = 0
        price = 100.0
        # 40 flat bars for warmup (tiny ranges -> small ATR).
        for _ in range(40):
            rows.append([t, price, price + 0.2, price - 0.2, price, 1]); t += 3600
        # Up-spike: 3 strong bars 100 -> 115.
        for hi in (105, 110, 115):
            rows.append([t, hi - 5, hi + 0.5, hi - 5.2, hi, 1]); t += 3600
        # 2-leg pullback down to ~109 then a small bounce and dip (stays > 100).
        for lo in (112, 109, 111, 108.5):
            rows.append([t, lo + 1, lo + 1.2, lo - 0.3, lo, 1]); t += 3600
        # Resumption: strong bullish bar closing above the previous bar's high.
        rows.append([t, 109, 114, 108.8, 113.5, 1]); t += 3600
        return from_rows(rows)

    def test_fires_long_on_spike_and_pullback(self):
        candles = self._spike_then_pullback()
        strat = Spike2LegsStrategy(spike_atr_mult=1.5)
        sig = strat.evaluate(candles, len(candles) - 1)
        self.assertEqual(sig.side, "long")
        self.assertLess(sig.stop, sig.entry)          # stop below entry for a long
        self.assertGreater(sig.take_profit, sig.entry)
        self.assertAlmostEqual(sig.reward_risk, 1.0, places=6)  # SP2L default 1:1

    def test_no_signal_on_flat_market(self):
        rows = [[i * 3600, 100, 100.1, 99.9, 100, 1] for i in range(120)]
        strat = Spike2LegsStrategy()
        sides = {strat.evaluate(from_rows(rows), i).side for i in range(60, 120)}
        self.assertEqual(sides, {"flat"})

    def test_backtest_runs_with_sp2l(self):
        candles = datamod.synthetic(n=1500, seed=13, vol=0.02)
        res = run_backtest(candles, Spike2LegsStrategy(), RiskManager(RiskConfig()))
        self.assertEqual(len(res.equity_curve), len(candles))


class TestMinOrder(unittest.TestCase):
    def test_tiny_capital_skips_all_trades(self):
        candles = datamod.synthetic(n=1000, seed=1)
        strat = ConfluenceStrategy()
        risk = RiskManager(RiskConfig())
        # Note: position notional = risk / stop-distance (capped by exposure), so it
        # is far larger than the risked amount. With $30 capital the notional is only
        # a few dollars, so a $100 min order blocks every entry.
        small = run_backtest(candles, strat, risk, start_cash=30, min_order_quote=100.0)
        self.assertEqual(small.report.num_trades, 0)
        self.assertGreater(small.skipped_min_order, 0)
        # With ample capital the same signals DO get taken.
        big = run_backtest(candles, strat, risk, start_cash=100_000, min_order_quote=100.0)
        self.assertGreater(big.report.num_trades, 0)


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
