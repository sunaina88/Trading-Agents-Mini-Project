"""Filter out articles that are not financially relevant."""

from typing import List, Dict

#keywords that indicate financial relevance
RELEVANT_KEYWORDS = [
    "earnings",
    "revenue",
    "profit",
    "lawsuit",
    "regulation",
    "production",
    "supply chain",
    "subsidy",
    "merger",
    "acquisition",
    "demand",
    "sales",
    "guidance",
    "bankruptcy",
]


def filter_articles(articles: List[Dict]) -> List[Dict]:
    """Return only articles containing relevant keywords.

    Args:
        articles: list of article dicts with 'title' and 'summary'.
    """
    filtered = []
    for art in articles:
        text = (art.get("title", "") + " " + art.get("summary", "")).lower()
        for kw in RELEVANT_KEYWORDS:
            if kw in text:
                filtered.append(art)
                break
    return filtered
