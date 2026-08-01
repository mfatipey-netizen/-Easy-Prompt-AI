#!/usr/bin/env python3
"""Export candles from MetaTrader 5 into a CSV the bot can backtest.

Usage:
    python mt5_export.py SYMBOL TIMEFRAME BARS [OUTPUT.csv]
    e.g.  python mt5_export.py XAUUSD M15 5000

Requirements:
    * The MetaTrader 5 terminal installed and **open + logged in** to your broker.
    * The MetaTrader5 Python package:  pip install MetaTrader5   (Windows only)

The output CSV (ts,open,high,low,close,volume) loads straight into the desktop
app's "Backtest a CSV file" button, or the CLI's `--source csv`.
"""

from __future__ import annotations

import sys

TF_NAMES = ("M1", "M5", "M15", "M30", "H1", "H4", "D1")


def main() -> int:
    try:
        import MetaTrader5 as mt5
    except ImportError:
        print("The MetaTrader5 package is not installed. Run:\n    pip install MetaTrader5")
        return 1

    symbol = sys.argv[1] if len(sys.argv) > 1 else "XAUUSD"
    tf_name = (sys.argv[2] if len(sys.argv) > 2 else "M15").upper()
    bars = int(sys.argv[3]) if len(sys.argv) > 3 else 5000
    out = sys.argv[4] if len(sys.argv) > 4 else f"{symbol}_{tf_name}.csv"

    tf_map = {
        "M1": mt5.TIMEFRAME_M1, "M5": mt5.TIMEFRAME_M5, "M15": mt5.TIMEFRAME_M15,
        "M30": mt5.TIMEFRAME_M30, "H1": mt5.TIMEFRAME_H1, "H4": mt5.TIMEFRAME_H4,
        "D1": mt5.TIMEFRAME_D1,
    }
    if tf_name not in tf_map:
        print(f"Unknown timeframe '{tf_name}'. Use one of: {', '.join(TF_NAMES)}")
        return 1

    if not mt5.initialize():
        print("Could not connect to MetaTrader 5.")
        print("Make sure the MT5 terminal is OPEN and logged in, then try again.")
        print("MT5 error:", mt5.last_error())
        return 1

    if not mt5.symbol_select(symbol, True):
        print(f"Symbol '{symbol}' was not found. Open MetaTrader's Market Watch and")
        print("copy the EXACT name your broker uses (e.g. XAUUSD, GOLD, EURUSD, EURUSD.m).")
        mt5.shutdown()
        return 1

    rates = mt5.copy_rates_from_pos(symbol, tf_map[tf_name], 0, bars)
    mt5.shutdown()

    if rates is None or len(rates) == 0:
        print("No data returned. Try fewer bars, or a different symbol/timeframe.")
        return 1

    with open(out, "w", newline="", encoding="utf-8") as fh:
        fh.write("ts,open,high,low,close,volume\n")
        for r in rates:  # fields: time, open, high, low, close, tick_volume, spread, real_volume
            fh.write(f"{int(r['time'])},{r['open']},{r['high']},{r['low']},{r['close']},{int(r['tick_volume'])}\n")

    print(f"\nSaved {len(rates)} candles to:  {out}")
    print("Next: open EasyTradingBot -> 'Backtest a CSV file' -> choose this file.")
    print("Tip: set Fee %/side to about 0.02 for forex/gold spreads.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
