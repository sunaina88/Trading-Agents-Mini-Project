"""StockTwits data fetcher for sentiment analysis."""

import os
from datetime import datetime
from typing import List, Dict

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False


class StockTwitsFetcher:
    def __init__(self):
        """Initialize StockTwits API client."""
        self.base_url = os.getenv("STOCKTWITS_BASE_URL", "https://api.stocktwits.com/api/2")
        self.user_agent = os.getenv("STOCKTWITS_USER_AGENT", "SentimentAnalyst/1.0")
        self.token = os.getenv("STOCKTWITS_TOKEN")

    def fetch_messages(self, ticker: str, max_messages: int = 75) -> List[Dict]:
        """Fetch messages from StockTwits for a given ticker.

        Args:
            ticker: Stock ticker symbol
            max_messages: Maximum messages to fetch

        Returns:
            List of message dictionaries
        """
        if not REQUESTS_AVAILABLE:
            return []
        messages = []
        url = f"{self.base_url}/streams/symbol/{ticker.upper()}.json"

        try:
            headers = {"User-Agent": self.user_agent}
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"

            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()

            if 'messages' in data:
                for message in data['messages'][:max_messages]:
                    # Extract message data
                    message_data = {
                        "text": message.get('body', ''),
                        "source": "stocktwits",
                        "likes": message.get('likes', {}).get('total', 0),
                        "timestamp": datetime.fromisoformat(
                            message.get('created_at', '').replace('Z', '+00:00')
                        ).isoformat() if message.get('created_at') else datetime.utcnow().isoformat(),
                        "user": message.get('user', {}).get('username', 'unknown'),
                        "symbols": [s.get('symbol') for s in message.get('symbols', [])]
                    }
                    messages.append(message_data)

        except requests.exceptions.RequestException as e:
            pass
        except Exception as e:
            pass

        return messages
