# 🚀 Installation & Setup - Complete Guide

## Before You Start

**You need:**
- Windows 10/11, macOS, or Linux
- Python 3.8 or higher
- Node.js 16+ (for frontend)
- Ollama with llama3.2 model
- ~8GB RAM for optimal performance

---

## Step 1️⃣: Install Python

**If you don't have Python installed:**

1. Go to: https://www.python.org/downloads/
2. Download Python 3.10 or 3.11
3. Run the installer
4. **IMPORTANT**: Check "✓ Add Python to PATH"
5. Click "Install Now"
6. Restart your computer

**Verify installation:**
```
python --version
```

---

## Step 2️⃣: Install Node.js (for Frontend)

**If you don't have Node.js installed:**

1. Go to: https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Click "Next" through all steps
5. Restart your computer

**Verify installation:**
```
node --version
npm --version
```

---

## Step 3️⃣: Install Ollama

**Download & Install:**
1. Go to: https://ollama.ai
2. Download for your OS
3. Run the installer
4. Open Ollama application

**Pull the llama3.2 model:**
```bash
ollama pull llama3.2
```

This downloads ~4.7GB. Depending on your internet, this takes 5-30 minutes.

**Verify it's running:**
```bash
curl http://localhost:11434/api/tags
```

**Keep it running:**
- Leave the Ollama application open, OR
- Run `ollama serve` in a terminal

---

## Step 4️⃣: Automatic Setup (Recommended)

Navigate to the project folder and run the setup script:

### 🪟 Windows Command Prompt
```cmd
SETUP.bat
```

### 🪟 Windows PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\SETUP.ps1
```

### 🐧 Mac/Linux (Git Bash)
```bash
bash ./SETUP.sh  # (if available)
# OR run manually below
```

### Manual Setup (All Platforms)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd tradingvite
npm install
cd ..
```

---

## Step 5️⃣: Run the Application

You need to run 3 services. **Open 3 separate terminals.**

### 🔵 Terminal 1: Keep Ollama Running
```bash
ollama serve
```

Or just keep the Ollama application open.

### 🟢 Terminal 2: Start API Server

**Windows:**
```cmd
START_API.bat
```

**Mac/Linux:**
```bash
python api_server.py
```

**Expected output:**
```
======================================================================
TRADING ANALYSIS API SERVER
======================================================================

API Endpoints:
  GET  /api/health              - Health check
  POST /api/analyze             - Run analysis
  GET  /api/results/<ticker>    - Get previous results
  GET  /api/tickers             - List analyzed tickers

======================================================================
Starting server on http://localhost:5000
======================================================================
```

### 🟡 Terminal 3: Start Frontend

**Windows:**
```cmd
START_FRONTEND.bat
```

**Mac/Linux:**
```bash
cd tradingvite
npm run dev
```

**Expected output:**
```
  VITE v7.2.4  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## Step 6️⃣: Open in Browser

Once all services are running, open:

## 👉 http://localhost:5173/

✅ **You're done! The application is ready to use.**

---

## 🎯 Using the App

1. **Select a stock** from the sidebar (India NSE, USA NASDAQ, China HKEX)
2. **View the live TradingView chart**
3. **Click "🚀 Run AI Analysis"**
4. **Wait** 30-120 seconds for analysis (first run trains ML model)
5. **See results**: Confidence gauge + detailed summary

---

## 📋 What Gets Installed

### Python Packages
```
Flask 2.3+          - Web server framework
flask-cors 4.0+     - Cross-origin requests
yfinance 0.2+       - Stock data
pandas 1.5+         - Data processing
numpy 1.24+         - Math operations
scikit-learn 1.3+   - Machine learning
ta 0.10+            - Technical analysis
requests 2.31+      - HTTP requests
ollama 0.1+         - Ollama LLM client
```

### Node Packages
```
React 19.2+         - UI framework
Vite 7.2+           - Build tool
React Router        - Navigation
Lucide React        - Icons
Recharts            - Charts (if needed)
ESLint              - Code linting
```

---

## 🆘 Troubleshooting Installation

### "Python not found"
```
Solution:
1. Install Python from https://www.python.org
2. During installation, CHECK "Add Python to PATH"
3. Restart computer
4. Test: python --version
```

### "npm not found"
```
Solution:
1. Install Node.js from https://nodejs.org
2. Restart computer
3. Test: npm --version
```

### "No module named 'flask'" or other package errors
```
Solution:
pip install -r requirements.txt
```

### "ollama package not found"
```
Solution:
pip install ollama
```

### "Ollama connection failed"
```
Solution:
1. Make sure Ollama application is open or
2. Run: ollama serve
3. Wait 5 seconds for it to start
4. Test: curl http://localhost:11434/api/tags
```

### "Port 5000 already in use"
```
Solution (Windows):
netstat -ano | findstr :5000
taskkill /PID <PID> /F

