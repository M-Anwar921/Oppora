import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import Collections
from app.dependencies.common import get_db, serialize_doc
from app.schemas.student_profile import StudentProfileCreate, StudentProfileResponse, StudentProfileUpdate

logger = logging.getLogger("opportunity_copilot.routers.profile")

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.post("", response_model=StudentProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(payload: StudentProfileCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    now = datetime.now(timezone.utc)
    document = payload.model_dump()
    document["createdAt"] = now
    document["updatedAt"] = now

    result = await db[Collections.PROFILES].insert_one(document)
    created = await db[Collections.PROFILES].find_one({"_id": result.inserted_id})
    logger.info("Created student profile %s", result.inserted_id)
    return serialize_doc(created)


@router.get("", response_model=StudentProfileResponse)
async def get_profile(db: AsyncIOMotorDatabase = Depends(get_db)):
    profile = await db[Collections.PROFILES].find_one(sort=[("updatedAt", -1)])
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No student profile found. Create one with POST /api/profile first.",
        )
    return serialize_doc(profile)


@router.put("", response_model=StudentProfileResponse)
async def update_profile(payload: StudentProfileUpdate, db: AsyncIOMotorDatabase = Depends(get_db)):
    existing = await db[Collections.PROFILES].find_one(sort=[("updatedAt", -1)])
    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No student profile found. Create one with POST /api/profile first.",
        )

    update_data = payload.model_dump()
    update_data["updatedAt"] = datetime.now(timezone.utc)

    await db[Collections.PROFILES].update_one({"_id": existing["_id"]}, {"$set": update_data})
    updated = await db[Collections.PROFILES].find_one({"_id": existing["_id"]})
    logger.info("Updated student profile %s", existing["_id"])
    return serialize_doc(updated)
