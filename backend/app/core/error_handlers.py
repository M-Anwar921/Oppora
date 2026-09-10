import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError

from app.services.gemini_service import GeminiResponseError

logger = logging.getLogger("opportunity_copilot.errors")


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, exc: RequestValidationError):
        # Flatten Pydantic's error list into one readable message while keeping
        # the field-level detail available for API consumers that want it.
        first_error = exc.errors()[0] if exc.errors() else None
        message = "Invalid request data."
        if first_error:
            field = ".".join(str(p) for p in first_error.get("loc", []) if p != "body")
            message = f"{field}: {first_error.get('msg')}" if field else first_error.get("msg", message)

        logger.warning("Validation error on %s: %s", request.url.path, message)
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": message, "errors": exc.errors()},
        )

    @app.exception_handler(GeminiResponseError)
    async def handle_gemini_error(request: Request, exc: GeminiResponseError):
        logger.error("Gemini error on %s: %s", request.url.path, exc)
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={"detail": "The AI service could not process this request. Please try again."},
        )

    @app.exception_handler(PyMongoError)
    async def handle_mongo_error(request: Request, exc: PyMongoError):
        logger.error("MongoDB error on %s: %s", request.url.path, exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "A database error occurred. Please try again."},
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s", request.url.path)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Unable to process this request."},
        )
