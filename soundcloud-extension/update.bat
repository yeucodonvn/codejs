@echo off
echo ========================================
echo SoundCloud AutoPlay Extension - Update
echo ========================================
echo.

cd /d "D:\Dropbox\github\codejs"

echo [1/3] Pulling latest changes from GitHub...
git pull origin master

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to pull from GitHub
    echo Please check your internet connection or Git installation
    pause
    exit /b 1
)

echo.
echo [2/3] Update successful!
echo.
echo [3/3] Next steps:
echo    1. Open Chrome and go to: chrome://extensions/
echo    2. Find "SoundCloud AutoPlay" extension
echo    3. Click the Reload button (circular arrow icon)
echo.
echo ========================================
echo Update completed successfully!
echo ========================================
pause
