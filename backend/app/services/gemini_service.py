"""Thin wrapper around the Gemini API.

Every call here returns parsed JSON (a dict) or raises GeminiResponseError —
callers never have to deal with raw text or malformed markdown-wrapped JSON.
"""

import json
import logging
import re

from google import genai

from app.core.config import get_settings

logger = logging.getLogger("opportunity_copilot.gemini")

_client: genai.Client | None = None


class GeminiResponseError(Exception):
    """Raised when Gemini's response can't be parsed into usable JSON, even after a retry."""


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        settings = get_settings()
        if not settings.gemini_api_key:
            logger.warning("GEMINI_API_KEY is not set — Gemini calls will fail until it is configured.")
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


def _strip_markdown_fences(text: str) -> str:
    text = text.strip()
    # Handles ```json ... ``` and plain ``` ... ``` wrappers.
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _parse_json_response(raw_text: str) -> dict:
    cleaned = _strip_markdown_fences(raw_text or "")
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Last resort: grab the first {...} block in the text.
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
        raise GeminiResponseError(f"Could not parse JSON from Gemini response: {raw_text[:200]!r}")


async def generate_json(prompt: str, *, retry: bool = True) -> dict:
    """Sends a prompt to Gemini and returns the parsed JSON object it responds with."""
    settings = get_settings()
    client = _get_client()

    try:
        response = await client.aio.models.generate_content(model=settings.gemini_model, contents=prompt)
        return _parse_json_response(response.text)
    except GeminiResponseError:
        if not retry:
            raise
        logger.info("Retrying Gemini call once after a malformed JSON response.")
        try:
            retry_prompt = prompt + "\n\nReminder: respond with ONLY valid JSON, no markdown fences, no commentary."
            response = await client.aio.models.generate_content(model=settings.gemini_model, contents=retry_prompt)
            return _parse_json_response(response.text)
        except GeminiResponseError:
            raise
    except Exception as exc:  # Gemini SDK / network errors
        logger.error("Gemini API call failed: %s", exc)
        raise GeminiResponseError(str(exc)) from exc
