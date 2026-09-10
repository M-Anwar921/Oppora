from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field

from app.models.common import PyObjectId


class EmailStatus(str, Enum):
    PENDING = "pending"
    PROCESSED = "processed"
    IRRELEVANT = "irrelevant"
    FAILED = "failed"


class EmailModel(BaseModel):
    """Represents an emails document as stored in MongoDB."""

    id: PyObjectId | None = Field(default=None, alias="_id")

    sender: str
    subject: str
    body: str

    isOpportunity: bool = False
    classificationConfidence: float = 0.0
    classificationReason: str = ""

    status: EmailStatus = EmailStatus.PENDING

    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
