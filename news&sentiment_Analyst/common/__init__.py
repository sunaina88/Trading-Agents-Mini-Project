"""Common utilities and models for trading agents."""

# Core imports
from .models.llm_client import client

# Optional ML imports (may not be available)
try:
    from .models.finbert_model import finbert_analyzer
    _finbert_available = True
except ImportError:
    finbert_analyzer = None
    _finbert_available = False

__all__ = ['client', 'finbert_analyzer']