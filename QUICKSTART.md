# 🚀 Quick Start Guide

## ⚡ One-Time Setup (5 minutes)

### Option 1: Automatic Setup (Recommended)

**On Windows Command Prompt:**
```batch
SETUP.bat
```

**On Windows PowerShell:**
```powershell
.\SETUP.ps1
```

This script will:
- ✅ Install all Python packages
- ✅ Install all frontend dependencies  
- ✅ Verify everything is working

### Option 2: Manual Setup

**Step 1: Install Python Dependencies**
```bash
pip install -r requirements.txt
```

**Step 2: Install Frontend Dependencies**
```bash
cd tradingvite
npm install
cd ..
```

---

## 🎯 Running the Application

Once setup is complete, you need to run 3 services:

### Service 1️⃣: Ollama (keeps running in background)

**Windows:**
- Open Ollama application from Start Menu, OR
- Command line: `ollama serve`

### Service 2️⃣: API Server (Terminal 1)

**Windows Command Prompt:**
```batch
START_API.bat
```

**Windows PowerShell:**
```powershell
python api_server.py
```

**Manual (Git Bash/WSL):**
```bash
python api_server.py
```

Look for:
```
======================================================================
TRADING ANALYSIS API SERVER
======================================================================
Starting server on http://localhost:5000
======================================================================
```

### Service 3️⃣: Frontend Server (Terminal 2)

**Windows Command Prompt:**
```batch
START_FRONTEND.bat
```

**Windows PowerShell:**
```powershell
cd tradingvite
npm run dev
```

**Manual (Git Bash/WSL):**
```bash
cd tradingvite && npm run dev
```

Look for:
```
  VITE v7.2.4  ready in 123 ms
  ➜  Local:   http://localhost:5173/
```

---

## 🌐 Open the Application

Once all 3 services are running, open your browser:

**👉 http://localhost:5173/**

---

## 📊 How to Use

1. **Select Stock**: Click any company in the left sidebar
   - India (NSE): INFY, TCS, RELIANCE, etc.
   - USA (NASDAQ): AAPL, MSFT, GOOGL, etc.
   - China (HKEX): Tencent, Alibaba, etc.

2. **View Chart**: TradingView chart shows live price action

3. **Click "🚀 Run AI Analysis"**: Triggers:
   - News analysis (financial news sentiment)
   - Social sentiment (Reddit, StockTwits)
   - Technical analysis (RSI, MACD, RandomForest ML)
   - Multi-agent debate (Bull vs Bear)
   - Final consensus decision

4. **View Results**:
   - 🎯 Confidence gauge (% with color)
   - 📈 Verdict (BUY, SELL, or HOLD in bold)
   - 📋 Detailed summary of all signals

---

## 🆘 Troubleshooting

### "Cannot connect to API"
- Make sure `START_API.bat` or `python api_server.py` is running
- Check that port 5000 is not in use: `netstat -ano | findstr :5000`

### "Python not found"
- Install from: https://www.python.org
- Choose "Add Python to PATH" during installation
- Restart Windows after installation

### "npm not found"
- Install Node.js from: https://nodejs.org/
- Choose LTS version
- Restart Windows after installation

### "No module named 'ollama'"
- Run: `pip install -r requirements.txt` again
- Make sure Ollama is running (`ollama serve`)

### "Analysis takes too long"
- First run trains ML model (~2 minutes) - this is normal
- Subsequent runs are faster
- Make sure Ollama/llama3.2 is running

### "Empty results or error message"
- Check browser console for errors (F12 → Console)
- Verify API server is running
- Try different stock ticker
- Check that all agents are installed

---

## 📁 Quick File Reference

| File | Purpose |
|------|---------|
| `SETUP.bat` | Windows - One-click setup |
| `SETUP.ps1` | PowerShell - One-click setup |
| `START_API.bat` | Start API server (Windows) |
| `START_FRONTEND.bat` | Start frontend (Windows) |
| `api_server.py` | Backend API service |
| `tradingvite/` | Frontend Vite app |
| `requirements.txt` | Python dependencies |

---

## 🎨 What You'll See

```
┌─────────────────────────────────────────────┐
│  Markets (Header)                           │
├─────────────────┬───────────────────────────┤
│  Stocks         │  INFY                     │
│  ▼ India NSE    │  Infosys Limited          │
│  • INFY.NS ✓    │  ₹1,489    -0.61%         │
│  • TCS.NS       │                           │
│  • RELIANCE.NS  │  [🚀 Run AI Analysis]     │
│                 │                           │
│  ▼ USA NASDAQ   │  ┌─────────────────────┐  │
│  • AAPL         │  │ CONFIDENCE: 85%     │  │
│  • MSFT         │  │       🟢            │  │
│  • GOOGL        │  │  **BUY**            │  │
│  •              │  └─────────────────────┘  │
│                 │                           │
│  ▼ China HKEX   │  Analysis Summary:       │
│  • 0700.HK      │  ─────────────────────  │
│  • 9988.HK      │  [Summary text...]      │
│                 │                           │
│                 │ ─────────────────────   │
│                 │ [TradingView Chart]     │
│                 │ ─────────────────────   │
└─────────────────┴───────────────────────────┘
```

---

## ✨ Tips

- 💡 First analysis may take 1-2 minutes (ML model training)
- 💡 Subsequent analyses are faster
- 💡 Confidence gauge color:
  - 🟢 Green (80-100%): Strong signal
  - 🟡 Yellow (40-60%): Moderate signal  
  - 🔴 Red (0-20%): Weak signal
- 💡 Keep Ollama running in the background
- 💡 You can run multiple analyses in sequence

---

## ❌ Common Issues Solved

**"ModuleNotFoundError: No module named 'ollama'"**
→ Run: `pip install -r requirements.txt`

**"Cannot GET /api/analyze"**
→ Make sure `api_server.py` is running (START_API.bat)

**"Blank page on localhost:5173"**
→ Check if `npm run dev` is running (START_FRONTEND.bat)

**"CORS error in console"**
→ Make sure API server is running on port 5000

---

## 📞 Support

If stuck:
1. Check the error message in the terminal
2. Verify all 3 services are running (Ollama, API, Frontend)
3. Restart the API server: Stop with Ctrl+C, then run START_API.bat again
4. Check that ports 5000 and 5173 are available

---

**Last Updated**: March 2026  
**System Status**: ✅ Ready to Use
