import logging

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import Collections
from app.dependencies.common import get_db, serialize_doc
from app.schemas.opportunity import OpportunityResponse
from app.schemas.ranking import RankingItem, RankingResponse

logger = logging.getLogger("opportunity_copilot.routers.ranking")

router = APIRouter(prefix="/api/ranking", tags=["ranking"])


@router.get("", response_model=RankingResponse)
async def get_ranking(db: AsyncIOMotorDatabase = Depends(get_db)):
    docs = await db[Collections.OPPORTUNITIES].find().to_list(length=500)
    docs.sort(key=lambda d: d.get("finalScore", 0), reverse=True)

    items = [
        RankingItem(
            rank=i + 1,
            finalScore=doc.get("finalScore", 0),
            priority=doc.get("priority", "LOW"),
            opportunity=OpportunityResponse(**serialize_doc(doc)),
        )
        for i, doc in enumerate(docs)
    ]

    return RankingResponse(total=len(items), items=items)
