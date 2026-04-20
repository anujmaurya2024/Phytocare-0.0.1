@echo off
title PhytoCare - Launch All
echo.
echo  ============================================
echo   PhytoCare - Starting All Services
echo  ============================================
echo.

echo  Killing any process on port 8000 and 5173 (if occupied)...
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":8000"') do (
    taskkill /PID %%p /F >nul 2>&1
)
for /f "tokens=5" %%p in ('netstat -aon ^| findstr ":5173"') do (
    taskkill /PID %%p /F >nul 2>&1
)
timeout /t 2 >nul

echo  Starting FastAPI Backend in a new window...
start "PhytoCare - Backend" cmd /k "cd /d "%~dp0backend" && py -3.11 -m pip install -r requirements.txt && py -3.11 -m uvicorn main:app --reload --port 8000"

timeout /t 3 >nul

echo  Starting React Frontend in a new window...
start "PhytoCare - Frontend" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"

timeout /t 5 >nul

echo.
echo  Both services are starting up!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:8000
echo.

start chrome -incognito "http://localhost:5173"

echo  Press any key to close this launcher.
pause >nul
