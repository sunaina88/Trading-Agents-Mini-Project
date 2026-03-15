"""Simple wrapper around Ollama LLM client."""

import requests
import json


class LLMClient:
    def __init__(self, model: str = "llama2"):
        self.model = model
        self.base_url = "http://localhost:11434/api/generate"

    def infer(self, prompt: str) -> str:
        """Send prompt to Ollama and return response."""
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        try:
            response = requests.post(self.base_url, json=payload)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
        except requests.exceptions.RequestException as e:
            print(f"Error calling Ollama: {e}")
            return ""


# singleton instance
client = LLMClient()

