import sys
import os
import json
import re

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import ollama
from market_state import ResearchInput


class Facilitator:

    def __init__(self, model_name: str = "llama3.2"):
        self.model_name = model_name

    def evaluate(self, data: ResearchInput, debate_history: list) -> dict:

        score = data.compute_score()

        transcript = ""
        for speaker, arg in debate_history:
            transcript += f"\n{speaker.upper()}: {arg}\n"

        prompt = f"""
You are a QUANTITATIVE trading decision engine.

━━━━━━━━━━━━━━━━━━━━━━━
QUANT SCORE:
━━━━━━━━━━━━━━━━━━━━━━━
{score}

INTERPRETATION:
- Score > +1 → BUY
- Score < -1 → SELL
- Between -1 and +1 → HOLD

━━━━━━━━━━━━━━━━━━━━━━━
MARKET DATA:
━━━━━━━━━━━━━━━━━━━━━━━
{data.to_readable_string()}

━━━━━━━━━━━━━━━━━━━━━━━
DEBATE:
━━━━━━━━━━━━━━━━━━━━━━━
{transcript}

━━━━━━━━━━━━━━━━━━━━━━━
RULES:
━━━━━━━━━━━━━━━━━━━━━━━

1. QUANT SCORE is PRIMARY decision driver
2. Debate is SECONDARY (explanation only)
3. DO NOT override score

━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE:
━━━━━━━━━━━━━━━━━━━━━━━

- Strong score → 7–9
- Weak score → 5–6

━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT:
━━━━━━━━━━━━━━━━━━━━━━━

Return ONLY JSON:

{{
    "winner": "Bull/Bear/Neutral",
    "recommended_action": "BUY/SELL/HOLD",
    "confidence": number,
    "deciding_factor": "short reason"
}}
"""

        response = ollama.chat(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0.1}
        )

        try:
            result_text = response["message"]["content"].strip()
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                score = data.compute_score()
                if score > 1:
                    result["recommended_action"] = "BUY"
                elif score < -1:
                    result["recommended_action"] = "SELL"
            else:
                result["recommended_action"] = "HOLD"

            # Adjust confidence realistically
            if -1 <= score <= 1:
                 result["confidence"] = min(result.get("confidence", 5), 6)

            return result
        except:
            pass

        # fallback based on score
        if score > 1:
            action = "BUY"
        elif score < -1:
            action = "SELL"
        else:
            action = "HOLD"

        return {
            "winner": "Neutral",
            "recommended_action": action,
            "confidence": 5,
            "deciding_factor": "Fallback based on quant score"
        }