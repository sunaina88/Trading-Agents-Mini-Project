"""Query builder for sentiment analysis."""

from typing import List


def build_queries(ticker: str) -> List[str]:
    """Build search queries for a ticker.

    Args:
        ticker: Stock ticker symbol (e.g., 'TSLA', 'AAPL')

    Returns:
        List of search query strings
    """
    ticker_upper = ticker.upper()
    queries = [ticker_upper, f"${ticker_upper}"]

    # Add company name if known
    company_mapping = {
        "TSLA": "Tesla",
        "AAPL": "Apple",
        "NVDA": "Nvidia",
        "MSFT": "Microsoft",
        "GOOGL": "Google",
        "AMZN": "Amazon",
        "META": "Meta",
        "NFLX": "Netflix"
    }

    if ticker_upper in company_mapping:
        company = company_mapping[ticker_upper]
        queries.extend([
            company,
            f"{company} stock",
            f"{company} shares"
        ])

    return queries