@echo off
echo ========================================
echo  Land Registry Frontend Application
echo ========================================
echo.

cd frontend

echo Checking if .env exists...
if not exist .env (
    echo Creating .env file...
    echo VITE_API_URL=http://localhost:5000/api/v1 > .env
)

echo.
echo Installing dependencies...
call npm install

echo.
echo Starting frontend server...
echo Application will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
