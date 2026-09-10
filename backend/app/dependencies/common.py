from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import Collections, get_database


def get_db() -> AsyncIOMotorDatabase:
    return get_database()


def serialize_doc(doc: dict) -> dict:
    """Converts a MongoDB document's _id (ObjectId) to a plain string for API responses."""
    if doc is None:
        return doc
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


async def get_active_profile(db: AsyncIOMotorDatabase = None) -> dict:
    """Returns the single most-recently-updated student profile.

    This MVP intentionally has no auth/multi-user support — there is one
    active profile at a time, matching the hackathon scope.
    """
    if db is None:
        db = get_database()

    profile = await db[Collections.PROFILES].find_one(sort=[("updatedAt", -1)])
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No student profile found. Create one with POST /api/profile first.",
        )
    return serialize_doc(profile)
