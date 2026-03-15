import json
from researcher_team.data_collector import DataCollector
from researcher_team.debate_engine import DebateEngine

# -------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------
MODEL_NAME = "llama3.2"
DEBATE_ROUNDS = 2
TICKER = "MSFT"  # Change this to any stock symbol!


def map_signal(recommended_action: str) -> int:
    """Maps BUY/SELL/HOLD to +1/-1/0 for the next team."""
    return {"BUY": 1, "SELL": -1, "HOLD": 0}.get(recommended_action.upper(), 0)


def main():
    print("\n" + "=" * 60)
    print("🚀 TRADING AGENTS RESEARCH TEAM")
    print("=" * 60)

    # Get LIVE data with historical context
    print(f"\n📡 Fetching live data for {TICKER}...")
    collector = DataCollector(TICKER)
    research_input = collector.get_research_input()

    print(f"\n📊 Market Data for {research_input.company_name} ({research_input.ticker})")
    print(research_input.to_readable_string())
    print("=" * 60)

    print(f"\n🤖 Starting debate with {MODEL_NAME}...")
    print(f"📅 Historical accuracy: {research_input.historical.accuracy_score * 100 if research_input.historical else 'N/A'}%")
    print("=" * 60)

    # Run the debate
    engine = DebateEngine(model_name=MODEL_NAME, rounds=DEBATE_ROUNDS)
    result = engine.run(research_input, verbose=True)

    # Extract decision and map to signal
    decision = result["decision"]
    signal = map_signal(decision.get("recommended_action", "HOLD"))

    # Build output for next team
    researcher_output = {
        "signal": signal,
        "winner": decision.get("winner"),
        "confidence": decision.get("confidence"),
        "recommended_action": decision.get("recommended_action"),
        "deciding_factor": decision.get("deciding_factor"),
        "bull_strengths": decision.get("bull_strengths"),
        "bear_strengths": decision.get("bear_strengths"),
    }

    # Save full debate log
    with open("debate_output.json", "w") as f:
        result["debate_history"] = [
            {"speaker": speaker, "argument": arg}
            for speaker, arg in result["debate_history"]
        ]
        json.dump(result, f, indent=2)

    # Save clean signal output for next team
    with open("agents/researcher_output.json", "w") as f:
        json.dump(researcher_output, f, indent=2)

    print(f"\n💾 Full debate saved to: debate_output.json")
    print(f"📤 Signal output saved to: researcher_output.json")
    print("\n📋 SUMMARY:")
    print(f"  Signal:          {signal:+d}  (+1=BUY, -1=SELL, 0=HOLD)")
    print(f"  Winner:          {decision.get('winner')}")
    print(f"  Action:          {decision.get('recommended_action')}")
    print(f"  Confidence:      {decision.get('confidence')}/10")
    print(f"  Deciding Factor: {decision.get('deciding_factor')}")
    print("=" * 60)


if __name__ == "__main__":
    main()