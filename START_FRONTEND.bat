@echo off
REM Start the Vite Frontend Dev Server

echo.
echo ======================================================================
echo STARTING TRADING VITE FRONTEND
echo ======================================================================
echo.
echo The frontend will start on: http://localhost:5173
echo.
echo Make sure the API server (api_server.py) is already running!
echo.
echo Press CTRL+C to stop the server
echo.
echo ======================================================================
echo.

cd tradingvite
npm run dev
