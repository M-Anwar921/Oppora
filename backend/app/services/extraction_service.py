import logging

from pydantic import BaseModel, Field, ValidationError, field_validator

from app.services.gemini_service import GeminiResponseError, generate_json
from app.utils.prompts import EXTRACTION_PROMPT

logger = logging.getLogger("opportunity_copilot.extraction")

VALID_TYPES = [
    "Internship",
    "Scholarship",
    "Fellowship",
    "Competition",
    "Research",
    "Admission",
    "Job",
    "Grant",
    "Other",
]


class ExtractedOpportunityData(BaseModel):
    """Validates the raw JSON Gemini returns before it's trusted anywhere else in the app."""

    title: str | None = None
    organization: str | None = None
    type: str | None = None
    deadline: str | None = None
    eligibility: list[str] = Field(default_factory=list)
    requiredDocuments: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    location: str | None = None
    financialBenefits: str | None = None
    applicationLink: str | None = None
    contactEmail: str | None = None
    requirements: list[str] = Field(default_factory=list)

    @field_validator("type")
    @classmethod
    def normalize_type(cls, value: str | None) -> str | None:
        if value is None:
            return None
        for valid in VALID_TYPES:
            if value.strip().lower() == valid.lower():
                return valid
        return "Other"

    @field_validator("eligibility", "requiredDocuments", "skills", "requirements")
    @classmethod
    def clean_lists(cls, value: list[str]) -> list[str]:
        return [str(v).strip() for v in value if str(v).strip()]


class ExtractionError(Exception):
    pass


async def extract_opportunity(sender: str, subject: str, body: str) -> ExtractedOpportunityData:
    """Extracts structured opportunity fields from an email already classified as genuine."""
    prompt = EXTRACTION_PROMPT.format(sender=sender, subject=subject, body=body)

    try:
        data = await generate_json(prompt)
    except GeminiResponseError as exc:
        logger.error("Extraction failed for email from %s: %s", sender, exc)
        raise ExtractionError(str(exc)) from exc

    try:
        return ExtractedOpportunityData(**data)
    except ValidationError as exc:
        logger.error("Extracted data failed validation for email from %s: %s", sender, exc)
        raise ExtractionError(str(exc)) from exc
