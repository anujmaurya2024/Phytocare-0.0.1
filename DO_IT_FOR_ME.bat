@echo off
echo Opening the previous version in VS Code...
code "C:\Users\anjal\OneDrive\Desktop\major project"

echo Starting the previous version of PhytoCare...
cd /d "C:\Users\anjal\OneDrive\Desktop\major project"
if exist START_ALL.bat (
    call START_ALL.bat
) else (
    echo START_ALL.bat not found in the Desktop folder!
    pause
)
