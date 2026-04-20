@echo off
setlocal enabledelayedexpansion
title PhytoCare - Robust Launcher
color 0f

echo.
echo  ============================================
echo   PhytoCare - Deep Health Check ^& Start
echo  ============================================
echo.

:: ─── Check Python ───────────────────────────────────────────────────────────
echo [1/4] Checking Python environment...
set PY_CMD=
echo   Searching for compatible versions (3.12, 3.11, 3.10)...

:: Try explicit versions via py launcher
for %%v in (3.12 3.11 3.10) do (
    if not defined PY_CMD (
        py -%%v --version >nul 2>&1
        if !errorlevel! equ 0 (
            set PY_CMD=py -%%v
            echo   [SUCCESS] Found Python %%v
        )
    )
)

if not defined PY_CMD (
    echo   [INFO] No specific 3.x version found via py launcher.
    :: Check common install paths
    if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\python.exe" (
        set PY_CMD="C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python311\python.exe"
        echo   [SUCCESS] Found Python 3.11 in AppData
    ) else if exist "C:\Python311\python.exe" (
        set PY_CMD="C:\Python311\python.exe"
        echo   [SUCCESS] Found Python 3.11 in C:\Python311
    ) else (
        where py >nul 2>&1
        if !errorlevel! equ 0 (
            set PY_CMD=py
        ) else (
            where python >nul 2>&1
            if !errorlevel! equ 0 (
                set PY_CMD=python
            ) else (
                echo [ERROR] Python not found! Please install Python 3.11 and check 'Add to PATH'.
                pause
                exit /b
            )
        )
    )
)

:: Get final version for logging
for /f "tokens=*" %%i in ('%PY_CMD% --version') do set PY_VER=%%i
echo Final choice: %PY_CMD% (%PY_VER%)

if "%PY_VER:~7,4%"=="3.14" (
    echo.
    echo  [⚠️ WARNING] You are using Python 3.14 which IS NOT SUPPORTED by AI libraries.
    echo  Please install Python 3.11 and try again.
    echo.
)

:: ─── Check Node ─────────────────────────────────────────────────────────────
echo [2/4] Checking Node.js environment...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found! Please install Node.js.
    pause
    exit /b
)
echo Found npm.

:: ─── Check Port 8000 (Backend) ──────────────────────────────────────────────
echo [3/4] Cleaning up ports...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":8000"') do (
    echo Killing process %%p on port 8000...
    taskkill /PID %%p /F >nul 2>&1
)
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":5173"') do (
    echo Killing process %%p on port 5173...
    taskkill /PID %%p /F >nul 2>&1
)

:: ─── Start Backend ──────────────────────────────────────────────────────────
echo [4/4] Starting services...
echo Starting Backend...
echo --- BACKEND START --- > backend_log.txt
start "PhytoCare - Backend" cmd /k "cd /d "%~dp0backend" && %PY_CMD% -m pip install -r requirements.txt >> ..\backend_log.txt 2>&1 && %PY_CMD% -m uvicorn main:app --reload --port 8000 >> ..\backend_log.txt 2>&1"

timeout /t 2 >nul

echo Starting Frontend...
echo --- FRONTEND START --- > frontend_log.txt
start "PhytoCare - Frontend" cmd /k "cd /d "%~dp0frontend" && npm install >> ..\frontend_log.txt 2>&1 && npm run dev >> ..\frontend_log.txt 2>&1"

timeout /t 5 >nul

echo.
echo  ============================================
echo   Startup Complete!
echo  ============================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo.
echo  If Chrome doesn't open automatically, please open the URLs above.
echo.

start "" "http://localhost:5173"

pause
