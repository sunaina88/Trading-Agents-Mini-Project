"""Sentiment Analyst Agent - Main orchestrator."""

import time
from typing import Dict, List

from common.utils.env import load_env
from .query_builder import build_queries
from .data_sources.reddit_fetcher import RedditFetcher
from .data_sources.stocktwits_fetcher import StockTwitsFetcher
from .sentiment.finbert_analyzer import FinBERTAnalyzer
from .aggregation.engagement_weight import EngagementWeighter
from .report_generator import ReportGenerator


class SentimentAgent:
    """Main sentiment analysis agent orchestrator."""

    def __init__(self):
        """Initialize the sentiment agent with all components."""
        load_env()
        self.query_builder = build_queries
        self.reddit_fetcher = RedditFetcher()
        self.stocktwits_fetcher = StockTwitsFetcher()
        self.finbert_analyzer = FinBERTAnalyzer()
        self.engagement_weighter = EngagementWeighter()
        self.report_generator = ReportGenerator()

    def analyze(self, ticker: str, time_window: int = 24, max_posts: int = 150) -> Dict:
        """Main analysis method that orchestrates all components.

        Args:
            ticker: Stock ticker symbol
            time_window: Hours to look back for posts
            max_posts: Maximum posts to analyze

        Returns:
            Comprehensive sentiment report
        """
        start_time = time.time()

        queries = self.query_builder(ticker)

        reddit_posts = self.reddit_fetcher.fetch_posts(queries, time_window, max_posts // 2)
        stocktwits_posts = self.stocktwits_fetcher.fetch_messages(ticker, max_posts // 2)

        all_posts = reddit_posts + stocktwits_posts
        analyzed_posts = self.finbert_analyzer.analyze_posts(all_posts)

        weighted_posts = self.engagement_weighter.apply_weighting(analyzed_posts)

        execution_time = time.time() - start_time
        report = self.report_generator.generate_report(ticker, weighted_posts, execution_time)

        print(f"[SentimentAgent] Analysis complete: {report['overall_sentiment']} ({report['sentiment_score']})")

        return report


def analyze_sentiment(ticker: str, time_window: int = 24, max_posts: int = 150) -> Dict:
    """Convenience function to analyze sentiment for a ticker.

    Args:
        ticker: Stock ticker symbol
        time_window: Hours to look back
        max_posts: Maximum posts to analyze

    Returns:
        Sentiment report dictionary
    """
    agent = SentimentAgent()
    return agent.analyze(ticker, time_window, max_posts)
