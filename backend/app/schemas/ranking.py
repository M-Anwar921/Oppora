from pydantic import BaseModel

from app.schemas.opportunity import OpportunityResponse


class RankingItem(BaseModel):
    rank: int
    finalScore: int
    priority: str
    opportunity: OpportunityResponse


class RankingResponse(BaseModel):
    total: int
    items: list[RankingItem]
