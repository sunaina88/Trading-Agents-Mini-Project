import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import ollama
from market_state import ResearchInput


class BearishResearcher:

    def __init__(self, model_name: str = "llama3.2"):
        self.model_name = model_name

    def generate_argument(self, data, bull_argument=None, quant_score=0):
        prompt = f"""You are a bearish QUANTITATIVE analyst.

STRICT RULES:
- Use ONLY provided data
- NO invented risks/events
- NO exaggeration

INTERPRETATION RULES:
- RSI 50–60 = neutral
- Neutral MACD = no confirmation
- Downtrend strengthens bearish case

SENTIMENT RULES:
- Only strong negative (< -0.5) matters
- Otherwise ignore sentiment

ML RULES:
- If STRONG → important
- If WEAK → ignore

DATA:
{data.to_readable_string()}

QUANT SCORE: {quant_score}

IMPORTANT:
- If quant score is weak (-1 to +1), bearish case is weak
- Do NOT exaggerate

TASK:
Evaluate bearish case based ONLY on data.

Write 3-5 sentences.
"""
        print("\n[DEBUG - BEAR INPUT]")
        print(data.to_readable_string())

        response = ollama.chat(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.2}
        )

        return response["message"]["content"].strip()