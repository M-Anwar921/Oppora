"""Deterministic scoring engine.

Gemini understands the email. This module calculates the ranking — no LLM
calls happen here, so results are reproducible and explainable.
"""

import re

from app.utils.date_utils import days_remaining

# ---------------------------------------------------------------------------
# Profile fit — max 100, broken into explainable sub-scores
# ---------------------------------------------------------------------------

CGPA_MAX = 20
DEGREE_PROGRAM_MAX = 15
SKILLS_MAX = 25
INTERESTS_MAX = 15
OPPORTUNITY_TYPE_MAX = 10
LOCATION_MAX = 10
PAST_EXPERIENCE_MAX = 5

_CGPA_PATTERN = re.compile(r"(?:cgpa|gpa)[^\d]{0,15}(\d(?:\.\d+)?)", re.IGNORECASE)


def _extract_required_cgpa(eligibility: list[str]) -> float | None:
    for line in eligibility:
        match = _CGPA_PATTERN.search(line)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                continue
    return None


def _score_cgpa(student_cgpa: float, eligibility: list[str]) -> tuple[int, str | None]:
    required = _extract_required_cgpa(eligibility)
    if required is None:
        # No stated requirement — no evidence against the student, award a neutral score.
        return round(CGPA_MAX * 0.6), None
    if student_cgpa >= required:
        return CGPA_MAX, f"Your CGPA of {student_cgpa} exceeds the required {required}."
    ratio = max(student_cgpa / required, 0.0)
    return round(CGPA_MAX * ratio * 0.5), f"Your CGPA of {student_cgpa} is below the required {required}."


def _score_degree_program(program: str, eligibility: list[str], requirements: list[str]) -> tuple[int, str | None]:
    haystack = " ".join(eligibility + requirements).lower()
    if not haystack.strip():
        return round(DEGREE_PROGRAM_MAX * 0.6), None
    program_tokens = [t for t in re.split(r"\W+", program.lower()) if len(t) > 2]
    if any(token in haystack for token in program_tokens):
        return DEGREE_PROGRAM_MAX, f"Your {program} program matches the stated field requirement."
    if "undergraduate" in haystack or "student" in haystack:
        return round(DEGREE_PROGRAM_MAX * 0.7), "You meet the general student eligibility requirement."
    return round(DEGREE_PROGRAM_MAX * 0.3), None


def _score_skills(student_skills: list[str], required_skills: list[str]) -> tuple[int, str | None]:
    if not required_skills:
        return round(SKILLS_MAX * 0.6), None
    student_lower = {s.lower() for s in student_skills}
    matched = [s for s in required_skills if s.lower() in student_lower]
    if not matched:
        return 0, None
    ratio = len(matched) / len(required_skills)
    points = round(SKILLS_MAX * ratio)
    note = f"{', '.join(matched)} match{'es' if len(matched) == 1 else ''} the required skills."
    return points, note


def _score_interests(student_interests: list[str], opportunity_text: str) -> tuple[int, str | None]:
    if not student_interests:
        return 0, None
    text_lower = opportunity_text.lower()
    matched = [i for i in student_interests if i.lower() in text_lower]
    if matched:
        return INTERESTS_MAX, f"This opportunity aligns with your interest in {matched[0]}."
    return round(INTERESTS_MAX * 0.4), None


def _score_opportunity_type(preferred_types: list[str], opportunity_type: str) -> tuple[int, str | None]:
    if not preferred_types:
        return round(OPPORTUNITY_TYPE_MAX * 0.6), None
    if opportunity_type and opportunity_type.lower() in [t.lower() for t in preferred_types]:
        return OPPORTUNITY_TYPE_MAX, f"This matches your preferred opportunity type: {opportunity_type}."
    return round(OPPORTUNITY_TYPE_MAX * 0.2), None


def _score_location(location_preference: list[str], opportunity_location: str | None) -> tuple[int, str | None]:
    if not opportunity_location:
        return round(LOCATION_MAX * 0.5), None
    loc_lower = opportunity_location.lower()
    if "remote" in loc_lower and any(p.lower() == "remote" for p in location_preference):
        return LOCATION_MAX, "This opportunity is remote, matching your location preference."
    if any(p.lower() in loc_lower for p in location_preference):
        return LOCATION_MAX, f"The location matches your preference for {opportunity_location}."
    if "international" in [p.lower() for p in location_preference]:
        return round(LOCATION_MAX * 0.7), None
    return round(LOCATION_MAX * 0.2), None


def _score_past_experience(past_experience: list[str], opportunity_text: str) -> tuple[int, str | None]:
    if not past_experience:
        return 0, None
    text_lower = opportunity_text.lower()
    matched = [e for e in past_experience if e.lower() in text_lower]
    if matched:
        return PAST_EXPERIENCE_MAX, f"Your experience in {matched[0]} is relevant here."
    return round(PAST_EXPERIENCE_MAX * 0.4), None


