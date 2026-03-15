import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import ollama
from researcher_team.market_state import ResearchInput


class BearishResearcher:
    """
    Bearish researcher agent - argues in favor of SELL/AVOID.
    Now with historical context awareness!
    """

    def __init__(self, model_name: str = "llama3.2"):
        self.model_name = model_name

    def _add_historical_context(self, data: ResearchInput, prompt: str) -> str:
        """Add historical context to the prompt if available"""
        if data.historical:
            historical_note = f"""

📊 HISTORICAL CONTEXT ANALYSIS:
----------------------------------------
Previous RSI Trend:     {data.historical.previous_rsi[-3:] if data.historical.previous_rsi else 'N/A'}
Previous MACD Signals:  {data.historical.previous_macd[-3:] if data.historical.previous_macd else 'N/A'}
Sentiment Progression:  {data.historical.previous_sentiment[-3:] if data.historical.previous_sentiment else 'N/A'}
Historical Accuracy:    {data.historical.accuracy_score * 100}% of past predictions were correct
Trend Consistency:      {data.historical.get_trend_consistency()}

IMPORTANT - You MUST address ONE of these scenarios in your argument:

🔴 If BEARISH signals CONFIRM historical pattern:
   - Emphasize that history is repeating itself
   - Show how current weakness follows established pattern
   - Example: "RSI has consistently declined from {data.historical.previous_rsi[0] if data.historical.previous_rsi else 60} to {data.rsi}, confirming the bearish trend we've historically seen before selloffs..."

🟢 If BEARISH signals CONTRADICT historical pattern:
   - Argue that historical support levels may fail this time
   - Point to new risks that didn't exist historically
   - Example: "While the stock has historically bounced at RSI {data.rsi}, the current regulatory threats make this support level unreliable..."

📉 If historical accuracy is HIGH (>80%):
   - Heavily weight the historical pattern
   - Be confident in your bearish thesis

📈 If historical accuracy is LOW (<60%):
   - Acknowledge historical unreliability
   - Focus on current deteriorating fundamentals
   - Example: "Past patterns have been unreliable, but the current sentiment crash to {data.news_sentiment} is unprecedented..."

"""
            return prompt + historical_note
        return prompt

    def generate_argument(self, data: ResearchInput, bull_argument: str = None) -> str:
        """
        Generate a bearish argument based on the market data and counter
        the bull's previous argument.
        Now includes historical context awareness!
        """

        if bull_argument is None:
            # Round 1: Initial bearish thesis
            prompt = f"""You are a bearish equity research analyst. Based on the following market data for {data.company_name} ({data.ticker}), write a compelling argument for why investors should SELL or AVOID the stock.

CURRENT MARKET DATA:
{data.to_readable_string()}

Your task:
1. Focus on the negative signals and risks in the data
2. Challenge any seemingly positive indicators
3. Make a clear SELL/AVOID recommendation
4. Write 3-5 sentences in professional analyst style
5. IMPORTANT: Consider historical patterns in your analysis - if history confirms your view, emphasize it; if history contradicts, explain why old patterns no longer apply
"""
            prompt = self._add_historical_context(data, prompt)

        else:
            # Round 2+: Counter the bull's argument
            prompt = f"""You are a bearish equity research analyst. The bullish analyst just made this argument:

🐂 BULL ARGUMENT: "{bull_argument}"

Based on the market data for {data.company_name} ({data.ticker}), write a rebuttal defending your SELL/AVOID thesis.

CURRENT MARKET DATA:
{data.to_readable_string()}

Your task:
1. Directly counter the bull's key points
2. Emphasize risks the bull is ignoring
3. Use historical patterns to expose vulnerabilities
4. Maintain professional tone but be persuasive
5. Write 3-5 sentences
"""
            prompt = self._add_historical_context(data, prompt)

        try:
            response = ollama.chat(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                options={"temperature": 0.7}
            )
            return response["message"]["content"].strip()
        except Exception as e:
            return f"[Error generating argument: {str(e)}]"