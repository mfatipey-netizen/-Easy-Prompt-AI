import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tbot import indicators as ind
from tbot.candles import from_rows


class TestIndicators(unittest.TestCase):
    def test_sma_basic(self):
        vals = [1, 2, 3, 4, 5]
        out = ind.sma(vals, 3)
        self.assertEqual(out[:2], [None, None])
        self.assertAlmostEqual(out[2], 2.0)
        self.assertAlmostEqual(out[3], 3.0)
        self.assertAlmostEqual(out[4], 4.0)

    def test_ema_seed_is_sma(self):
        vals = [float(i) for i in range(1, 21)]
        out = ind.ema(vals, 5)
        # First defined value (index 4) is the SMA of the first 5.
        self.assertAlmostEqual(out[4], sum(vals[:5]) / 5)
        # EMA of a monotonic series keeps rising.
        self.assertTrue(out[-1] > out[5])

    def test_rsi_all_gains_is_100(self):
        vals = [float(i) for i in range(1, 30)]
        out = ind.rsi(vals, 14)
        self.assertEqual(out[14 - 1], None)  # not enough yet at 13
        self.assertAlmostEqual(out[-1], 100.0)

    def test_rsi_all_losses_is_0(self):
        vals = [float(i) for i in range(30, 1, -1)]
        out = ind.rsi(vals, 14)
        self.assertAlmostEqual(out[-1], 0.0)

    def test_rsi_range_bounds(self):
        import random
        rng = random.Random(1)
        vals = [100.0]
        for _ in range(200):
            vals.append(max(1.0, vals[-1] * (1 + rng.uniform(-0.03, 0.03))))
        for v in ind.rsi(vals, 14):
            if v is not None:
                self.assertGreaterEqual(v, 0.0)
                self.assertLessEqual(v, 100.0)

    def test_atr_positive(self):
        rows = [[i, 10 + i, 12 + i, 9 + i, 11 + i, 1] for i in range(50)]
        candles = from_rows(rows)
        out = ind.atr(candles, 14)
        self.assertIsNone(out[13])
        self.assertTrue(all(v > 0 for v in out if v is not None))

    def test_macd_hist_sign(self):
        # Rising series -> fast EMA above slow -> positive macd line eventually.
        vals = [float(i) for i in range(1, 80)]
        macd_line, signal, hist = ind.macd(vals)
        self.assertTrue(macd_line[-1] > 0)
        self.assertEqual(len(hist), len(vals))

    def test_bollinger_orders(self):
        vals = [10.0 + (i % 5) for i in range(40)]
        up, mid, lo = ind.bollinger(vals, 20, 2.0)
        for u, m, l in zip(up, mid, lo):
            if None not in (u, m, l):
                self.assertGreaterEqual(u, m)
                self.assertGreaterEqual(m, l)


if __name__ == "__main__":
    unittest.main()
