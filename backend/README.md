# Opportunity Inbox Copilot — Backend

An AI-powered opportunity intelligence backend. It takes a student profile and a batch of emails, uses Gemini to
detect and extract genuine opportunities, and then **deterministically** scores, ranks, and explains them with
plain Python — no LLM involved in the ranking itself.

## Architecture

The one rule the whole pipeline is built around:

```
Email
  ↓
Gemini Classification        ← Gemini decides: opportunity or not?
  ↓
Opportunity Detection
  ↓
Gemini Structured Extraction ← Gemini pulls out title, deadline, eligibility, etc.
  ↓
Validated Opportunity Data   ← Pydantic validates every field Gemini returns
  ↓
Python Deterministic Ranking Engine
  ↓
Profile Fit + Urgency + Completeness
  ↓
Final Score → Priority
```

**Gemini understands the email. Python calculates the ranking.** The final score, priority label, and every
evidence-backed reason a student sees are produced by plain, testable Python functions in `app/utils/scoring.py` —
never by asking the LLM to judge or rank anything.

A failure on any single email (a malformed Gemini response, a validation error) is caught, logged, and recorded as
a failed email — it never aborts the rest of the batch.

## Technology stack

- Python 3.11+, FastAPI, Uvicorn
- Pydantic v2 / Pydantic Settings for validation and config
- MongoDB via Motor (async driver)
- Gemini API via the `google-genai` SDK
- `python-dateutil` for safe deadline parsing
- pytest for the scoring/extraction test suite

## Project structure

```
backend/
  app/
    main.py                    # App factory, CORS, lifespan, router wiring
    core/
      config.py                # Settings loaded from environment variables
      database.py               # Motor connection + collection name constants
      error_handlers.py          # Global exception handlers
    models/                     # MongoDB document shapes (student_profiles, emails, opportunities)
    schemas/                    # API request/response validation (Pydantic)
    routers/
      profile.py                # POST/GET/PUT /api/profile
      emails.py                  # POST /api/emails, GET /api/emails, POST /api/emails/analyze
      opportunities.py           # GET /api/opportunities, GET/PUT /api/opportunities/{id}
      ranking.py                 # GET /api/ranking
    services/
      gemini_service.py          # Gemini wrapper with safe JSON parsing + one retry
      classification_service.py  # Is this email a genuine opportunity?
      extraction_service.py      # Structured field extraction + validation
      ranking_service.py         # Combines scoring.py into a full opportunity score
      checklist_service.py       # Deterministic action checklist generation
    utils/
      scoring.py                  # The deterministic ranking engine (profile fit / urgency / completeness)
      date_utils.py                # Safe deadline parsing and days-remaining math
      prompts.py                   # Gemini prompt templates
    dependencies/
      common.py                    # get_db, get_active_profile, serialize_doc
    tests/
      test_ranking.py               # Scoring engine unit tests
      test_extraction.py            # Extraction validation + checklist tests
  requirements.txt
  .env.example
```

## Installation

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=opportunity_copilot

GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash

CORS_ORIGINS=http://localhost:5173
```

The Gemini API key is only ever read server-side (`app/core/config.py`) — it is never sent to or exposed on the
frontend.

## Running the server

```bash
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`, with interactive documentation at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Running tests

```bash
pytest app/tests/ -v
```

The test suite covers profile-fit, urgency, completeness, final-score, and priority-assignment logic — including
edge cases (no deadline, expired deadline, missing skills, missing eligibility, no matching profile fields, and a
fully complete opportunity) — plus extraction validation and checklist generation. All tests run without a live
database or a real Gemini API key.

## API endpoint summary

| Method | Endpoint                        | Description                                   |
|--------|----------------------------------|------------------------------------------------|
| POST   | `/api/profile`                  | Create the student profile                     |
| GET    | `/api/profile`                  | Get the active student profile                 |
| PUT    | `/api/profile`                  | Update the active student profile              |
| POST   | `/api/emails`                   | Store a raw batch of emails (no analysis)      |
| GET    | `/api/emails`                   | List stored emails                             |
| POST   | `/api/emails/analyze`           | **Core pipeline** — classify, extract, score, rank |
| GET    | `/api/opportunities`            | List opportunities (`priority`, `type`, `search`, `sort` query params) |
| GET    | `/api/opportunities/{id}`       | Full opportunity detail, including score breakdown and checklist |
| PUT    | `/api/opportunities/{id}`       | Update an opportunity's action checklist       |
| GET    | `/api/ranking`                  | Opportunities ordered by `finalScore` descending |

## Ranking algorithm

**Profile Fit (max 100, 50% of final score)**

| Factor | Points |
|---|---|
| CGPA match | 20 |
| Degree / program match | 15 |
| Skills match | 25 |
| Interest match | 15 |
| Opportunity type preference | 10 |
| Location match | 10 |
| Past experience match | 5 |

**Urgency (30% of final score)** — based on days remaining until the deadline:

| Days remaining | Score |
|---|---|
| Deadline passed | 0 |
| 0–3 days | 100 |
| 4–7 days | 85 |
| 8–14 days | 70 |
| 15–30 days | 50 |
| More than 30 days | 30 |
| No deadline found | 20 |

**Completeness (20% of final score)** — the share of important fields (title, organization, deadline, eligibility,
required documents, and application link/contact) that were actually extracted.

**Final score** = `Profile Fit × 0.50 + Urgency × 0.30 + Completeness × 0.20`, rounded to the nearest integer.

**Priority**

| Score | Priority |
|---|---|
| 90–100 | CRITICAL |
| 75–89 | HIGH |
| 50–74 | MEDIUM |
| 0–49 | LOW |

Thresholds live in one place (`PRIORITY_THRESHOLDS` in `app/utils/scoring.py`) so they're easy to tune.

## Notes on scope

This is a hackathon-scoped MVP by design: no auth, no microservices, no message queues, no vector database, no
RAG/LangChain. One active student profile at a time. The focus is the core intelligence pipeline end to end:

```
Email → AI Detection → Structured Extraction → Profile Matching → Deterministic Ranking → Evidence → Action
```
