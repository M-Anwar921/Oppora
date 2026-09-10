"""Thin wrapper around the Gemini API.

Every call here returns parsed JSON (a dict) or raises GeminiResponseError —
callers never have to deal with raw text or malformed markdown-wrapped JSON.
"""

import json
import logging
import re

import google.generativeai as genai

from app.core.config import get_settings

logger = logging.getLogger("opportunity_copilot.gemini")

_configured = False


class GeminiResponseError(Exception):
    """Raised when Gemini's response can't be parsed into usable JSON, even after a retry."""


def _ensure_configured() -> None:
    global _configured
    if _configured:
        return
    settings = get_settings()
    if not settings.gemini_api_key:
        logger.warning("GEMINI_API_KEY is not set — Gemini calls will fail until it is configured.")
    genai.configure(api_key=settings.gemini_api_key)
    _configured = True


def _strip_markdown_fences(text: str) -> str:
    text = text.strip()
    # Handles ```json ... ``` and plain ``` ... ``` wrappers.
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _parse_json_response(raw_text: str) -> dict:
    cleaned = _strip_markdown_fences(raw_text)
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
    _ensure_configured()
    settings = get_settings()
    model = genai.GenerativeModel(settings.gemini_model)

    try:
        response = await model.generate_content_async(prompt)
        return _parse_json_response(response.text)
    except GeminiResponseError:
        if not retry:
            raise
        logger.info("Retrying Gemini call once after a malformed JSON response.")
        try:
            retry_prompt = prompt + "\n\nReminder: respond with ONLY valid JSON, no markdown fences, no commentary."
            response = await model.generate_content_async(retry_prompt)
            return _parse_json_response(response.text)
        except GeminiResponseError:
            raise
    except Exception as exc:  # Gemini SDK / network errors
        logger.error("Gemini API call failed: %s", exc)
        raise GeminiResponseError(str(exc)) from exc
