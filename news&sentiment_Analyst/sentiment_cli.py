"""Minimal CLI for Sentiment Analyst."""

import argparse
from agents.sentiment_analyst import analyze_sentiment


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Sentiment Analyst for a ticker")
    parser.add_argument("ticker", help="Stock ticker symbol, e.g. NVDA")
    parser.add_argument("--time-window", type=int, default=24, help="Lookback window in hours")
    parser.add_argument("--max-posts", type=int, default=50, help="Max posts to analyze")
    args = parser.parse_args()

    report = analyze_sentiment(args.ticker, time_window=args.time_window, max_posts=args.max_posts)
    print(report)


if __name__ == "__main__":
    main()
