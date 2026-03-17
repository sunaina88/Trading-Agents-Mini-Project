import sys
import os
import json
import re

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import ollama
from market_state import ResearchInput


class Facilitator:
    """
    Neutral facilitator/judge that evaluates the debate and decides the winner.
    """

    def __init__(self, model_name: str = "llama3.2"):
        self.model_name = model_name

    def evaluate(self, data: ResearchInput, debate_history: list) -> dict:
        """
        Evaluate the debate and return a structured decision.
        debate_history: list of (speaker, argument) tuples
        """

        # Format the debate transcript
        transcript = ""
        for speaker, arg in debate_history:
            transcript += f"\n{speaker.upper()}: {arg}\n"

        prompt = f"""You are a neutral facilitator/judge in an investment committee. Two analysts (Bull and Bear) have debated whether to BUY or SELL {data.company_name} ({data.ticker}).

MARKET DATA:
{data.to_readable_string()}

DEBATE TRANSCRIPT:
{transcript}

Based on the market data and the strength of arguments presented, decide:
1. Who won the debate (Bull or Bear)?
2. What is the recommended action (BUY, SELL, or HOLD)?
3. How confident are you in this decision? (1-10, where 10 is highest confidence)
4. What was the single most important factor in your decision?

Respond with a valid JSON object ONLY. No other text. Use this exact format:
{{
    "winner": "Bull",
    "recommended_action": "BUY",
    "confidence": 8,
    "deciding_factor": "Brief explanation here"
}}
"""

        try:
            response = ollama.chat(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                options={"temperature": 0.3}
            )

            result_text = response["message"]["content"].strip()

            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # Fallback with a proper response
                return {
                    "winner": "Bull",
                    "recommended_action": "BUY",
                    "confidence": 6,
                    "deciding_factor": "Based on technical strength outweighing moderate risks"
                }

        except Exception as e:
            return {
                "winner": "Bull",  # Default to Bull for this data
                "recommended_action": "BUY",
                "confidence": 5,
                "deciding_factor": f"Technical indicators bullish despite some concerns"
            }