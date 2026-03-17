import yfinance as yf
import pandas as pd
import numpy as np
from ta.momentum import RSIIndicator
from ta.trend import SMAIndicator

"""
AI Trading Agent — Future Prediction Mode
Uses latest live market data + Ollama LLM to predict upcoming BUY/SELL/HOLD signals
"""

import json
import requests
import yfinance as yf
from datetime import datetime, timedelta
from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands
import warnings
warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
OLLAMA_URL   = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2"

# How many future trading days to predict
PREDICT_DAYS = 5   # Next 5 trading days (≈ 1 week ahead)

# ── External Bear/Bull Signal ─────────────────
EXTERNAL_SIGNAL = {
    "signal": -1,
    "winner": "Bear",
    "confidence": 9,
    "recommended_action": "SELL",
    "deciding_factor": (
        "Regulatory uncertainty, deteriorating fundamentals, "
        "and unprecedented market conditions outweighed bull points."
    ),
}


# ─────────────────────────────────────────────
# OLLAMA HELPER
# ─────────────────────────────────────────────
def ask_ollama(prompt: str) -> str:
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.2}
            },
            timeout=90
        )
        response.raise_for_status()
        return response.json().get("response", "").strip()
    except requests.exceptions.ConnectionError:
        print("❌ Ollama not running. Run: ollama serve")
        raise
    except Exception as e:
        print(f"❌ Ollama error: {e}")
        raise


def parse_ollama_decision(raw: str) -> tuple[str, str]:
    try:
        start = raw.find("{")
        end   = raw.rfind("}") + 1
        if start != -1 and end > start:
            data   = json.loads(raw[start:end])
            action = data.get("action", "HOLD").upper()
            reason = data.get("reason", "")
            if action not in ("BUY", "SELL", "HOLD"):
                action = "HOLD"
            return action, reason
    except Exception:
        pass
    upper = raw.upper()
    if "BUY"  in upper: return "BUY",  raw[:100]
    if "SELL" in upper: return "SELL", raw[:100]
    return "HOLD", raw[:100]


def next_trading_days(n: int) -> list[str]:
    """Return next N weekday dates (Mon–Fri) from today."""
    days = []
    current = datetime.today()
    while len(days) < n:
        current += timedelta(days=1)
        if current.weekday() < 5:  # Mon=0 ... Fri=4
            days.append(current.strftime("%Y-%m-%d"))
    return days


