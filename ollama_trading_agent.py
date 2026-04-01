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
        return response.json().get("response", "").strip()
    except Exception as e:
        print(f"Ollama error: {e}")
        return "HOLD"


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
        
        # ✅ FIX: Ensure we have a standard DataFrame with single-level columns
        if isinstance(df.columns, pd.MultiIndex):
            # Flatten MultiIndex columns if they exist
            df.columns = ['_'.join(col).strip() for col in df.columns.values]
        
        # Remove any duplicate column names
        df = df.loc[:, ~df.columns.duplicated()]
        
        return df

    def compute_indicators(self, df):
        # ✅ FIX: Ensure Close is a Series
        if 'Close' not in df.columns:
            # Try alternative column names
            close_col = [col for col in df.columns if 'close' in col.lower()]
            if close_col:
                close = df[close_col[0]].squeeze()
            else:
                raise ValueError(f"No Close column found. Available: {df.columns.tolist()}")
        else:
            close = df['Close'].squeeze()
        
        # Convert to Series if it's not already
        if isinstance(close, pd.DataFrame):
            close = close.iloc[:, 0]
        
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

    def get_scalar_value(self, value):
        """Helper function to convert Series/numpy values to scalar"""
        if hasattr(value, 'item'):
            return value.item()
        elif hasattr(value, 'iloc') and len(value) > 0:
            return value.iloc[0]
        elif isinstance(value, (pd.Series, np.ndarray)):
            return value[0] if len(value) > 0 else 0
        return value

    def build_prompt(self, row, today, predict_date, day_num):
        # ✅ FIX: Convert all values to scalars
        try:
            close_price = self.get_scalar_value(row['Close'])
            rsi_value = self.get_scalar_value(row['RSI'])
            macd_value = self.get_scalar_value(row['MACD'])
            macd_sig_value = self.get_scalar_value(row['MACD_sig'])
            sma20_value = self.get_scalar_value(row['SMA20'])
        except Exception as e:
            print(f"Error extracting values: {e}")
            print(f"Row type: {type(row)}")
            print(f"Row columns: {row.index.tolist() if hasattr(row, 'index') else 'N/A'}")
            # Fallback values
            close_price = 0
            rsi_value = 50
            macd_value = 0
            macd_sig_value = 0
            sma20_value = 0

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

Price: {close_price:.2f}
RSI: {rsi_value:.2f}
MACD: {"bullish" if macd_value > macd_sig_value else "bearish"}
Trend: {"UP" if close_price > sma20_value else "DOWN"}

{research_consensus}

Respond JSON:
{{"action":"BUY/SELL/HOLD","reason":"short","confidence":1-10}}
"""

    def run(self):
        try:
            print(f"Fetching data for {self.ticker}...")
            df = self.compute_indicators(self.fetch_latest_data())
            
            if df.empty:
                print(f"No data available for {self.ticker}")
                return {"error": "No data available"}
            
            # ✅ FIX: Get the last row and ensure it's a Series
            row = df.iloc[-1]
            today = df.index[-1].strftime("%Y-%m-%d") if hasattr(df.index[-1], 'strftime') else str(df.index[-1])

            future_dates = next_trading_days(PREDICT_DAYS)

            results = []

            for day_num, predict_date in enumerate(future_dates, 1):
                print(f"Predicting for {predict_date}...")
                prompt = self.build_prompt(row, today, predict_date, day_num)
                raw = ask_ollama(prompt)

                try:
                    # Extract JSON from response
                    start = raw.find('{')
                    end = raw.rfind('}') + 1
                    if start >= 0 and end > start:
                        json_str = raw[start:end]
                        data = json.loads(json_str)
                        action = data.get("action", "HOLD").upper()
                        confidence = data.get("confidence", 5)
                        reason = data.get("reason", "")
                    else:
                        raise ValueError("No JSON found in response")
                except Exception as e:
                    print(f"Error parsing response: {e}")
                    print(f"Raw response: {raw}")
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
                if isinstance(confidence, (int, float)) and confidence <= 5:
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

            return {
                "ticker": self.ticker,
                "predictions": results,
                "final_decision": dominant,
                "debate_output": self.debate_output
            }
            
        except Exception as e:
            print(f"Error in run method: {e}")
            import traceback
            traceback.print_exc()
            return {"error": str(e)}


if __name__ == "__main__":
    ticker = "TCS.NS"

    debate_output = None

    if RESEARCH_AGENTS_AVAILABLE:
        try:
            collector = DataCollector(ticker)
            research_input = collector.get_research_input()
            engine = DebateEngine(model_name="llama3.2", rounds=1)
            debate_output = engine.run(research_input, verbose=False)
        except Exception as e:
            print(f"Error running research agents: {e}")
            debate_output = None

    agent = FuturePredictionAgent(ticker, debate_output)
    result = agent.run()
    print("\nFinal Result:", result)