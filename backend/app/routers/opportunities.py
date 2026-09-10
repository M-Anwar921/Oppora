import logging

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import Collections
from app.dependencies.common import get_db, serialize_doc
from app.schemas.opportunity import ChecklistUpdateRequest, OpportunityResponse
from app.utils.date_utils import days_remaining

logger = logging.getLogger("opportunity_copilot.routers.opportunities")

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])


@router.get("", response_model=list[OpportunityResponse])
async def list_opportunities(
    priority: str | None = Query(default=None, description="Filter by priority, e.g. HIGH"),
    type: str | None = Query(default=None, description="Filter by opportunity type, e.g. Internship"),
    search: str | None = Query(default=None, description="Search title, organization, or skills"),
    sort: str | None = Query(default="score", description="score | deadline | fit | newest"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    query: dict = {}
    if priority:
        query["priority"] = priority.upper()
    if type:
        query["type"] = {"$regex": f"^{type}$", "$options": "i"}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"organization": {"$regex": search, "$options": "i"}},
            {"skills": {"$regex": search, "$options": "i"}},
        ]

    docs = await db[Collections.OPPORTUNITIES].find(query).to_list(length=500)

    if sort == "deadline":
        docs.sort(key=lambda d: (days_remaining(d.get("deadline")) if d.get("deadline") else 9999))
    elif sort == "fit":
        docs.sort(key=lambda d: d.get("profileFitScore", 0), reverse=True)
    elif sort == "newest":
        docs.sort(key=lambda d: d.get("createdAt"), reverse=True)
    else:
        docs.sort(key=lambda d: d.get("finalScore", 0), reverse=True)

    return [serialize_doc(d) for d in docs]


@router.get("/{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(opportunity_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        object_id = ObjectId(opportunity_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid opportunity id.")

    doc = await db[Collections.OPPORTUNITIES].find_one({"_id": object_id})
    if doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")
    return serialize_doc(doc)


@router.put("/{opportunity_id}", response_model=OpportunityResponse)
async def update_checklist(
    opportunity_id: str, payload: ChecklistUpdateRequest, db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        object_id = ObjectId(opportunity_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid opportunity id.")

    existing = await db[Collections.OPPORTUNITIES].find_one({"_id": object_id})
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opportunity not found.")

    checklist = [item.model_dump() for item in payload.actionChecklist]
    await db[Collections.OPPORTUNITIES].update_one({"_id": object_id}, {"$set": {"actionChecklist": checklist}})
    updated = await db[Collections.OPPORTUNITIES].find_one({"_id": object_id})
    return serialize_doc(updated)
