"""Report generator for sentiment analysis."""

from datetime import datetime
from typing import Dict, List
from .aggregation.sentiment_aggregator import SentimentAggregator


class ReportGenerator:
    def __init__(self):
        """Initialize report generator."""
        self.aggregator = SentimentAggregator()

    def generate_report(self, ticker: str, posts: List[Dict], execution_time: float = 0.0) -> Dict:
        """Generate comprehensive sentiment report.

        Args:
            ticker: Stock ticker
            posts: List of analyzed posts
            execution_time: Time taken for analysis

        Returns:
            Complete sentiment report dictionary
        """
        sentiment_data = self.aggregator.aggregate_sentiment(posts)

        trend = "UNKNOWN"

        source_counts = {}
        for post in posts:
            source = post.get('source', 'unknown')
            source_counts[source] = source_counts.get(source, 0) + 1

        confidence = self._calculate_confidence(sentiment_data['total_posts'], execution_time)

        report = {
            "ticker": ticker.upper(),
            "posts_analyzed": sentiment_data['total_posts'],
            "sources": source_counts,
            "positive_posts": sentiment_data['positive_posts'],
            "negative_posts": sentiment_data['negative_posts'],
            "neutral_posts": sentiment_data['neutral_posts'],
            "sentiment_score": sentiment_data['sentiment_score'],
            "overall_sentiment": self.aggregator.interpret_sentiment(sentiment_data['sentiment_score']),
            "trend": trend,
            "confidence": confidence,
            "execution_time_seconds": round(execution_time, 2),
            "generated_at": self._get_timestamp()
        }

        return report

    def _calculate_confidence(self, posts_count: int, execution_time: float) -> str:
        """Calculate confidence level based on data quality.

        Args:
            posts_count: Number of posts analyzed
            execution_time: Execution time in seconds

        Returns:
            Confidence level string
        """
        if posts_count >= 150 and execution_time < 15:
            return "HIGH"
        elif posts_count >= 100 and execution_time < 20:
            return "MEDIUM"
        elif posts_count >= 50:
            return "LOW"
        else:
            return "VERY LOW"

    def _get_timestamp(self) -> str:
        """Get current timestamp."""
        return datetime.utcnow().isoformat() + "Z"
