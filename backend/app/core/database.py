import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings

logger = logging.getLogger("opportunity_copilot.database")

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


def connect_to_mongo() -> None:
    global _client, _db
    settings = get_settings()
    logger.info("Connecting to MongoDB at %s", settings.mongodb_database)
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    _db = _client[settings.mongodb_database]


def close_mongo_connection() -> None:
    global _client
    if _client is not None:
        logger.info("Closing MongoDB connection")
        _client.close()


def get_database() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database has not been initialized. Call connect_to_mongo() first.")
    return _db


# Collection name constants, kept in one place so routers/services never hardcode strings.
class Collections:
    PROFILES = "student_profiles"
    EMAILS = "emails"
    OPPORTUNITIES = "opportunities"