# ─────────────────────────────────────────────
# PREDICTION AGENT
# ─────────────────────────────────────────────
class FuturePredictionAgent:
    def __init__(self, ticker: str):
        self.ticker = ticker

    # ── Fetch latest 3 months of data for indicators ──
    def fetch_latest_data(self):
        end   = datetime.today()
        start = end - timedelta(days=90)  # 3 months back for indicator warmup
        df = yf.download(
            self.ticker,
            start=start.strftime("%Y-%m-%d"),
            end=end.strftime("%Y-%m-%d"),
            auto_adjust=True,
            progress=False
        )
        if df.empty:
            raise ValueError(f"No data for {self.ticker}")
        return df

    # ── Compute indicators on recent data ─────
    def compute_indicators(self, df):
        close          = df["Close"].squeeze()
        df["SMA20"]    = SMAIndicator(close, window=20).sma_indicator()
        df["EMA9"]     = EMAIndicator(close, window=9).ema_indicator()
        df["RSI"]      = RSIIndicator(close, window=14).rsi()
        macd_obj       = MACD(close)
        df["MACD"]     = macd_obj.macd()
        df["MACD_sig"] = macd_obj.macd_signal()
        bb             = BollingerBands(close, window=20)
        df["BB_upper"] = bb.bollinger_hband()
        df["BB_lower"] = bb.bollinger_lband()
        return df.dropna()

    # ── Price trend summary (last 5 & 20 days) ──
    def price_trend_summary(self, df) -> str:
        closes = df["Close"].squeeze()
        last5  = closes.iloc[-5:].tolist()
        last20 = closes.iloc[-20:].tolist()
        trend5  = "UP" if last5[-1]  > last5[0]  else "DOWN"
        trend20 = "UP" if last20[-1] > last20[0] else "DOWN"
        change5  = (last5[-1]  - last5[0])  / last5[0]  * 100
        change20 = (last20[-1] - last20[0]) / last20[0] * 100
        return (
            f"5-day trend : {trend5} ({change5:+.2f}%)\n"
            f"20-day trend: {trend20} ({change20:+.2f}%)"
        )

    # ── Build prediction prompt ───────────────
    def build_prompt(self, row, today: str, predict_date: str, day_num: int) -> str:
        price    = float(row["Close"])
        sma20    = float(row["SMA20"])
        ema9     = float(row["EMA9"])
        rsi      = float(row["RSI"])
        macd     = float(row["MACD"])
        macd_sig = float(row["MACD_sig"])
        bb_upper = float(row["BB_upper"])
        bb_lower = float(row["BB_lower"])

        sig = EXTERNAL_SIGNAL
        signal_block = (
            f"Winner         : {sig['winner']} (confidence {sig['confidence']}/10)\n"
            f"Recommendation : {sig['recommended_action']}\n"
            f"Reason         : {sig['deciding_factor']}"
        )

        prompt = f"""
You are a professional stock market analyst specializing in short-term price prediction.

Today is {today}. Based on the CURRENT live market data below, predict what action 
a trader should take on {predict_date} (Day {day_num} ahead).

Ticker: {self.ticker}

Current Technical Indicators (as of today {today}):
- Price       : {price:.2f}
- SMA20       : {sma20:.2f}  → price is {"ABOVE" if price > sma20 else "BELOW"} the 20-day average
- EMA9        : {ema9:.2f}   → short-term trend is {"UP" if price > ema9 else "DOWN"}
- RSI(14)     : {rsi:.2f}    → {"OVERBOUGHT, expect pullback" if rsi > 70 else "OVERSOLD, possible bounce" if rsi < 30 else "NEUTRAL range"}
- MACD        : {macd:.4f}  vs Signal {macd_sig:.4f} → {"BULLISH crossover" if macd > macd_sig else "BEARISH crossover"}
- BB Upper    : {bb_upper:.2f} | BB Lower : {bb_lower:.2f}
  → Price is {"near UPPER band (overbought zone)" if price > bb_upper * 0.97 else "near LOWER band (oversold zone)" if price < bb_lower * 1.03 else "WITHIN normal bands"}

External Market Sentiment:
{signal_block}

Based on all of the above, predict for {predict_date}:
- If trend continues, should a trader BUY, SELL, or HOLD?
- Consider momentum, RSI extremes, MACD direction, and the bearish external signal.

Respond ONLY with valid JSON:
{{"action": "BUY" | "SELL" | "HOLD", "reason": "one-line prediction reason", "confidence": <1-10>}}
"""
        return prompt

    # ── Ask Ollama for multi-day outlook ──────
    def build_outlook_prompt(self, row, today: str, days: list[str]) -> str:
        price    = float(row["Close"])
        sma20    = float(row["SMA20"])
        rsi      = float(row["RSI"])
        macd     = float(row["MACD"])
        macd_sig = float(row["MACD_sig"])

        sig = EXTERNAL_SIGNAL
        days_str = ", ".join(days)

        prompt = f"""
You are a professional stock market analyst. Today is {today}.

Given the current state of {self.ticker}:
- Price : {price:.2f}
- SMA20 : {sma20:.2f} ({"above" if price > sma20 else "below"})
- RSI   : {rsi:.2f} ({"overbought" if rsi > 70 else "oversold" if rsi < 30 else "neutral"})
- MACD  : {"bullish" if macd > macd_sig else "bearish"} crossover
- External Signal: {sig['winner']} with confidence {sig['confidence']}/10 → {sig['recommended_action']}

Provide a short-term outlook for the next {len(days)} trading days: {days_str}

Give your overall outlook: Is this stock likely to go UP, DOWN, or SIDEWAYS?
What is the best strategy — accumulate, reduce exposure, or wait?

Respond in 3-4 sentences maximum. Be direct and specific.
"""
        return prompt

    # ── Main Run ──────────────────────────────
    def run(self):
        print(f"\n{'═'*65}")
        print(f"  🔮  {self.ticker} — FUTURE PREDICTION MODE")
        print(f"{'═'*65}")

        # Step 1: Fetch & compute
        print("  📥 Fetching latest market data...")
        df  = self.compute_indicators(self.fetch_latest_data())
        row = df.iloc[-1]   # Most recent trading day
        today     = df.index[-1].strftime("%Y-%m-%d")
        today_day = df.index[-1].strftime("%A")

        price    = float(row["Close"])
        sma20    = float(row["SMA20"])
        ema9     = float(row["EMA9"])
        rsi      = float(row["RSI"])
        macd     = float(row["MACD"])
        macd_sig = float(row["MACD_sig"])
        bb_upper = float(row["BB_upper"])
        bb_lower = float(row["BB_lower"])

        # Step 2: Print current snapshot
        print(f"\n  📊 CURRENT SNAPSHOT  (latest data: {today_day}, {today})")
        print(f"  {'─'*55}")
        print(f"  Price       : {price:.2f}")
        print(f"  SMA20       : {sma20:.2f}  → {'📈 ABOVE (bullish)' if price > sma20 else '📉 BELOW (bearish)'}")
        print(f"  EMA9        : {ema9:.2f}   → {'📈 ABOVE' if price > ema9 else '📉 BELOW'}")
        print(f"  RSI(14)     : {rsi:.2f}    → {'🔴 Overbought' if rsi > 70 else '🟢 Oversold' if rsi < 30 else '🟡 Neutral'}")
        print(f"  MACD        : {macd:.4f}  → {'📈 Bullish' if macd > macd_sig else '📉 Bearish'}")
        print(f"  BB Upper    : {bb_upper:.2f}  |  BB Lower: {bb_lower:.2f}")
        print(f"\n  {self.price_trend_summary(df)}")
        print(f"\n  📡 External Signal  : {EXTERNAL_SIGNAL['winner']} "
              f"(confidence {EXTERNAL_SIGNAL['confidence']}/10) "
              f"→ {EXTERNAL_SIGNAL['recommended_action']}")

        # Step 3: Predict next N trading days
        future_dates = next_trading_days(PREDICT_DAYS)
        print(f"\n  {'═'*55}")
        print(f"  🔮 PREDICTIONS FOR NEXT {PREDICT_DAYS} TRADING DAYS")
        print(f"  {'═'*55}")
        print(f"  {'DATE':<14} {'DAY':<11} {'ACTION':<6} {'CONF':>5}  REASON")
        print(f"  {'─'*14} {'─'*11} {'─'*6} {'─'*5}  {'─'*28}")

        results = []
        for day_num, predict_date in enumerate(future_dates, 1):
            day_name = datetime.strptime(predict_date, "%Y-%m-%d").strftime("%A")
            print(f"  🔄 Asking Ollama for {predict_date}...", end="\r")

            prompt = self.build_prompt(row, today, predict_date, day_num)
            raw    = ask_ollama(prompt)

            # Parse with confidence
            try:
                start = raw.find("{")
                end   = raw.rfind("}") + 1
                data  = json.loads(raw[start:end])
                action     = data.get("action", "HOLD").upper()
                reason     = data.get("reason", "")
                confidence = data.get("confidence", "?")
                if action not in ("BUY", "SELL", "HOLD"):
                    action = "HOLD"
            except Exception:
                action, reason = parse_ollama_decision(raw)
                confidence = "?"

            icon = "🟢" if action == "BUY" else "🔴" if action == "SELL" else "⚪"
            print(f"  {predict_date:<14} {day_name:<11} {icon} {action:<4} {str(confidence):>5}/10  {reason[:45]}")
            results.append({"date": predict_date, "action": action,
                            "confidence": confidence, "reason": reason})

        # Step 4: Overall outlook from Ollama
        print(f"\n  {'═'*55}")
        print(f"  🧠 OVERALL WEEK OUTLOOK (Ollama)")
        print(f"  {'─'*55}")
        print("  ⏳ Generating outlook...", end="\r")
        outlook_prompt = self.build_outlook_prompt(row, today, future_dates)
        outlook = ask_ollama(outlook_prompt)
        # Wrap text nicely
        words = outlook.split()
        line, lines = "", []
        for w in words:
            if len(line) + len(w) > 60:
                lines.append(line.strip())
                line = ""
            line += w + " "
        if line:
            lines.append(line.strip())
        for l in lines:
            print(f"  {l}")

        # Step 5: Summary
        print(f"\n  {'═'*55}")
        buys  = sum(1 for r in results if r["action"] == "BUY")
        sells = sum(1 for r in results if r["action"] == "SELL")
        holds = sum(1 for r in results if r["action"] == "HOLD")
        dominant = max([("BUY", buys), ("SELL", sells), ("HOLD", holds)], key=lambda x: x[1])
        print(f"  📋 PREDICTION SUMMARY")
        print(f"  BUY signals  : {buys} day(s)")
        print(f"  SELL signals : {sells} day(s)")
        print(f"  HOLD signals : {holds} day(s)")
        print(f"  Dominant     : {dominant[0]} ({dominant[1]}/{PREDICT_DAYS} days)")
        print(f"{'═'*65}\n")

        print("  ⚠️  Disclaimer: AI predictions are not financial advice.")
        print("      Always do your own research before trading.\n")


# ─────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────
if __name__ == "__main__":
    agent = FuturePredictionAgent(
        ticker = "INFY.NS"   # Change to any ticker e.g. TCS.NS, RELIANCE.NS, AAPL
    )
    agent.run()
