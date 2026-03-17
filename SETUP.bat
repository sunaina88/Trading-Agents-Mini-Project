@echo off
REM Setup script for Trading Agents Mini Project
REM Installs all required Python packages

echo.
echo ======================================================================
echo TRADING AGENTS MINI PROJECT - SETUP
echo ======================================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python 3.8+ from https://www.python.org
    echo And make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo [1/3] Installing Python dependencies...
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Installing frontend dependencies...
cd tradingvite
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install npm dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Verifying installations...
python -c "import flask; import ollama; import yfinance; print('✓ Python packages: OK')"
if errorlevel 1 (
    echo ERROR: Python package verification failed
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo ✓ SETUP COMPLETE!
echo ======================================================================
echo.
echo Next steps:
echo.
echo 1. Make sure Ollama is running:
echo    - Start Ollama from the application menu, OR
echo    - Run: ollama serve
echo.
echo 2. In Terminal 1, start the API server:
echo    python api_server.py
echo.
echo 3. In Terminal 2, start the frontend:
echo    cd tradingvite
echo    npm run dev
echo.
echo 4. Open http://localhost:5173 in your browser
echo.
echo ======================================================================
echo.
pause
