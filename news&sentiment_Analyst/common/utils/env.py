"""Environment loader for local .env files."""

from __future__ import annotations

import os


def load_env() -> None:
    """Load environment variables from .env if python-dotenv is available."""
    try:
        from dotenv import load_dotenv
    except Exception:
        # Optional dependency. Keep runtime working without .env support.
        return

    # Use current working directory so CLI and imports behave consistently.
    load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"), override=False)
