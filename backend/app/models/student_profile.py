from datetime import datetime, timezone

from pydantic import BaseModel, Field

from app.models.common import PyObjectId


class StudentProfileModel(BaseModel):
    """Represents a student_profiles document as stored in MongoDB."""

    id: PyObjectId | None = Field(default=None, alias="_id")

    degree: str
    program: str
    semester: int
    cgpa: float

    skills: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    preferredOpportunityTypes: list[str] = Field(default_factory=list)
    financialNeed: bool = False
    locationPreference: list[str] = Field(default_factory=list)
    pastExperience: list[str] = Field(default_factory=list)

    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
