@echo off
echo ========================================
echo Checking for updates...
echo ========================================
echo.

cd /d "D:\Dropbox\github\codejs"

echo Current local version:
type soundcloud-extension\manifest.json | findstr "version"

echo.
echo Fetching latest version from GitHub...
git fetch origin master

echo.
echo Checking if updates are available...
git status -uno

echo.
echo To update, run: update.bat
echo.
pause
