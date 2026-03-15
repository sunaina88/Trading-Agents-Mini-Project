"""Detect conflicting signals among events."""

from typing import List, Dict


def detect_contradictions(analyzed_events: List[Dict]) -> bool:
    """Return True if there appear to be opposing directions.

    A simplistic check: look for at least one POSITIVE and one NEGATIVE.
    """
    directions = {e.get("impact_direction") for e in analyzed_events}
    return "POSITIVE" in directions and "NEGATIVE" in directions
