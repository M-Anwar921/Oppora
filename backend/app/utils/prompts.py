"""Prompt templates for Gemini. Kept out of services/routers so they're easy to tune."""

CLASSIFICATION_PROMPT = """You are classifying a single email to determine whether it contains a genuine \
opportunity for a university student.

Genuine opportunity types: Internship, Scholarship, Fellowship, Competition, Research, Admission, Job, Grant, Other.

NOT opportunities: advertisements, spam, generic newsletters, promotional messages, unrelated announcements \
(e.g. campus notices, IT outages, unrelated events).

Email sender: {sender}
Email subject: {subject}
Email body:
{body}

Respond with ONLY a JSON object in exactly this shape, no markdown, no commentary:
{{
  "isOpportunity": true or false,
  "confidence": a number between 0 and 1,
  "reason": "one sentence explaining the classification"
}}"""


EXTRACTION_PROMPT = """You are extracting structured opportunity information from a single email that has \
already been classified as a genuine student opportunity.

Critical rules:
1. Never hallucinate information that is not present in the email.
2. Never invent a deadline. If no deadline is stated, use null.
3. Never invent requirements, eligibility, or documents. If a list is unknown, use an empty array.
4. Use null for any single unknown value.
5. Only extract evidence that is actually present in the email text.

Email sender: {sender}
Email subject: {subject}
Email body:
{body}

Respond with ONLY a JSON object in exactly this shape, no markdown, no commentary:
{{
  "title": null or "string",
  "organization": null or "string",
  "type": null or "one of: Internship, Scholarship, Fellowship, Competition, Research, Admission, Job, Grant, Other",
  "deadline": null or "YYYY-MM-DD",
  "eligibility": [],
  "requiredDocuments": [],
  "skills": [],
  "location": null or "string",
  "financialBenefits": null or "string",
  "applicationLink": null or "string",
  "contactEmail": null or "string",
  "requirements": []
}}"""
