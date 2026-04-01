"""Engagement weighting for sentiment analysis."""

import math
from typing import List, Dict


class EngagementWeighter:
    @staticmethod
    def calculate_engagement_score(post: Dict) -> float:
        """Calculate engagement score for a post.

        Args:
            post: Post dictionary

        Returns:
            Engagement score
        """
        source = post.get('source', '')

        if source == 'reddit':
            upvotes = post.get('upvotes', 0)
            comments = post.get('comments', 0)
            engagement = upvotes + comments
        elif source == 'stocktwits':
            engagement = post.get('likes', 0)
        else:
            engagement = 1  # Default engagement

        # Use log scale to prevent high engagement posts from dominating
        return math.log(engagement + 1) + 1  # Add 1 to avoid log(0)

    @staticmethod
    def apply_weighting(posts: List[Dict]) -> List[Dict]:
        """Apply engagement weighting to posts.

        Args:
            posts: List of post dictionaries

        Returns:
            List of posts with engagement weights
        """
        weighted_posts = []

        for post in posts:
            engagement_score = EngagementWeighter.calculate_engagement_score(post)

            # Convert sentiment to numeric value
            sentiment = post.get('sentiment', 'neutral')
            if sentiment == 'positive':
                sentiment_value = 1
            elif sentiment == 'negative':
                sentiment_value = -1
            else:
                sentiment_value = 0

            # Calculate weighted sentiment score
            weighted_score = sentiment_value * engagement_score

            post_with_weight = post.copy()
            post_with_weight.update({
                'engagement_score': engagement_score,
                'sentiment_value': sentiment_value,
                'weighted_sentiment_score': weighted_score
            })

            weighted_posts.append(post_with_weight)

        return weighted_posts