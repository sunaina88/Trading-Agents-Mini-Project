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

from TradingAgents.data_collector import DataCollector
from TradingAgents.debate_engine import DebateEngine

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

        # Extract decision from debate
        decision = debate_output.get("decision", {})

        # Build structured summary for frontend parsing
        summary = f"""
TECHNICAL INDICATORS:
RSI: {research_input.current_rsi if hasattr(research_input, 'current_rsi') else 'N/A'}
SMA_20: {research_input.sma_20 if hasattr(research_input, 'sma_20') else 'N/A'}
SMA_50: {research_input.sma_50 if hasattr(research_input, 'sma_50') else 'N/A'}
Price: ${research_input.current_price if hasattr(research_input, 'current_price') else 'N/A'}

MACHINE LEARNING SIGNAL:
Signal: {decision.get('recommended_action', 'HOLD')}
Confidence: {decision.get('confidence', 5)}/10

MARKET SENTIMENT:
Sentiment: {decision.get('winner', 'Neutral')}

MARKET CONTEXT:
Analysis: {decision.get('deciding_factor', 'N/A')}

RESEARCH CONSENSUS:
Winner: {decision.get('winner', 'Neutral')}

Key Factor: {decision.get('deciding_factor', 'Market consensus')}
"""

        result = {
            "success": True,
            "ticker": ticker,
            "timestamp": datetime.now().isoformat(),
            "verdict": decision.get("recommended_action", "HOLD"),
            "confidence": decision.get("confidence", 5) * 10,
            "summary": summary,
            "decision": decision,
            "debate_output": debate_output
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