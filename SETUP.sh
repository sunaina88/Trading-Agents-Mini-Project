#!/bin/bash
# Setup script for Trading Agents Mini Project
# Run this script to install all dependencies

echo ""
echo "======================================================================"
echo "TRADING AGENTS MINI PROJECT - SETUP"
echo "======================================================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not in PATH"
    echo ""
    echo "Please install Python 3.8+ from https://www.python.org"
    echo ""
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✓ Found: $PYTHON_VERSION"
echo ""

# Install Python dependencies
echo "[1/3] Installing Python dependencies..."
echo ""
python3 -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install Python dependencies"
    exit 1
fi

echo ""
echo ""

# Install frontend dependencies
echo "[2/3] Installing frontend dependencies..."
echo ""
cd tradingvite
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install npm dependencies"
    cd ..
    exit 1
fi
cd ..

echo ""
echo ""

# Verify installations
echo "[3/3] Verifying installations..."
echo ""
python3 -c "import flask; import ollama; import yfinance; print('✓ Python packages: OK')"
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Python package verification failed"
    exit 1
fi

echo ""
echo "======================================================================"
echo "✓ SETUP COMPLETE!"
echo "======================================================================"
echo ""

echo "Next steps:"
echo ""
echo "1. Make sure Ollama is running:"
echo "   brew install ollama  (Mac users: install Ollama)"
echo "   ollama pull llama3.2"
echo "   ollama serve"
echo ""
echo "2. In Terminal 1, start the API server:"
echo "   python3 api_server.py"
echo ""
echo "3. In Terminal 2, start the frontend:"
echo "   cd tradingvite"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "======================================================================"
echo ""
