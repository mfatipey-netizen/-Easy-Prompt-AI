import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tbot import live
from tbot.recommend import recommend_sizing


class TestRecommend(unittest.TestCase):
    def test_engage_and_risk_amounts(self):
        r = recommend_sizing(balance=10_000, taker_fee=0.0026,
                             risk_per_trade=0.01, engage_pct=0.10)
        self.assertAlmostEqual(r.engage_amount, 1_000.0)
        self.assertAlmostEqual(r.risk_amount_per_trade, 10.0)
        self.assertAlmostEqual(r.round_trip_fee_pct, 0.0052)

    def test_small_balance_warns(self):
        r = recommend_sizing(balance=50, taker_fee=0.006)
        self.assertTrue(any("sensible minimum" in w for w in r.warnings))

    def test_high_fee_venue_warns(self):
        r = recommend_sizing(balance=50_000, taker_fee=0.006)  # 1.2% round trip
        self.assertTrue(any("round-trip fee" in w for w in r.warnings))

    def test_healthy_account_no_balance_warning(self):
        r = recommend_sizing(balance=20_000, taker_fee=0.0016)  # low fee, big balance
        self.assertFalse(any("sensible minimum" in w for w in r.warnings))
        self.assertTrue(r.notes)


class _FakeClient:
    """Minimal stand-in for a ccxt client (no network)."""

    def fetch_balance(self):
        return {"total": {"USD": 1234.5, "USDT": 65.5, "BTC": 0.2}}

    def fetch_ohlcv(self, symbol, timeframe="1h", limit=1000):
        # ccxt returns ms timestamps, newest-or-oldest ordering varies.
        base = 1_700_000_000_000
        step = 3_600_000
        return [[base + i * step, 100 + i, 101 + i, 99 + i, 100.5 + i, 5.0]
                for i in range(limit)]


class TestLiveHelpers(unittest.TestCase):
    def test_account_cash_sums_only_quote_ccys(self):
        total, cash = live.account_cash(_FakeClient())
        self.assertAlmostEqual(total, 1234.5 + 65.5)
        self.assertIn("USD", cash)
        self.assertNotIn("BTC", cash)  # crypto excluded from cash

    def test_fetch_candles_converts_ms_to_seconds(self):
        candles = live.fetch_candles(_FakeClient(), "BTC/USD", "1h", 10)
        self.assertEqual(len(candles), 10)
        # 1_700_000_000_000 ms -> 1_700_000_000 s
        self.assertEqual(candles[0].ts, 1_700_000_000)
        self.assertTrue(all(c2.ts >= c1.ts for c1, c2 in zip(candles, candles[1:])))

    def test_timeframe_map(self):
        self.assertEqual(live.TIMEFRAME_SEC["1h"], 3600)
        self.assertEqual(live.TIMEFRAME_SEC["1d"], 86400)


if __name__ == "__main__":
    unittest.main()
