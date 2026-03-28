import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import ollama
from market_state import ResearchInput


class BullishResearcher:

    def __init__(self, model_name: str = "llama3.2"):
        self.model_name = model_name

    def _add_historical_context(self, data: ResearchInput, prompt: str) -> str:
        if data.historical:
            historical_note = f"""

HISTORICAL CONTEXT:
RSI: {data.historical.previous_rsi[-3:]}
MACD: {data.historical.previous_macd[-3:]}
Accuracy: {data.historical.accuracy_score * 100}%

IMPORTANT:
- Use only as supporting evidence
- DO NOT invent explanations
"""
            return prompt + historical_note
        return prompt

    def generate_argument(self, data, bear_argument=None, quant_score=0):
        prompt = f"""You are a bullish QUANTITATIVE analyst.

STRICT RULES:
- Use ONLY provided data
- NO external news/events
- NO guessing
- If weak → say weak

INTERPRETATION RULES:
- RSI 50–60 = neutral
- Neutral MACD = no confirmation
- Trend overrides weak signals

SENTIMENT RULES:
- >0.5 = strong positive
- 0.2–0.5 = mild positive (weak)
- -0.2–0.2 = neutral
- < -0.2 = negative

ML RULES:
- If STRONG → important
- If WEAK → ignore

QUANT SCORE: {quant_score}

IMPORTANT:
- If quant score is weak (-1 to +1), bullish case is weak
- Do NOT override quant score

DATA:
{data.to_readable_string()}

TASK:
Evaluate if bullish case exists. Do NOT force it.

Write 3-5 sentences.
"""

        prompt = self._add_historical_context(data, prompt)

        response = ollama.chat(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.2}
        )

        print("\n[DEBUG - BULL INPUT]")
        print(data.to_readable_string())

        return response["message"]["content"].strip()