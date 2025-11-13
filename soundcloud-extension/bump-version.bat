@echo off
echo ========================================
echo Version Bump Tool
echo ========================================
echo.

if "%1"=="" (
    echo Usage: bump-version.bat [new-version]
    echo Example: bump-version.bat 1.0.1
    echo.
    echo Current version:
    type manifest.json | findstr "version"
    echo.
    pause
    exit /b 1
)

set NEW_VERSION=%1

echo Updating version to: %NEW_VERSION%
echo.

echo [1/2] Updating manifest.json...
powershell -Command "(Get-Content manifest.json) -replace '\"version\": \".*\"', '\"version\": \"%NEW_VERSION%\"' | Set-Content manifest.json"

echo [2/2] Updating updates.xml...
powershell -Command "(Get-Content updates.xml) -replace 'version=''.*''', 'version=''%NEW_VERSION%''' | Set-Content updates.xml"

echo.
echo ========================================
echo Version updated to: %NEW_VERSION%
echo ========================================
echo.
echo Next steps:
echo 1. Update CHANGELOG.md with changes
echo 2. Commit changes: git add . ^&^& git commit -m "Bump version to %NEW_VERSION%"
echo 3. Push to GitHub: git push origin master
echo.
pause
