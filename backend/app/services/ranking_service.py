"""Combines the deterministic scoring functions into a single opportunity scoring pass.

This is the one place that turns (profile, extracted opportunity) into the
finalScore/priority/reasons a client actually sees.
"""

from app.utils.scoring import (
    calculate_completeness,
    calculate_final_score,
    calculate_profile_fit,
    calculate_urgency,
    priority_from_score,
)


def score_opportunity(profile: dict, opportunity: dict) -> dict:
    """Returns the full scoring payload for one opportunity against one profile.

    {
      "profileFitScore": int,
      "urgencyScore": int,
      "completenessScore": int,
      "finalScore": int,
      "priority": str,
      "reasons": [str, ...],
    }
    """
    fit = calculate_profile_fit(profile, opportunity)
    urgency = calculate_urgency(opportunity.get("deadline"))
    completeness = calculate_completeness(opportunity)

    final_score = calculate_final_score(fit["score"], urgency["score"], completeness["score"])
    priority = priority_from_score(final_score)

    reasons = list(fit["reasons"])
    if urgency.get("note"):
        reasons.append(urgency["note"])

    return {
        "profileFitScore": fit["score"],
        "urgencyScore": urgency["score"],
        "completenessScore": completeness["score"],
        "finalScore": final_score,
        "priority": priority,
        "reasons": reasons,
        # Kept for callers that want the full explainable breakdown (e.g. opportunity details view).
        "scoreBreakdown": fit["breakdown"],
        "daysRemaining": urgency.get("daysRemaining"),
        "missingFields": completeness.get("missingFields", []),
    }


def rank_opportunities(opportunities: list[dict]) -> list[dict]:
    """Sorts opportunities by finalScore descending. Does not mutate the input list."""
    return sorted(opportunities, key=lambda o: o.get("finalScore", 0), reverse=True)
