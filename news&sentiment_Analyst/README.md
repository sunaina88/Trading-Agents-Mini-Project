# Trading Agents

I have built two analyst: a News Analyst and a Sentiment Analyst. The News Analyst reads recent news about a ticker and summarizes key events with impact. The Sentiment Analyst reads social posts, scores sentiment with FinBERT, and returns an overall sentiment report.

## Project Structure

```
news&sentiment Analyst/
|-- common/                    # Shared utilities and models
|   |-- models/
|   |   |-- llm_client.py       # Ollama client (used by News Analyst)
|   |   `-- finbert_model.py    # FinBERT model wrapper
|   `-- utils/
|-- agents/
|   |-- news_analyst/
|   `-- sentiment_analyst/
|-- sentiment_cli.py           # Sentiment CLI entry point
`-- requirements.txt
```

## Python API

### News Analyst

```python
from agents.news_analyst import analyze as analyze_news

report = analyze_news("NVDA")
```

### Sentiment Analyst

```python
from agents.sentiment_analyst import analyze_sentiment

report = analyze_sentiment("NVDA", time_window=24, max_posts=50)
```

## Flow (simple)

### News Analyst Flow
1. Build context and search keywords for the ticker.
2. Fetch news from Google News RSS.
3. Filter for finance-related articles.
4. Use Ollama to extract key events.
5. Use Ollama to score each event impact.
6. Detect contradictions and generate the final report.

### Sentiment Analyst Flow
1. Build search queries from the ticker.
2. Fetch posts from Reddit and StockTwits.
3. Run FinBERT on all posts.
4. Apply engagement weighting.
5. Aggregate and return the report.

## Output Structure

### News Analyst Output
```json
{
  "ticker": "NVDA",
  "events": [
    {
      "event": "...",
      "category": "COMPANY|INDUSTRY|MACRO|GLOBAL",
      "impact_score": 7,
      "impact_direction": "POSITIVE|NEGATIVE|NEUTRAL",
      "time_horizon": "SHORT_TERM|LONG_TERM",
      "confidence": "HIGH|MEDIUM|LOW"
    }
  ],
  "contradictions_detected": true,
  "overall_news_score": 7,
  "overall_sentiment": "BULLISH|BEARISH|NEUTRAL",
  "summary": "..."
}
```

### Sentiment Analyst Output
```json
{
  "ticker": "NVDA",
  "posts_analyzed": 50,
  "sources": {"reddit": 25, "stocktwits": 25},
  "positive_posts": 20,
  "negative_posts": 10,
  "neutral_posts": 20,
  "sentiment_score": 0.12,
  "overall_sentiment": "BULLISH|SLIGHTLY BULLISH|NEUTRAL|SLIGHTLY BEARISH|BEARISH",
  "trend": "UNKNOWN",
  "confidence": "HIGH|MEDIUM|LOW|VERY LOW",
  "execution_time_seconds": 3.2,
  "generated_at": "2026-03-15T10:45:00Z"
}
```

## Run From Terminal

### News Analyst
```powershell
python agents\news_analyst\news_agent.py NVDA
```

### Sentiment Analyst
```powershell
python sentiment_cli.py NVDA --time-window 24 --max-posts 50
```

## Requirements

- Python 3.8+
- Ollama running locally (for News Analyst LLM steps)
- feedparser, requests, praw, transformers, torch, python-dotenv

## Credentials (.env)

```
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USER_AGENT=SentimentAnalyst/1.0
STOCKTWITS_TOKEN=...
STOCKTWITS_USER_AGENT=SentimentAnalyst/1.0
```
