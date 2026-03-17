"""
Technical Analyst - RandomForest ML Predictor
Trains a RandomForest classifier to predict price movements (UP/DOWN)
Integrates with DataCollector to feed predictions to research agents
"""

import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import ta
import warnings

warnings.filterwarnings("ignore")

# Feature list for consistency
FEATURES = [
    "Return",
    "MA10",
    "MA50",
    "Momentum",
    "Volatility",
    "RSI",
    "MACD",
    "MACD_signal",
    "MACD_hist",
    "Lag1",
    "Lag2"
]


def get_rf_prediction(ticker: str, lookback_years: int = 5) -> dict:
    """
    Train RandomForest on historical data and predict next movement for given ticker.
    
    Args:
        ticker: Stock symbol (e.g., "AAPL", "INFY.NS")
        lookback_years: Years of historical data to train on
        
    Returns:
        {
            'prediction': 'UP' or 'DOWN',
            'confidence': 0.0-1.0 (confidence score),
            'probability_up': float,
            'model_accuracy': float,
            'signal_strength': 'STRONG' or 'WEAK'
        }
    """
    try:
        print(f"[TechnicalAnalyst] Training RandomForest for {ticker}...")
        
        # Download data
        data = yf.download(ticker, period=f"{lookback_years}y", progress=False)
        
        if len(data) < 100:
            print(f"[TechnicalAnalyst] Insufficient data for {ticker}")
            return _get_fallback_prediction()
        
        close = data["Close"].squeeze()
        
        # Feature engineering
        data["Return"] = close.pct_change()
        data["MA10"] = close.rolling(10).mean()
        data["MA50"] = close.rolling(50).mean()
        data["Momentum"] = close - close.shift(10)
        data["Volatility"] = data["Return"].rolling(10).std()
        data["RSI"] = ta.momentum.RSIIndicator(close).rsi()
        
        macd = ta.trend.MACD(close)
        data["MACD"] = macd.macd()
        data["MACD_signal"] = macd.macd_signal()
        data["MACD_hist"] = macd.macd_diff()
        
        data["Lag1"] = close.shift(1)
        data["Lag2"] = close.shift(2)
        data = data.dropna()
        
        if len(data) < 100:
            return _get_fallback_prediction()
        
        # Target: price goes UP next day (1) or DOWN (0)
        close_values = data["Close"].values
        future = np.roll(close_values, -1)
        data["Target"] = (future > close_values).astype(int)
        data = data.iloc[:-1]
        
        # Train/test split
        X = data[FEATURES]
        y = data["Target"]
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, shuffle=False
        )
        
        # Train model
        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=12,
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train, y_train)
        
        # Get accuracy
        predictions = model.predict(X_test)
        model_accuracy = accuracy_score(y_test, predictions)
        
        # Predict next movement using latest data
        latest_features = X.iloc[-1:].values
        rf_prediction = model.predict(latest_features)[0]
        rf_probability = model.predict_proba(latest_features)[0]
        
        prediction = "UP" if rf_prediction == 1 else "DOWN"
        probability_up = rf_probability[1]
        
        # Determine signal strength based on probability confidence
        # If probability is close to 0.5, it's weak; if close to 0 or 1, it's strong
        confidence = abs(probability_up - 0.5) * 2  # Scale to 0-1
        signal_strength = "STRONG" if confidence > 0.6 else "WEAK"
        
        print(f"[TechnicalAnalyst] ✓ Prediction: {prediction}")
        print(f"                  Confidence: {confidence:.2f}, Accuracy: {model_accuracy:.2%}")
        
        return {
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "probability_up": round(probability_up, 2),
            "model_accuracy": round(model_accuracy, 2),
            "signal_strength": signal_strength
        }
        
    except Exception as e:
        print(f"[TechnicalAnalyst] Error: {e}")
        return _get_fallback_prediction()


def _get_fallback_prediction() -> dict:
    """Return neutral fallback prediction when model fails"""
    return {
        "prediction": "NEUTRAL",
        "confidence": 0.5,
        "probability_up": 0.5,
        "model_accuracy": 0.0,
        "signal_strength": "WEAK"
    }


# ─────────────────────────────────────────────
# Legacy: Standalone analysis mode
# ─────────────────────────────────────────────
if __name__ == "__main__":
    symbol = "AAPL"
    result = get_rf_prediction(symbol)
    print("\n" + "="*60)
    print(f"Random Forest Prediction for {symbol}")
    print("="*60)
    for key, value in result.items():
        print(f"{key:20} {value}")
    print("="*60)
