from datetime import datetime

from pydantic import BaseModel, Field, field_validator, model_validator

MAX_EMAILS = 15
MIN_EMAILS = 1


class EmailIn(BaseModel):
    sender: str = Field(..., min_length=1)
    subject: str = ""
    body: str = ""

    @model_validator(mode="after")
    def subject_or_body_required(self) -> "EmailIn":
        if not self.subject.strip() and not self.body.strip():
            raise ValueError("Email must have a subject or a body.")
        return self


class EmailBatchIn(BaseModel):
    emails: list[EmailIn]

    @field_validator("emails")
    @classmethod
    def validate_batch_size(cls, value: list[EmailIn]) -> list[EmailIn]:
        if len(value) < MIN_EMAILS:
            raise ValueError("At least one email is required.")
        if len(value) > MAX_EMAILS:
            raise ValueError(f"A maximum of {MAX_EMAILS} emails is supported per batch.")
        return value


class EmailOut(BaseModel):
    id: str = Field(..., alias="_id")
    sender: str
    subject: str
    body: str
    isOpportunity: bool
    classificationConfidence: float
    classificationReason: str
    status: str
    createdAt: datetime

    model_config = {"populate_by_name": True}