def calculate_profile_fit(profile: dict, opportunity: dict) -> dict:
    """Returns {"score": int, "breakdown": {...}, "reasons": [str, ...]}."""

    opportunity_text = " ".join(
        [
            opportunity.get("title") or "",
            opportunity.get("type") or "",
            " ".join(opportunity.get("eligibility") or []),
            " ".join(opportunity.get("requirements") or []),
        ]
    )

    cgpa_points, cgpa_note = _score_cgpa(profile.get("cgpa", 0.0), opportunity.get("eligibility") or [])
    degree_points, degree_note = _score_degree_program(
        profile.get("program", ""), opportunity.get("eligibility") or [], opportunity.get("requirements") or []
    )
    skills_points, skills_note = _score_skills(profile.get("skills") or [], opportunity.get("skills") or [])
    interest_points, interest_note = _score_interests(profile.get("interests") or [], opportunity_text)
    type_points, type_note = _score_opportunity_type(
        profile.get("preferredOpportunityTypes") or [], opportunity.get("type") or ""
    )
    location_points, location_note = _score_location(
        profile.get("locationPreference") or [], opportunity.get("location")
    )
    experience_points, experience_note = _score_past_experience(profile.get("pastExperience") or [], opportunity_text)

    breakdown = {
        "cgpaMatch": {"points": cgpa_points, "max": CGPA_MAX},
        "degreeProgramMatch": {"points": degree_points, "max": DEGREE_PROGRAM_MAX},
        "skillsMatch": {"points": skills_points, "max": SKILLS_MAX},
        "interestMatch": {"points": interest_points, "max": INTERESTS_MAX},
        "opportunityTypeMatch": {"points": type_points, "max": OPPORTUNITY_TYPE_MAX},
        "locationMatch": {"points": location_points, "max": LOCATION_MAX},
        "pastExperienceMatch": {"points": experience_points, "max": PAST_EXPERIENCE_MAX},
    }

    total = sum(v["points"] for v in breakdown.values())
    reasons = [n for n in [cgpa_note, degree_note, skills_note, interest_note, type_note, location_note, experience_note] if n]

    return {"score": min(max(total, 0), 100), "breakdown": breakdown, "reasons": reasons}


# ---------------------------------------------------------------------------
# Urgency
# ---------------------------------------------------------------------------


def calculate_urgency(deadline: str | None) -> dict:
    remaining = days_remaining(deadline)

    if remaining is None:
        return {"score": 20, "daysRemaining": None, "note": None}
    if remaining < 0:
        return {"score": 0, "daysRemaining": remaining, "note": "The deadline has already passed."}
    if remaining <= 3:
        note = "The deadline is approaching in " + (f"{remaining} day{'s' if remaining != 1 else ''}." if remaining else "less than a day.")
        return {"score": 100, "daysRemaining": remaining, "note": note}
    if remaining <= 7:
        return {"score": 85, "daysRemaining": remaining, "note": f"The deadline is approaching in {remaining} days."}
    if remaining <= 14:
        return {"score": 70, "daysRemaining": remaining, "note": None}
    if remaining <= 30:
        return {"score": 50, "daysRemaining": remaining, "note": None}
    return {"score": 30, "daysRemaining": remaining, "note": None}


# ---------------------------------------------------------------------------
# Completeness
# ---------------------------------------------------------------------------

_COMPLETENESS_FIELDS = ["title", "organization", "deadline", "eligibility", "requiredDocuments"]


def calculate_completeness(opportunity: dict) -> dict:
    present = 0
    total = len(_COMPLETENESS_FIELDS) + 1  # +1 for the combined applicationLink/contactEmail check

    missing = []
    for field in _COMPLETENESS_FIELDS:
        value = opportunity.get(field)
        if value:
            present += 1
        else:
            missing.append(field)

    if opportunity.get("applicationLink") or opportunity.get("contactEmail"):
        present += 1
    else:
        missing.append("applicationLink or contactEmail")

    score = round((present / total) * 100)
    return {"score": min(max(score, 0), 100), "missingFields": missing}


# ---------------------------------------------------------------------------
# Final score + priority
# ---------------------------------------------------------------------------

PROFILE_FIT_WEIGHT = 0.50
URGENCY_WEIGHT = 0.30
COMPLETENESS_WEIGHT = 0.20

PRIORITY_THRESHOLDS = [
    (90, "CRITICAL"),
    (75, "HIGH"),
    (50, "MEDIUM"),
    (0, "LOW"),
]


def calculate_final_score(profile_fit_score: int, urgency_score: int, completeness_score: int) -> int:
    weighted = (
        profile_fit_score * PROFILE_FIT_WEIGHT
        + urgency_score * URGENCY_WEIGHT
        + completeness_score * COMPLETENESS_WEIGHT
    )
    return round(weighted)


def priority_from_score(score: int) -> str:
    for threshold, label in PRIORITY_THRESHOLDS:
        if score >= threshold:
            return label
    return "LOW"
