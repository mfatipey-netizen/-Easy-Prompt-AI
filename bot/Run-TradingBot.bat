@echo off
title Easy Trading Bot
cd /d "%~dp0"

REM Try the normal Python command first, then the Windows "py" launcher.
python app.py
if %errorlevel%==9009 (
    echo "python" was not found, trying the Windows py launcher...
    py app.py
)

if %errorlevel% neq 0 (
    echo.
    echo ------------------------------------------------------------
    echo Something went wrong. If it says Python was not found,
    echo install Python from https://python.org and tick
    echo "Add Python to PATH" during setup, then run this again.
    echo ------------------------------------------------------------
    echo.
    pause
)
