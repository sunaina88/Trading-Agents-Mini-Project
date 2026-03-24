"""Generate final structured report from analyzed events."""

from typing import List, Dict


def generate_report(ticker: str, events: List[Dict], contradictions: bool) -> Dict:
    """Builds the output format described in the PRD.

    Args:
        ticker: stock ticker
        events: list of analyzed event dicts
        contradictions: whether contradictions detected
    """
    overall_score = 0
    for ev in events:
        overall_score += ev.get("impact_score", 0)
    overall_score = int(overall_score / max(1, len(events)))

    overall_sentiment = "NEUTRAL"
    if overall_score >= 6:
        overall_sentiment = "BULLISH"
    elif overall_score <= 4:
        overall_sentiment = "BEARISH"

    summary = ""
    if events:
        summary = f"Recent news shows {'positive' if overall_sentiment=='BULLISH' else 'negative' if overall_sentiment=='BEARISH' else 'mixed'} signals driven by {events[0]['event']}."
    
    return {
        "ticker": ticker,
        "events": events,
        "contradictions_detected": contradictions,
        "overall_news_score": overall_score,
        "overall_sentiment": overall_sentiment,
        "summary": summary,
    }
