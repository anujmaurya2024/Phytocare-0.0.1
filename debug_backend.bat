@echo off
echo =========================================
echo  Diagnosing Backend Error...
echo =========================================
echo.
echo Please wait. This will log the error to debug_log.txt
echo.
cd /d "%~dp0backend"
echo --- PIP INSTALL --- > ..\debug_log.txt
py -3.11 -m pip install -r requirements.txt >> ..\debug_log.txt 2>&1
echo. >> ..\debug_log.txt
echo --- STARTING FASTAPI --- >> ..\debug_log.txt
py -3.11 -m uvicorn main:app --port 8000 >> ..\debug_log.txt 2>&1
echo.
echo Log created! You can close this window now.
pause
