"""FinBERT sentiment analysis model wrapper."""

from transformers import pipeline
import torch


class FinBERTAnalyzer:
    def __init__(self):
        """Initialize FinBERT sentiment analysis pipeline."""
        try:
            self.sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model="ProsusAI/finbert",
                tokenizer="ProsusAI/finbert",
                device=0 if torch.cuda.is_available() else -1
            )
        except Exception as e:
            print(f"Error loading FinBERT model: {e}")
            self.sentiment_pipeline = None

    def analyze_batch(self, texts: list) -> list:
        """Analyze sentiment for a batch of texts.

        Args:
            texts: List of text strings to analyze

        Returns:
            List of dicts with 'text', 'sentiment', and 'confidence' keys
        """
        if not self.sentiment_pipeline:
            # Fallback to neutral if model fails to load
            return [{"text": text, "sentiment": "neutral", "confidence": 0.5} for text in texts]

        results = []
        try:
            # Process in batches for efficiency
            batch_size = 16
            for i in range(0, len(texts), batch_size):
                batch_texts = texts[i:i + batch_size]
                predictions = self.sentiment_pipeline(batch_texts)

                for text, pred in zip(batch_texts, predictions):
                    # Map FinBERT labels to our format
                    label = pred['label'].lower()
                    if label == 'positive':
                        sentiment = 'positive'
                    elif label == 'negative':
                        sentiment = 'negative'
                    else:
                        sentiment = 'neutral'

                    results.append({
                        "text": text,
                        "sentiment": sentiment,
                        "confidence": float(pred['score'])
                    })

        except Exception as e:
            print(f"Error in FinBERT analysis: {e}")
            # Fallback to neutral
            results = [{"text": text, "sentiment": "neutral", "confidence": 0.5} for text in texts]

        return results


# Singleton instance
finbert_analyzer = FinBERTAnalyzer()