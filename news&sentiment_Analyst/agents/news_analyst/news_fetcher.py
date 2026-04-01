"""Fetch news articles from Google News RSS."""

from typing import List, Dict

try:
    import feedparser
    FEEDPARSER_AVAILABLE = True
except ImportError:
    FEEDPARSER_AVAILABLE = False


def fetch_news(queries: List[str], max_articles: int = 50) -> List[Dict]:
    """Retrieve news articles using Google News RSS feeds.

    Args:
        queries: list of search query strings.
        max_articles: maximum number of articles to return.

    Returns:
        List of article dictionaries.
    """
    if not FEEDPARSER_AVAILABLE:
        return []
    articles = []

    for q in queries:
        # Build RSS URL
        url = f"https://news.google.com/rss/search?q={q}"
        feed = feedparser.parse(url)
        for entry in feed.entries:
            if len(articles) >= max_articles:
                break
            articles.append(
                {
                    "title": entry.get("title", ""),
                    "summary": entry.get("summary", ""),
                    "source": entry.get("source", {}).get("title", ""),
                    "published": entry.get("published", ""),
                    "link": entry.get("link", ""),
                }
            )
        if len(articles) >= max_articles:
            break

    return articles
