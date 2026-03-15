"""Context builder for NewsAnalyst agent"""


def build_context(ticker: str) -> dict:
    """Generate structured context for a company based on ticker.

    Args:
        ticker: Stock ticker symbol.

    Returns:
        A dictionary containing company, industry and keyword lists.
    """
    # In a real application this might query a database or service.
    # For demonstration we use fixed mappings or simple heuristics.
    mapping = {
        "TSLA": ("Tesla", "Electric Vehicles"),
        "AAPL": ("Apple", "Consumer Electronics"),
    }
    company, industry = mapping.get(ticker.upper(), (ticker, ""))

    company_keywords = [company, ticker.upper(), f"{company} earnings"]
    industry_keywords = [industry.lower(), industry] if industry else []
    macro_keywords = [
        "interest rates",
        "inflation",
        "GDP",
    ]
    if industry.lower().find("electric") >= 0:
        macro_keywords.extend(["EV subsidies", "lithium prices"])

    return {
        "ticker": ticker.upper(),
        "company": company,
        "industry": industry,
        "company_keywords": company_keywords,
        "industry_keywords": industry_keywords,
        "macro_keywords": macro_keywords,
    }
