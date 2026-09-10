import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import Collections
from app.dependencies.common import get_active_profile, get_db, serialize_doc
from app.models.email import EmailStatus
from app.schemas.email import EmailBatchIn, EmailOut
from app.schemas.opportunity import AnalyzeEmailsResponse, OpportunityResponse
from app.services.checklist_service import generate_checklist
from app.services.classification_service import classify_email
from app.services.extraction_service import ExtractionError, extract_opportunity
from app.services.gemini_service import GeminiResponseError
from app.services.ranking_service import rank_opportunities, score_opportunity

logger = logging.getLogger("opportunity_copilot.routers.emails")

router = APIRouter(prefix="/api/emails", tags=["emails"])


@router.post("", response_model=list[EmailOut], status_code=201)
async def submit_emails(payload: EmailBatchIn, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Stores a raw batch of emails without running analysis."""
    now = datetime.now(timezone.utc)
    documents = [
        {
            "sender": e.sender,
            "subject": e.subject,
            "body": e.body,
            "isOpportunity": False,
            "classificationConfidence": 0.0,
            "classificationReason": "",
            "status": EmailStatus.PENDING.value,
            "createdAt": now,
        }
        for e in payload.emails
    ]
    result = await db[Collections.EMAILS].insert_many(documents)
    stored = await db[Collections.EMAILS].find({"_id": {"$in": result.inserted_ids}}).to_list(length=None)
    return [serialize_doc(d) for d in stored]


@router.get("", response_model=list[EmailOut])
async def get_emails(db: AsyncIOMotorDatabase = Depends(get_db)):
    docs = await db[Collections.EMAILS].find().sort("createdAt", -1).to_list(length=200)
    return [serialize_doc(d) for d in docs]


@router.post("/analyze", response_model=AnalyzeEmailsResponse)
async def analyze_emails(
    payload: EmailBatchIn,
    db: AsyncIOMotorDatabase = Depends(get_db),
    profile: dict = Depends(get_active_profile),
):
    """The core pipeline: classify → extract → score → rank, per email, fault-tolerant.

    A failure on one email (a Gemini error, a malformed response) never stops
    the rest of the batch — it's recorded as a failed email and processing
    continues.
    """
    now = datetime.now(timezone.utc)
    opportunities_found = 0
    irrelevant_count = 0
    failed_count = 0
    stored_opportunities: list[dict] = []

    for email in payload.emails:
        email_doc = {
            "sender": email.sender,
            "subject": email.subject,
            "body": email.body,
            "isOpportunity": False,
            "classificationConfidence": 0.0,
            "classificationReason": "",
            "status": EmailStatus.PENDING.value,
            "createdAt": now,
        }
        insert_result = await db[Collections.EMAILS].insert_one(email_doc)
        email_id = str(insert_result.inserted_id)

        logger.info("Processing email from %s — %s", email.sender, email.subject)

        # Step 1: classify
        try:
            classification = await classify_email(email.sender, email.subject, email.body)
        except GeminiResponseError as exc:
            logger.error("Classification failed for %s: %s", email.sender, exc)
            await db[Collections.EMAILS].update_one(
                {"_id": insert_result.inserted_id}, {"$set": {"status": EmailStatus.FAILED.value}}
            )
            failed_count += 1
            continue

        await db[Collections.EMAILS].update_one(
            {"_id": insert_result.inserted_id},
            {
                "$set": {
                    "isOpportunity": classification.is_opportunity,
                    "classificationConfidence": classification.confidence,
                    "classificationReason": classification.reason,
                }
            },
        )

        if not classification.is_opportunity:
            await db[Collections.EMAILS].update_one(
                {"_id": insert_result.inserted_id}, {"$set": {"status": EmailStatus.IRRELEVANT.value}}
            )
            irrelevant_count += 1
            continue

        # Step 2: extract
        try:
            extracted = await extract_opportunity(email.sender, email.subject, email.body)
        except ExtractionError as exc:
            logger.error("Extraction failed for %s: %s", email.sender, exc)
            await db[Collections.EMAILS].update_one(
                {"_id": insert_result.inserted_id}, {"$set": {"status": EmailStatus.FAILED.value}}
            )
            failed_count += 1
            continue

        opportunity_data = extracted.model_dump()
        opportunity_data.setdefault("title", email.subject)
        if not opportunity_data.get("title"):
            opportunity_data["title"] = email.subject

        # Step 3: deterministic scoring (never Gemini)
        scoring = score_opportunity(profile, opportunity_data)

        # Step 4: deterministic checklist
        checklist = generate_checklist(opportunity_data)

        opportunity_doc = {
            "emailId": email_id,
            "title": opportunity_data.get("title") or "Untitled opportunity",
            "organization": opportunity_data.get("organization") or "Not specified in the email",
            "type": opportunity_data.get("type") or "Other",
            "deadline": opportunity_data.get("deadline"),
            "eligibility": opportunity_data.get("eligibility") or [],
            "requiredDocuments": opportunity_data.get("requiredDocuments") or [],
            "skills": opportunity_data.get("skills") or [],
            "location": opportunity_data.get("location"),
            "financialBenefits": opportunity_data.get("financialBenefits"),
            "applicationLink": opportunity_data.get("applicationLink"),
            "contactEmail": opportunity_data.get("contactEmail"),
            "requirements": opportunity_data.get("requirements") or [],
            "profileFitScore": scoring["profileFitScore"],
            "urgencyScore": scoring["urgencyScore"],
            "completenessScore": scoring["completenessScore"],
            "finalScore": scoring["finalScore"],
            "priority": scoring["priority"],
            "reasons": scoring["reasons"],
            "actionChecklist": checklist,
            "createdAt": now,
        }

        insert_opp_result = await db[Collections.OPPORTUNITIES].insert_one(opportunity_doc)
        opportunity_doc["_id"] = insert_opp_result.inserted_id
        stored_opportunities.append(serialize_doc(opportunity_doc))

        await db[Collections.EMAILS].update_one(
            {"_id": insert_result.inserted_id}, {"$set": {"status": EmailStatus.PROCESSED.value}}
        )
        opportunities_found += 1

    ranked = rank_opportunities(stored_opportunities)

    logger.info(
        "Analysis complete: %s total, %s opportunities, %s irrelevant, %s failed",
        len(payload.emails),
        opportunities_found,
        irrelevant_count,
        failed_count,
    )

    return AnalyzeEmailsResponse(
        totalEmails=len(payload.emails),
        opportunitiesFound=opportunities_found,
        irrelevantEmails=irrelevant_count,
        failedEmails=failed_count,
        opportunities=[OpportunityResponse(**o) for o in ranked],
    )
