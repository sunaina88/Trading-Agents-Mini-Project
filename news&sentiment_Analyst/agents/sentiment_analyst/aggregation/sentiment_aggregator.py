"""Sentiment aggregation for sentiment analysis."""

from typing import List, Dict


class SentimentAggregator:
    @staticmethod
    def aggregate_sentiment(posts: List[Dict]) -> Dict:
        """Aggregate sentiment scores from posts.

        Args:
            posts: List of post dictionaries

        Returns:
            Dictionary with aggregated sentiment metrics
        """
        if not posts:
            return {
                'sentiment_score': 0.0,
                'positive_posts': 0,
                'negative_posts': 0,
                'neutral_posts': 0,
                'total_posts': 0
            }

        total_weighted_score = 0.0
        total_weight = 0.0
        positive_count = 0
        negative_count = 0
        neutral_count = 0

        for post in posts:
            weighted_score = post.get('weighted_sentiment_score', 0)
            engagement_score = post.get('engagement_score', 1)

            total_weighted_score += weighted_score
            total_weight += engagement_score

            sentiment = post.get('sentiment', 'neutral')
            if sentiment == 'positive':
                positive_count += 1
            elif sentiment == 'negative':
                negative_count += 1
            else:
                neutral_count += 1

        # Calculate final sentiment score (-1 to 1)
        if total_weight > 0:
            sentiment_score = total_weighted_score / total_weight
        else:
            sentiment_score = 0.0

        # Clamp to [-1, 1] range
        sentiment_score = max(-1.0, min(1.0, sentiment_score))

        return {
            'sentiment_score': round(sentiment_score, 3),
            'positive_posts': positive_count,
            'negative_posts': negative_count,
            'neutral_posts': neutral_count,
            'total_posts': len(posts)
        }

    @staticmethod
    def interpret_sentiment(sentiment_score: float) -> str:
        """Interpret sentiment score into human-readable category.

        Args:
            sentiment_score: Sentiment score between -1 and 1

        Returns:
            Sentiment interpretation string
        """
        if sentiment_score >= 0.25:
            return "BULLISH"
        elif sentiment_score >= 0.05:
            return "SLIGHTLY BULLISH"
        elif sentiment_score >= -0.05:
            return "NEUTRAL"
        elif sentiment_score >= -0.25:
            return "SLIGHTLY BEARISH"
        else:
            return "BEARISH"