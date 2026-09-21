@echo off
echo ========================================
echo  Land Registry Backend Server
echo ========================================
echo.

cd backend

echo Checking if .env exists...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend\.env file with your configuration!
    echo Press any key to continue after editing .env...
    pause
)

echo.
echo Starting MongoDB...
net start MongoDB 2>nul
if errorlevel 1 (
    echo MongoDB service not found or already running
)

echo.
echo Installing dependencies...
call npm install

echo.
echo Starting backend server...
echo Backend will be available at: http://localhost:5000
echo API Base URL: http://localhost:5000/api/v1
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