Solution (Mac/Linux):
lsof -ti :5000 | xargs kill -9
```

### "Cannot GET /analyze"
```
Solution:
1. Make sure Terminal 2 is running: START_API.bat
2. Check for errors in Terminal 2
3. Verify url is http://localhost:5000
```

### "Blank page or CORS errors"
```
Solution:
1. Check browser console (F12 → Console tab)
2. Make sure api_server.py is running
3. Hard refresh page: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

## 🎨 File Structure After Setup

```
Trading-Agents-Mini-Project/
├── SETUP.bat                          ← Run me first (Windows)
├── SETUP.ps1                          ← Or me first (PowerShell)
├── START_API.bat                      ← Start API server
├── START_FRONTEND.bat                 ← Start frontend
├── QUICKSTART.md                      ← Quick reference guide
├── SETUP_GUIDE.md                     ← Detailed guide
├── requirements.txt                   ← Python dependencies
│
├── api_server.py                      ← Backend API
├── ollama_trading_agent.py
├── technicalanalyst.py
│
├── TradingAgents/                     ← Analysis engine
│   ├── data_collector.py
│   ├── debate_engine.py
│   └── agents/
│
├── news&sentiment_Analyst/            ← Sentiment analysis
│   └── agents/
│
├── tradingvite/                       ← Frontend React app
│   ├── src/
│   │   ├── Markets.jsx                ← Main UI
│   │   └── Markets.css
│   ├── package.json
│   └── node_modules/                  ← Created during setup
│
└── node_modules/                      ← Created during setup
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `python --version` shows 3.8+
- [ ] `node --version` shows 16+
- [ ] `npm --version` shows 8+
- [ ] Ollama application is open or `ollama serve` is running
- [ ] Terminal 2 shows API server on http://localhost:5000
- [ ] Terminal 3 shows frontend on http://localhost:5173
- [ ] Browser opens http://localhost:5173 without errors
- [ ] Console (F12) shows no CORS errors
- [ ] Can select a stock and click "Run AI Analysis"

---

## 📞 Still Having Issues?

1. **Check the error message** - It usually tells you what's wrong
2. **Restart all 3 terminals** - Sometimes services get stuck
3. **Verify Ollama is running** - This is critical
4. **Clear browser cache** - Ctrl+Shift+Delete and clear all
5. **Use a different browser** - Chrome, Firefox, Edge all work
6. **Check ports** - Make sure 5000 and 5173 are available

---

## 🎓 Learning Resources

- **Flask**: https://flask.palletsprojects.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Ollama**: https://ollama.ai/
- **Technical Analysis**: https://www.investopedia.com/

---

## 🔐 Security Notes

- This is a **local-only** application (localhost)
- No data is sent to external servers
- Ollama runs locally on your machine
- API server only accepts requests from your computer
- Frontend doesn't require internet after load

---

**You're all set! Enjoy the trading analysis app!** 🚀

For quick reference, see **QUICKSTART.md**
