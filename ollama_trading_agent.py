import yfinance as yf
import pandas as pd
import numpy as np
from ta.momentum import RSIIndicator
from ta.trend import SMAIndicator

import json
import requests
from datetime import datetime, timedelta
from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands
import warnings
import sys
import os

warnings.filterwarnings("ignore")

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'TradingAgents'))

try:
    from data_collector import DataCollector
    from debate_engine import DebateEngine
    RESEARCH_AGENTS_AVAILABLE = True
except ImportError:
    RESEARCH_AGENTS_AVAILABLE = False


OLLAMA_URL   = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2"

PREDICT_DAYS = 5

# ✅ FIX 1: REMOVE HARDCODED BIAS
EXTERNAL_SIGNAL = None


def ask_ollama(prompt: str) -> str:
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
    return response.json().get("response", "").strip()


def next_trading_days(n: int) -> list[str]:
    days = []
    current = datetime.today()
    while len(days) < n:
        current += timedelta(days=1)
        if current.weekday() < 5:
            days.append(current.strftime("%Y-%m-%d"))
    return days


class FuturePredictionAgent:

    def __init__(self, ticker: str, debate_output: dict = None):
        self.ticker = ticker
        self.debate_output = debate_output

    def fetch_latest_data(self):
        end = datetime.today()
        start = end - timedelta(days=90)
        df = yf.download(self.ticker, start=start, end=end, auto_adjust=True, progress=False)
        return df

    def compute_indicators(self, df):
        close = df["Close"].squeeze()
        df["SMA20"] = SMAIndicator(close, 20).sma_indicator()
        df["EMA9"] = EMAIndicator(close, 9).ema_indicator()
        df["RSI"] = RSIIndicator(close, 14).rsi()
        macd = MACD(close)
        df["MACD"] = macd.macd()
        df["MACD_sig"] = macd.macd_signal()
        bb = BollingerBands(close, 20)
        df["BB_upper"] = bb.bollinger_hband()
        df["BB_lower"] = bb.bollinger_lband()
        return df.dropna()

    def build_prompt(self, row, today, predict_date, day_num):

        research_consensus = ""
        if self.debate_output:
            d = self.debate_output.get('decision', {})
            research_consensus = f"""
Research Consensus:
- Action: {d.get('recommended_action')}
- Confidence: {d.get('confidence')}/10
"""

        return f"""
You are a trading assistant.

Based ONLY on the data below, suggest a POSSIBLE action (BUY/SELL/HOLD).
If uncertain → return HOLD.

Ticker: {self.ticker}

Price: {row['Close']:.2f}
RSI: {row['RSI']:.2f}
MACD: {"bullish" if row['MACD'] > row['MACD_sig'] else "bearish"}
Trend: {"UP" if row['Close'] > row['SMA20'] else "DOWN"}

{research_consensus}

Respond JSON:
{{"action":"BUY/SELL/HOLD","reason":"short","confidence":1-10}}
"""

    def run(self):

        df = self.compute_indicators(self.fetch_latest_data())
        row = df.iloc[-1]
        today = df.index[-1].strftime("%Y-%m-%d")

        future_dates = next_trading_days(PREDICT_DAYS)

        results = []

        for day_num, predict_date in enumerate(future_dates, 1):

            prompt = self.build_prompt(row, today, predict_date, day_num)
            raw = ask_ollama(prompt)

            try:
                data = json.loads(raw[raw.find("{"):raw.rfind("}")+1])
                action = data.get("action", "HOLD").upper()
                confidence = data.get("confidence", 5)
                reason = data.get("reason", "")
            except:
                action = "HOLD"
                confidence = 5
                reason = "Parsing error"

            # ✅ FIX 2: SANITY CHECK WITH DEBATE
            if self.debate_output:
                d = self.debate_output.get('decision', {})
                if d.get('confidence', 0) >= 7:
                    if action != d.get('recommended_action'):
                        action = "HOLD"

            # ✅ FIX 3: LOW CONFIDENCE → HOLD
            if isinstance(confidence, int) and confidence <= 5:
                action = "HOLD"

            results.append(action)

            print(f"{predict_date} → {action} ({confidence}/10)")

        # ✅ FIX 4: FINAL CONSENSUS
        from collections import Counter
        dominant = Counter(results).most_common(1)[0][0]

        # Respect strong debate signal
        if self.debate_output:
            d = self.debate_output.get('decision', {})
            if d.get('confidence', 0) >= 8:
                dominant = d.get('recommended_action')

        print("\nFINAL DECISION:", dominant)


if __name__ == "__main__":

    ticker = "TCS.NS"

    debate_output = None

    if RESEARCH_AGENTS_AVAILABLE:
        collector = DataCollector(ticker)
        research_input = collector.get_research_input()
        engine = DebateEngine(model_name="llama3.2", rounds=1)
        debate_output = engine.run(research_input, verbose=False)

    agent = FuturePredictionAgent(ticker, debate_output)
    agent.run()