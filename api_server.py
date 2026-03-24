"""
Trading Analysis API Server
Exposes endpoints for frontend to run trading analysis and get results
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
import re
import json
from datetime import datetime

TRADING_AGENTS_DIR = os.path.join(os.path.dirname(__file__), 'TradingAgents')
if TRADING_AGENTS_DIR not in sys.path:
    sys.path.insert(0, TRADING_AGENTS_DIR)

NEWS_SENTIMENT_DIR = os.path.join(os.path.dirname(__file__), 'news&sentiment_Analyst')
if NEWS_SENTIMENT_DIR not in sys.path:
    sys.path.insert(0, NEWS_SENTIMENT_DIR)

from data_collector import DataCollector
from debate_engine import DebateEngine

app = Flask(__name__)
CORS(app)  

analysis_results = {}


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Trading Analysis API is running"})


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Run trading analysis for a given ticker

    Request body:
    {
        "ticker": "AAPL"
    }

    Response:
    {
        "success": true,
        "ticker": "AAPL",
        "summary": "...",
        "verdict": "BUY/SELL/HOLD",
        "confidence": 0-100,
        "decision": {...},
        "research_data": {...}
    }
    """
    try:
        data = request.get_json()
        ticker = data.get('ticker', 'AAPL').upper().strip()

        if not re.match(r'^[A-Z0-9.\-]+$', ticker):
            return jsonify({
                "success": False,
                "error": "Invalid ticker symbol",
                "message": "Ticker must contain only letters, numbers, dots, or hyphens"
            }), 400

        print(f"\n[API] Running analysis for {ticker}...")

        print(f"[API] Fetching live data and running research agents...")
        collector = DataCollector(ticker)
        research_input = collector.get_research_input()

        print(f"[API] Running debate engine...\n")
        engine = DebateEngine(model_name="llama3.2", rounds=1)
        debate_output = engine.run(research_input, verbose=True)

        decision = debate_output.get('decision', {})
        winner = decision.get('winner', 'NEUTRAL')
        recommended_action = decision.get('recommended_action', 'HOLD')
        deciding_factor = decision.get('deciding_factor', 'No clear signal')

        raw_confidence = decision.get('confidence', 5)
        try:
            raw_confidence = int(raw_confidence)
        except (ValueError, TypeError):
            raw_confidence = 5
        raw_confidence = max(0, min(10, raw_confidence))

        debate_history = debate_output.get('debate_history', [])
        bull_argument = ""
        bear_argument = ""
        for speaker, argument in debate_history:
            if speaker == "Bull":
                bull_argument = argument
            elif speaker == "Bear":
                bear_argument = argument

        print(f"[API] Generating analysis summary...")

        rf = research_input.rf_prediction if research_input.rf_prediction else {}

        summary = f"""
TRADING ANALYSIS SUMMARY FOR {ticker}
{'='*60}

RESEARCH CONSENSUS:
  Winner: {winner}
  Recommended Action: {recommended_action}
  Confidence: {raw_confidence}/10
  Key Factor: {deciding_factor}

TECHNICAL INDICATORS:
  RSI: {research_input.rsi:.1f}
  MACD Signal: {research_input.macd_signal}
  Price vs MA50: {research_input.price_vs_ma50}
  Volume Trend: {research_input.volume_trend}

MARKET SENTIMENT:
  News Sentiment: {research_input.news_sentiment}
  Social Sentiment: {research_input.social_sentiment}
  Major Event Risk: {research_input.major_event_risk}

MARKET CONTEXT:
  Market Trend: {research_input.market_trend}
  Sector Performance: {research_input.sector_performance}

MACHINE LEARNING SIGNAL:
  ML Prediction: {rf.get('prediction', 'N/A')}
  Confidence: {rf.get('confidence', 'N/A')}
  Signal Strength: {rf.get('signal_strength', 'N/A')}
"""

        verdict_map = {
            'Bull': 'BUY',
            'Bear': 'SELL',
            'BULL': 'BUY',
            'BEAR': 'SELL'
        }
        verdict = verdict_map.get(winner, 'HOLD')

        confidence_pct = min(100, raw_confidence * 10)

        result = {
            "success": True,
            "ticker": ticker,
            "timestamp": datetime.now().isoformat(),
            "summary": summary.strip(),
            "verdict": verdict,
            "confidence": confidence_pct,  
            "decision": decision
        }

        analysis_results[ticker] = result
        print(f"[API] ✓ Analysis complete for {ticker}")
        return jsonify(result), 200

    except Exception as e:
        print(f"[API] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e),
            "message": "Failed to run analysis"
        }), 500


@app.route('/api/results/<ticker>', methods=['GET'])
def get_results(ticker):
    """Get previous analysis results for a ticker"""
    ticker = ticker.upper()
    if ticker in analysis_results:
        return jsonify(analysis_results[ticker]), 200
    else:
        return jsonify({
            "success": False,
            "error": "No results found",
            "message": f"No analysis results for {ticker}"
        }), 404


@app.route('/api/tickers', methods=['GET'])
def get_available_tickers():
    """Get list of available tickers that have been analyzed"""
    return jsonify({
        "success": True,
        "tickers": list(analysis_results.keys()),
        "total": len(analysis_results)
    }), 200


if __name__ == '__main__':
    print("\n" + "="*70)
    print("TRADING ANALYSIS API SERVER")
    print("="*70)
    print("\nAPI Endpoints:")
    print("  GET  /api/health              - Health check")
    print("  POST /api/analyze             - Run analysis (body: {'ticker': 'AAPL'})")
    print("  GET  /api/results/<ticker>    - Get previous results")
    print("  GET  /api/tickers             - List analyzed tickers")
    print("\n" + "="*70)
    print("Starting server on http://localhost:5000")
    print("="*70 + "\n")

    app.run(debug=False, host='0.0.0.0', port=5000)