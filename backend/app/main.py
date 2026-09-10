import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.core.error_handlers import register_exception_handlers
from app.routers import emails, opportunities, profile, ranking

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("opportunity_copilot")


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_mongo()
    logger.info("Opportunity Inbox Copilot API started")
    yield
    close_mongo_connection()
    logger.info("Opportunity Inbox Copilot API shut down")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Opportunity Inbox Copilot API",
        description="AI-powered opportunity intelligence backend — detects, extracts, scores, and ranks "
        "student opportunities from email batches.",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/", tags=["health"])
    async def root():
        return {"status": "ok", "service": "Opportunity Inbox Copilot API"}

    @app.get("/api/health", tags=["health"])
    async def health():
        return {"status": "healthy"}

    app.include_router(profile.router)
    app.include_router(emails.router)
    app.include_router(opportunities.router)
    app.include_router(ranking.router)

    register_exception_handlers(app)

    return app


app = create_app()
