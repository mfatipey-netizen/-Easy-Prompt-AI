@echo off
title Build Easy Trading Bot (.exe)
cd /d "%~dp0"

echo ============================================================
echo   Building a one-click EasyTradingBot.exe
echo   You only need to run this ONCE. It takes a few minutes.
echo ============================================================
echo.

echo [1/2] Installing the builder (PyInstaller)...
python -m pip install --user --upgrade pyinstaller
if %errorlevel%==9009 py -m pip install --user --upgrade pyinstaller

echo.
echo [2/2] Building the app (bundling Python, tkinter and ccxt)...
python -m PyInstaller --onefile --windowed --name EasyTradingBot ^
    --collect-all ccxt --collect-submodules tbot app.py
if %errorlevel%==9009 py -m PyInstaller --onefile --windowed --name EasyTradingBot ^
    --collect-all ccxt --collect-submodules tbot app.py

echo.
if exist "%~dp0dist\EasyTradingBot.exe" (
    echo ------------------------------------------------------------
    echo  DONE!  Your app is here:
    echo     %~dp0dist\EasyTradingBot.exe
    echo.
    echo  Double-click that .exe to run the bot from now on.
    echo  You can copy it anywhere - it needs nothing else installed.
    echo ------------------------------------------------------------
) else (
    echo Build did not finish. If it said Python was not found, install
    echo Python from https://python.org ^(tick "Add Python to PATH"^) and
    echo run this again. Otherwise copy the red error text and send it over.
)
echo.
pause
