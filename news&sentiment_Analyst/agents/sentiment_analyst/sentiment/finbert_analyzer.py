"""FinBERT sentiment analyzer for sentiment analysis."""

from typing import List, Dict

# Optional FinBERT import
try:
    from common.models.finbert_model import finbert_analyzer
    _finbert_available = True
    _finbert_error = None
except ImportError:
    finbert_analyzer = None
    _finbert_available = False
    _finbert_error = "Missing dependency. Install 'transformers' and 'torch' to enable FinBERT."


class FinBERTAnalyzer:
    def __init__(self):
        """Initialize FinBERT analyzer."""
        if not _finbert_available:
            print(f"[FinBERTAnalyzer] FinBERT not available: {_finbert_error}")
        self.analyzer = finbert_analyzer

    def analyze_posts(self, posts: List[Dict]) -> List[Dict]:
        """Analyze sentiment of posts using FinBERT.

        Args:
            posts: List of post dictionaries

        Returns:
            List of posts with sentiment analysis added
        """
        if not posts:
            return []

        if not _finbert_available or not self.analyzer:
            # Fallback: mark all as neutral
            for post in posts:
                post_copy = post.copy()
                post_copy.update({
                    'sentiment': 'neutral',
                    'sentiment_confidence': 0.5
                })
            return posts

        # Extract texts for batch processing
        texts = [post.get('text', '') for post in posts]

        # Get FinBERT predictions
        predictions = self.analyzer.analyze_batch(texts)

        # Add sentiment data to posts
        analyzed_posts = []
        for post, prediction in zip(posts, predictions):
            post_with_sentiment = post.copy()
            post_with_sentiment.update({
                'sentiment': prediction['sentiment'],
                'sentiment_confidence': prediction['confidence']
            })
            analyzed_posts.append(post_with_sentiment)

        print(f"[FinBERTAnalyzer] Analyzed {len(analyzed_posts)} posts")
        return analyzed_posts
