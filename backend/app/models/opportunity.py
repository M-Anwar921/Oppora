from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field

from app.models.common import PyObjectId


class Priority(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class ChecklistItem(BaseModel):
    title: str
    completed: bool = False


class OpportunityModel(BaseModel):
    """Represents an opportunities document as stored in MongoDB."""

    id: PyObjectId | None = Field(default=None, alias="_id")
    emailId: str | None = None

    title: str
    organization: str
    type: str
    deadline: str | None = None

    eligibility: list[str] = Field(default_factory=list)
    requiredDocuments: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    location: str | None = None
    financialBenefits: str | None = None
    applicationLink: str | None = None
    contactEmail: str | None = None
    requirements: list[str] = Field(default_factory=list)

    profileFitScore: int = 0
    urgencyScore: int = 0
    completenessScore: int = 0
    finalScore: int = 0
    priority: Priority = Priority.LOW

    reasons: list[str] = Field(default_factory=list)
    actionChecklist: list[ChecklistItem] = Field(default_factory=list)

    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
