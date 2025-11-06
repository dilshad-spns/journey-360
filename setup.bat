@echo off
echo ========================================
echo Journey 360 - Complete Setup
echo ========================================
echo.

REM Step 1: Install dependencies
echo [Step 1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo Warning: npm install had issues, but continuing...
)
echo.

REM Step 2: Prepare build
echo [Step 2/4] Fixing versioned imports...
call npm run prepare-build
if errorlevel 1 (
    echo Warning: prepare-build had issues, but continuing...
)
echo.

REM Step 3: Docs reorganization
echo [Step 3/4] Documentation organization
set /p REORGANIZE="Move all docs to /docs folder? (y/n): "
if /i "%REORGANIZE%"=="y" (
    call npm run reorganize-docs
    if errorlevel 0 (
        echo Documentation organized in /docs
    )
) else (
    echo Skipped documentation reorganization
)
echo.

REM Step 4: Environment setup
echo [Step 4/4] Environment setup
if not exist .env.local (
    set /p CREATEENV="Create .env.local from template? (y/n): "
    if /i "%CREATEENV%"=="y" (
        copy .env.example .env.local
        echo Created .env.local ^(edit with your values^)
    )
) else (
    echo .env.local already exists
)
echo.

REM Summary
echo ========================================
echo Setup Complete!
echo.
echo Next steps:
echo   1. Start development server:
echo      npm run dev
echo.
echo   2. Build for production:
echo      npm run build
echo.
echo   3. Configure environment (optional):
echo      Edit .env.local
echo.
echo Visit: http://localhost:3000
echo ========================================
pause
