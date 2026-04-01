"""Reddit data fetcher for sentiment analysis."""

import os
from datetime import datetime, timedelta, timezone
from typing import List, Dict

try:
    import praw
    PRAW_AVAILABLE = True
except ImportError:
    PRAW_AVAILABLE = False


class RedditFetcher:
    def __init__(self):
        """Initialize Reddit API client."""
        if not PRAW_AVAILABLE:
            self.reddit = None
            return
        # Read credentials from environment variables.
        client_id = os.getenv("REDDIT_CLIENT_ID")
        client_secret = os.getenv("REDDIT_CLIENT_SECRET")
        user_agent = os.getenv("REDDIT_USER_AGENT", "SentimentAnalyst/1.0")

        if not client_id or not client_secret:
            self.reddit = None
            return

        try:
            self.reddit = praw.Reddit(
                client_id=client_id,
                client_secret=client_secret,
                user_agent=user_agent
            )
        except Exception as e:
            print(f"Warning: Reddit API not configured: {e}")
            self.reddit = None

    def fetch_posts(self, queries: List[str], time_window_hours: int = 24, max_posts: int = 75) -> List[Dict]:
        """Fetch posts from Reddit based on search queries.

        Args:
            queries: List of search terms
            time_window_hours: Hours to look back
            max_posts: Maximum posts to fetch

        Returns:
            List of post dictionaries
        """
        if not self.reddit:
            print("[RedditFetcher] Reddit API not configured, returning empty results")
            return []

        posts = []
        subreddits = ['stocks', 'investing', 'wallstreetbets', 'StockMarket']

        # Calculate time threshold
        time_threshold = datetime.now(timezone.utc) - timedelta(hours=time_window_hours)

        try:
            for subreddit_name in subreddits:
                subreddit = self.reddit.subreddit(subreddit_name)

                for query in queries:
                    try:
                        # Search in subreddit
                        for submission in subreddit.search(query, sort='new', time_filter='day', limit=50):
                            if len(posts) >= max_posts:
                                break

                            # Check if post is within time window
                            post_time = datetime.fromtimestamp(submission.created_utc, tz=timezone.utc)
                            if post_time < time_threshold:
                                continue

                            post_data = {
                                "text": submission.title + " " + (submission.selftext or ""),
                                "source": "reddit",
                                "upvotes": submission.score,
                                "comments": submission.num_comments,
                                "timestamp": post_time.isoformat(),
                                "url": submission.url,
                                "subreddit": subreddit_name
                            }
                            posts.append(post_data)

                        if len(posts) >= max_posts:
                            break

                    except Exception as e:
                        print(f"Error searching r/{subreddit_name} for '{query}': {e}")
                        continue

                if len(posts) >= max_posts:
                    break

        except Exception as e:
            print(f"Error in Reddit fetching: {e}")

        return posts[:max_posts]
