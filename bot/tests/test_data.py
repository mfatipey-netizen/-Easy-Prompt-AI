import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tbot import data as datamod


class TestCsv(unittest.TestCase):
    def test_roundtrip_preserves_candles(self):
        candles = datamod.synthetic(n=120, seed=5)
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "ohlcv.csv")
            datamod.save_csv(candles, path)
            loaded = datamod.load_csv(path)
        self.assertEqual(len(loaded), len(candles))
        for a, b in zip(candles, loaded):
            self.assertEqual(a.ts, b.ts)
            self.assertAlmostEqual(a.open, b.open, places=6)
            self.assertAlmostEqual(a.high, b.high, places=6)
            self.assertAlmostEqual(a.low, b.low, places=6)
            self.assertAlmostEqual(a.close, b.close, places=6)

    def test_load_tolerates_header_and_blank_lines(self):
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "h.csv")
            with open(path, "w", encoding="utf-8") as fh:
                fh.write("ts,open,high,low,close,volume\n")
                fh.write("\n")  # blank line
                fh.write("1600000000,10,12,9,11,100\n")
                fh.write("1600003600,11,13,10,12,120\n")
            loaded = datamod.load_csv(path)
        self.assertEqual(len(loaded), 2)
        self.assertEqual(loaded[0].close, 11.0)

    def test_load_via_unified_loader(self):
        candles = datamod.synthetic(n=60, seed=9)
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "x.csv")
            datamod.save_csv(candles, path)
            loaded = datamod.load("csv", path)
        self.assertEqual(len(loaded), 60)

    def test_empty_csv_raises(self):
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "empty.csv")
            with open(path, "w", encoding="utf-8") as fh:
                fh.write("ts,open,high,low,close,volume\n")
            with self.assertRaises(ValueError):
                datamod.load_csv(path)

    def test_synthetic_is_reproducible(self):
        a = datamod.synthetic(n=100, seed=3)
        b = datamod.synthetic(n=100, seed=3)
        self.assertEqual([c.close for c in a], [c.close for c in b])


if __name__ == "__main__":
    unittest.main()
