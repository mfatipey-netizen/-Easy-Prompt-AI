@echo off
title Export MetaTrader 5 data to CSV
cd /d "%~dp0"

echo ============================================================
echo   Export candles from MetaTrader 5 into a CSV for backtest
echo ============================================================
echo.
echo   IMPORTANT: MetaTrader 5 must be OPEN and logged in first.
echo.

set /p SYMBOL="Symbol (e.g. XAUUSD for gold, EURUSD): "
set /p TF="Timeframe (M1 M5 M15 M30 H1 H4 D1): "
set /p BARS="How many bars (e.g. 5000): "

echo.
echo Installing the MetaTrader5 connector (first time only)...
python -m pip install --user MetaTrader5
if %errorlevel%==9009 py -m pip install --user MetaTrader5

echo.
echo Exporting...
python mt5_export.py %SYMBOL% %TF% %BARS%
if %errorlevel%==9009 py mt5_export.py %SYMBOL% %TF% %BARS%

echo.
echo ------------------------------------------------------------
echo If it said "Saved ... candles", the CSV is in THIS folder.
echo Open EasyTradingBot -> "Backtest a CSV file" -> pick it.
echo ------------------------------------------------------------
echo.
pause
