@echo off
title PhytoCare - Frontend (React + Vite)
color 0B
echo.
echo  ============================================
echo   PhytoCare - React Frontend
echo  ============================================
echo.

cd /d "%~dp0"

echo [1/2] Installing npm dependencies...
call npm install
echo.

echo [2/2] Starting Vite dev server...
echo.
echo  Website: http://localhost:5173
echo.
call npm run dev

pause
