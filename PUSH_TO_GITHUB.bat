@echo off
color 0A
echo ==============================================
echo       Pushing PhytoCare to GitHub
echo ==============================================
echo.

:: Check if git is initialized
if not exist .git (
    echo [1/4] Initializing new Git repository...
    git init
) else (
    echo [1/4] Git repository already initialized.
)

echo.
echo [2/4] Adding all files to Git...
git add .

echo.
echo [3/4] Committing changes...
git commit -m "Update PhytoCare to new version"

echo.
echo [4/4] Remote Configuration
set GITHUB_URL=https://github.com/anujmaurya2024/phytocare.git

git branch -M main
git remote remove origin >nul 2>&1
git remote add origin "%GITHUB_URL%"

echo.
echo Pushing code to GitHub...
git push -u origin main

echo.
echo ==============================================
echo   Done! Your code has been pushed.
echo ==============================================
pause
