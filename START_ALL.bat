@echo off
echo ========================================
echo  Starting Land Registry System
echo ========================================
echo.
echo This will open TWO windows:
echo 1. Backend Server (Port 5000)
echo 2. Frontend Application (Port 3000)
echo.
echo Please wait for both to start...
echo.

echo Starting Backend...
start "Land Registry Backend" cmd /k "START_BACKEND.bat"

timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Land Registry Frontend" cmd /k "START_FRONTEND.bat"

echo.
echo ========================================
echo  Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000/api/v1
echo Frontend: http://localhost:3000
echo.
echo Wait for both windows to show "ready" messages
echo Then open your browser to: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
