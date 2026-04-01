"""Extract structured financial events from articles using LLM."""

from typing import List, Dict
from common import client


def extract_events(articles: List[Dict]) -> List[str]:
    """Use LLM to extract key financial events from articles in batch."""
    # Limit to max 10 articles
    articles_to_process = articles[:5]
    
    # Build numbered list of articles with title and summary
    articles_list = ""
    for i, art in enumerate(articles_to_process, 1):
        title = art.get("title", "")
        summary = art.get("summary", "")
        articles_list += f"\n{i}. Title: {title}\nSummary: {summary}\n"
    
    # Create batch prompt to send all articles at once
    batch_prompt = f"""
    Analyze the following {len(articles_to_process)} news articles and extract key financial events related to companies, industries, or markets.
    Focus on events that could impact stock prices or trading decisions.
    
    Return ONLY a structured JSON list of only 5 unique events, with no additional text or formatting.
    Output must be only in this Format: {{"events": ["event 1", "event 2", ...]}}
    
    Articles:
    {articles_list}
    """
    
    # Single LLM call for all articles
    response = client.infer(batch_prompt).strip()
    
    # Parse response and extract events
    events = []
    try:
        import json
        # Extract JSON from response (handle potential markdown code blocks)
        json_str = response
        if "```" in response:
            # Extract JSON from markdown code block
            json_str = response.split("```json")[-1].split("```")[0].strip()
        
        parsed = json.loads(json_str)
        if isinstance(parsed, dict) and "events" in parsed:
            events = parsed["events"]
        elif isinstance(parsed, list):
            events = parsed
    except (json.JSONDecodeError, IndexError):
        # Fallback: split by newlines if JSON parsing fails
        events = [line.strip() for line in response.split('\n') if line.strip() and not line.startswith('{')]
    
    # Remove duplicates while preserving order
    unique_events = list(dict.fromkeys(events))
    
    return unique_events

