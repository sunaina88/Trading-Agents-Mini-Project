!pip install yfinance pandas numpy scikit-learn matplotlib ta

import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

import ta


symbol = "AAPL"

data = yf.download(symbol, period="5y")

data.head()


close = data["Close"].squeeze()

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


close = data["Close"].values

future = np.roll(close, -1)

data["Target"] = (future > close).astype(int)

data = data.iloc[:-1]


features = [
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

X = data[features]

y = data["Target"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    shuffle=False
)


model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    random_state=42
)

model.fit(X_train, y_train)


predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Model Accuracy:", accuracy)


data["Prediction"] = model.predict(X)

data["Signal"] = data["Prediction"].shift(1)

data = data.dropna()


data["Strategy_Return"] = data["Signal"] * data["Return"]

data["Cumulative_Market"] = (1 + data["Return"]).cumprod()

data["Cumulative_Strategy"] = (1 + data["Strategy_Return"]).cumprod()

display(data.tail(10))

json_data = data.to_json(orient="records")

print(json_data)

data.to_json("technical_analysis_data.json", orient="records", indent=4)

from google.colab import files
files.download("technical_analysis_data.json")
