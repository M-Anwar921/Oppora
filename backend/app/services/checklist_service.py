"""Generates the action checklist deterministically from extracted opportunity fields.

No LLM involvement — the checklist is derived directly from requiredDocuments
and a small set of always-relevant steps, so it's always accurate to what was
actually extracted.
"""

_DOCUMENT_VERBS = {
    "cv": "Prepare your CV",
    "resume": "Prepare your resume",
    "transcript": "Prepare your academic transcript",
    "academic transcript": "Prepare your academic transcript",
    "motivation letter": "Prepare your motivation letter",
    "cover letter": "Prepare your cover letter",
    "recommendation letter": "Request a recommendation letter",
    "portfolio": "Prepare your portfolio",
    "financial statement": "Prepare a financial statement",
    "proposal": "Draft your project proposal",
    "budget outline": "Prepare a budget outline",
}


def _checklist_item_for_document(document: str) -> str:
    key = document.strip().lower()
    if key in _DOCUMENT_VERBS:
        return _DOCUMENT_VERBS[key]
    for known_key, verb in _DOCUMENT_VERBS.items():
        if known_key in key:
            return verb
    return f"Prepare: {document.strip()}"


def generate_checklist(opportunity: dict) -> list[dict]:
    items: list[dict] = []
    seen_titles: set[str] = set()

    def add(title: str) -> None:
        if title not in seen_titles:
            items.append({"title": title, "completed": False})
            seen_titles.add(title)

    for document in opportunity.get("requiredDocuments") or []:
        add(_checklist_item_for_document(document))

    if opportunity.get("eligibility"):
        add("Review all eligibility requirements")

    if opportunity.get("deadline"):
        add("Verify the application deadline")

    add("Submit the application")

    return items
