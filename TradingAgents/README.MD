# TradingAgents — Research Team (Bull vs. Bear Debate)

Multi-agent NLP debate system implementing the Researcher Team from the TradingAgents paper.

---

## Architecture

```
Global Market State (ResearchInput)
          ↓
 ┌────────────────────┐
 │    Debate Engine   │
 │                    │
 │  Bull Agent  ←──→  Bear Agent   (N rounds)
 └────────────────────┘
          ↓
   Facilitator Agent
          ↓
  Structured JSON Decision
          ↓
  (→ Portfolio Manager / Next Layer)
```

---

## Project Structure

```
trading_agents/
│
├── main.py              ← Run this
├── market_state.py      ← Shared input structure (edit for real data)
├── debate_engine.py     ← Orchestrates the multi-round debate
│
└── agents/
    ├── bullish.py       ← [YOUR FILE] Bullish Researcher Agent
    ├── bearish.py       ← [FRIEND'S FILE] Bearish Researcher Agent
    └── facilitator.py   ← Neutral debate evaluator
```

---

## Division of Work

| Person | File | Responsibility |
|--------|------|----------------|
| Person 1 | `agents/bullish.py` | Bullish Researcher — argues BUY |
| Person 2 | `agents/bearish.py` | Bearish Researcher — argues SELL/AVOID |
| Both together | `debate_engine.py` | Integrate and test debate loop |

---

## Setup

```bash
pip install openai

export OPENAI_API_KEY="your-key-here"

python main.py
```

---

## Input Data

`market_state.py` defines `ResearchInput` — the shared market data both agents read.

**Current demo values** (hardcoded for testing):
- RSI: 62, MACD: bullish, Price > MA50
- News sentiment: +0.35, Social: +0.20
- Event risk: 0.55 (moderate), Market trend: sideways

**When Shreya & Ayush send real data**, just replace values in `main.py`:
```python
real_input = ResearchInput(
    rsi=shreya_output["rsi"],
    macd_signal=shreya_output["macd_signal"],
    ...
    news_sentiment_score=ayush_output["news_sentiment_score"],
    ...
)
```

---

## Output

The system produces:
1. Live debate transcript printed to console
2. `debate_output.json` — full structured output including:
   - Market state used
   - Full debate transcript (all rounds)
   - Facilitator decision: winner, confidence (1–10), recommended action (BUY/SELL/HOLD)

---

## Example Final Output (Facilitator Decision)

```json
{
  "winner": "Bearish",
  "confidence": 7,
  "bull_strengths": "Strong MACD and sector momentum cited effectively",
  "bear_strengths": "Event risk and RSI overbought warning well-argued",
  "deciding_factor": "Sideways market trend and moderate event risk outweigh bullish signals",
  "recommended_action": "HOLD"
}
```

---

## For Your Viva

> "We implemented a dialectical multi-agent research framework where a Bullish and Bearish researcher agent independently analyse the same market state and engage in N-round structured NLP debate. A neutral Facilitator agent evaluates the full transcript and selects the prevailing perspective based on argument quality, returning a structured decision in the communication protocol format described in the TradingAgents paper."