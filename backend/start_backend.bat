@echo off
title PhytoCare - Backend (FastAPI)
color 0A
echo.
echo  ============================================
echo   PhytoCare - FastAPI Backend
echo  ============================================
echo.

cd /d "%~dp0"

echo [1/2] Installing Python dependencies...
py -3.11 -m pip install -r requirements.txt
echo.

echo [2/2] Starting FastAPI server on port 8000...
echo.
echo  API:  http://localhost:8000
echo  Docs: http://localhost:8000/docs
echo.
py -3.11 -m uvicorn main:app --reload --port 8000

pause
