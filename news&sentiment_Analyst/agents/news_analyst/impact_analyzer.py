"""Estimate financial impact of events using LLM."""

from typing import Dict
from common import client
import json


def analyze_event(event: str) -> Dict:
    """Use LLM to analyze the event's category, impact, etc."""
    prompt = f"""
    Analyze the following financial news event and provide a JSON response with the following fields:
    - category: one of COMPANY, INDUSTRY, MACRO, GLOBAL
    - impact_score: integer 1-10 (1=very negative, 10=very positive)
    - impact_direction: POSITIVE, NEGATIVE, or NEUTRAL
    - time_horizon: SHORT_TERM or LONG_TERM
    - confidence: HIGH, MEDIUM, or LOW

    Event: {event}

    Respond only with valid JSON.
    """

    print(f"[ImpactAnalyzer] Analyzing event: {event[:50]}...")
    response = client.infer(prompt).strip()
    try:
        analysis = json.loads(response)
        # Ensure required fields
        analysis.setdefault("category", "COMPANY")
        analysis.setdefault("impact_score", 5)
        analysis.setdefault("impact_direction", "NEUTRAL")
        analysis.setdefault("time_horizon", "SHORT_TERM")
        analysis.setdefault("confidence", "MEDIUM")
    except json.JSONDecodeError:
        # Fallback to defaults if LLM fails
        analysis = {
            "category": "COMPANY",
            "impact_score": 5,
            "impact_direction": "NEUTRAL",
            "time_horizon": "SHORT_TERM",
            "confidence": "LOW",
        }

    analysis["event"] = event
    return analysis

