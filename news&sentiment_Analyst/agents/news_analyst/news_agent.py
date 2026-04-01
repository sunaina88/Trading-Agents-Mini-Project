"""Top-level interface for the NewsAnalyst agent."""

from .context_builder import build_context
from .news_fetcher import fetch_news
from .article_filter import filter_articles
from .event_extractor import extract_events
from .impact_analyzer import analyze_event
from .contradiction_detector import detect_contradictions
from .report_generator import generate_report

class NewsAgent:
    def __init__(self):
        pass

    def analyze(self, ticker: str) -> dict:
        """Run the news analysis pipeline and return structured report."""
        ctx = build_context(ticker)
        queries = ctx.get("company_keywords", []) + ctx.get("industry_keywords", [])
        articles = fetch_news(queries, max_articles=100)
        relevant = filter_articles(articles)
        events = extract_events(relevant)
        unique = list(dict.fromkeys(events))
        analyzed = [analyze_event(ev) for ev in unique]
        contradictions = detect_contradictions(analyzed)
        print(f"[NewsAgent] Generating final report...")
        report = generate_report(ticker.upper(), analyzed, contradictions)

        print(f"[NewsAgent] Analysis complete for {ticker}.")
        return report


news_agent = NewsAgent()

def analyze(ticker: str):
    return news_agent.analyze(ticker)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Run NewsAnalyst for a given ticker")
    parser.add_argument("ticker", help="Stock ticker symbol, e.g. TSLA")
    args = parser.parse_args()
    report = analyze(args.ticker)
    import json
    print(json.dumps(report, indent=2))
