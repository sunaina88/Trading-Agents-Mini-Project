#!/usr/bin/env pwsh

Write-Host "`n"
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "TRADING AGENTS MINI PROJECT - SETUP" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "`n"

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "`nPlease install Python 3.8+ from https://www.python.org" -ForegroundColor Yellow
    Write-Host "And make sure to check 'Add Python to PATH' during installation`n" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n[1/3] Installing Python dependencies...`n" -ForegroundColor Cyan
python -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nERROR: Failed to install Python dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n[2/3] Installing frontend dependencies...`n" -ForegroundColor Cyan
Set-Location tradingvite
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nERROR: Failed to install npm dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Set-Location ..

Write-Host "`n[3/3] Verifying installations...`n" -ForegroundColor Cyan
python -c "import flask; import ollama; import yfinance; print('✓ Python packages: OK')"
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nERROR: Python package verification failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n"
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "✓ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "`n"

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "`n1. Make sure Ollama is running:" -ForegroundColor White
Write-Host "   - Start Ollama from the application menu, OR" -ForegroundColor Gray
Write-Host "   - Run: ollama serve" -ForegroundColor Gray
Write-Host "`n2. In Terminal 1, start the API server:" -ForegroundColor White
Write-Host "   python api_server.py" -ForegroundColor Gray
Write-Host "`n3. In Terminal 2, start the frontend:" -ForegroundColor White
Write-Host "   cd tradingvite" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "`n4. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "`n"
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "`n"

Read-Host "Press Enter to exit"
