import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import ollama
from researcher_team.market_state import ResearchInput


class BullishResearcher:
    """
    Bullish researcher agent - argues in favor of BUY.
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

🔴 If BULLISH signals CONFIRM historical pattern:
   - Emphasize that the trend is validated by history
   - Show how current data continues a proven pattern
   - Example: "The RSI has consistently risen from {data.historical.previous_rsi[0] if data.historical.previous_rsi else 50} to {data.rsi} over the past periods, confirming sustained bullish momentum..."

🟡 If BULLISH signals CONTRADICT historical pattern:
   - Acknowledge the contradiction honestly
   - Explain why THIS TIME is different
   - Provide catalysts/reasons for the change
   - Example: "While historical RSI at this level has led to pullbacks, the new product launch fundamentally changes the growth trajectory..."

📈 If historical accuracy is HIGH (>80%):
   - Give more weight to historical patterns
   - Be extra convincing if contradicting history

📉 If historical accuracy is LOW (<60%):
   - Argue that past patterns are less relevant
   - Focus more on current fundamentals
"""
            return prompt + historical_note
        return prompt

    def generate_argument(self, data: ResearchInput, bear_argument: str = None) -> str:
        """
        Generate a bullish argument based on the market data and optionally
        counter the bear's previous argument.
        Now includes historical context awareness!
        """

        if bear_argument is None:
            # Round 1: Initial bullish thesis
            prompt = f"""You are a bullish equity research analyst. Based on the following market data for {data.company_name} ({data.ticker}), write a compelling argument for why investors should BUY the stock.

CURRENT MARKET DATA:
{data.to_readable_string()}

Your task:
1. Focus on the positive signals in the data
2. Acknowledge risks briefly but downplay them
3. Make a clear BUY recommendation
4. Write 3-5 sentences in professional analyst style
5. IMPORTANT: Consider historical patterns in your analysis - if history confirms your view, emphasize it; if history contradicts, explain why this time is different
"""
            prompt = self._add_historical_context(data, prompt)

        else:
            # Round 2+: Counter the bear's argument
            prompt = f"""You are a bullish equity research analyst. The bearish analyst just made this argument:

🐻 BEAR ARGUMENT: "{bear_argument}"

Based on the market data for {data.company_name} ({data.ticker}), write a rebuttal defending your BUY thesis.

CURRENT MARKET DATA:
{data.to_readable_string()}

Your task:
1. Directly counter the bear's key points
2. Reinforce your bullish thesis with data
3. Use historical patterns to strengthen your case
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