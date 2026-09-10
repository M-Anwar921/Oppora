from datetime import datetime

from pydantic import BaseModel, Field


class ChecklistItemOut(BaseModel):
    title: str
    completed: bool = False


class OpportunityResponse(BaseModel):
    id: str = Field(..., alias="_id")
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

    profileFitScore: int
    urgencyScore: int
    completenessScore: int
    finalScore: int
    priority: str

    reasons: list[str] = Field(default_factory=list)
    actionChecklist: list[ChecklistItemOut] = Field(default_factory=list)

    createdAt: datetime

    model_config = {"populate_by_name": True}


class ChecklistUpdateRequest(BaseModel):
    actionChecklist: list[ChecklistItemOut]


class AnalyzeEmailsResponse(BaseModel):
    totalEmails: int
    opportunitiesFound: int
    irrelevantEmails: int
    failedEmails: int
    opportunities: list[OpportunityResponse]
