from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class StudentProfileBase(BaseModel):
    degree: str = Field(..., min_length=1)
    program: str = Field(..., min_length=1)
    semester: int = Field(..., ge=1, le=12)
    cgpa: float = Field(..., ge=0.0, le=4.0)

    skills: list[str] = Field(default_factory=list)
    interests: list[str] = Field(default_factory=list)
    preferredOpportunityTypes: list[str] = Field(default_factory=list)
    financialNeed: bool = False
    locationPreference: list[str] = Field(default_factory=list)
    pastExperience: list[str] = Field(default_factory=list)

    @field_validator("skills", "interests", "preferredOpportunityTypes", "locationPreference", "pastExperience")
    @classmethod
    def strings_only(cls, value: list[str]) -> list[str]:
        cleaned = [str(v).strip() for v in value if str(v).strip()]
        return cleaned


class StudentProfileCreate(StudentProfileBase):
    pass


class StudentProfileUpdate(StudentProfileBase):
    pass


class StudentProfileResponse(StudentProfileBase):
    id: str = Field(..., alias="_id")
    createdAt: datetime
    updatedAt: datetime

    model_config = {"populate_by_name": True}
