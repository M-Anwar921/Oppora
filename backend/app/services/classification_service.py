import logging

from app.services.gemini_service import GeminiResponseError, generate_json
from app.utils.prompts import CLASSIFICATION_PROMPT

logger = logging.getLogger("opportunity_copilot.classification")


class ClassificationResult:
    def __init__(self, is_opportunity: bool, confidence: float, reason: str):
        self.is_opportunity = is_opportunity
        self.confidence = confidence
        self.reason = reason


async def classify_email(sender: str, subject: str, body: str) -> ClassificationResult:
    """Asks Gemini whether this email contains a genuine student opportunity.

    The `isOpportunity` boolean is always the deciding field — confidence is
    informational only and is never used on its own to make the decision.
    """
    prompt = CLASSIFICATION_PROMPT.format(sender=sender, subject=subject, body=body)

    try:
        data = await generate_json(prompt)
    except GeminiResponseError as exc:
        logger.error("Classification failed for email from %s: %s", sender, exc)
        raise

    is_opportunity = bool(data.get("isOpportunity", False))
    try:
        confidence = float(data.get("confidence", 0.0))
    except (TypeError, ValueError):
        confidence = 0.0
    confidence = min(max(confidence, 0.0), 1.0)
    reason = str(data.get("reason", "")).strip() or "No reason provided."

    return ClassificationResult(is_opportunity=is_opportunity, confidence=confidence, reason=reason)
