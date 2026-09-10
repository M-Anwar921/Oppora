from datetime import datetime, timedelta, timezone

import pytest

from app.utils.scoring import (
    calculate_completeness,
    calculate_final_score,
    calculate_profile_fit,
    calculate_urgency,
    priority_from_score,
)


def _iso_days_from_now(days: int) -> str:
    return (datetime.now(timezone.utc) + timedelta(days=days)).strftime("%Y-%m-%d")


COMPLETE_PROFILE = {
    "cgpa": 3.62,
    "program": "Computer Science",
    "skills": ["Python", "React", "Machine Learning"],
    "interests": ["Research", "Generative AI"],
    "preferredOpportunityTypes": ["Internship"],
    "locationPreference": ["Remote", "Pakistan"],
    "pastExperience": ["AI Projects"],
}


def _opportunity(**overrides):
    base = {
        "title": "AI Research Internship",
        "organization": "ABC Labs",
        "type": "Internship",
        "deadline": _iso_days_from_now(3),
        "eligibility": ["Undergraduate student", "Minimum CGPA: 3.0"],
        "requiredDocuments": ["CV", "Transcript"],
        "skills": ["Python", "Machine Learning"],
        "location": "Remote",
        "requirements": [],
        "applicationLink": "https://example.com/apply",
        "contactEmail": "careers@example.com",
    }
    base.update(overrides)
    return base


class TestProfileFit:
    def test_full_match_scores_highly(self):
        result = calculate_profile_fit(COMPLETE_PROFILE, _opportunity())
        assert result["score"] >= 85
        assert any("CGPA" in r for r in result["reasons"])

    def test_missing_skills_scores_lower(self):
        opportunity = _opportunity(skills=["Java", "Kotlin"])
        result = calculate_profile_fit(COMPLETE_PROFILE, opportunity)
        no_skills_result = calculate_profile_fit(COMPLETE_PROFILE, _opportunity())
        assert result["score"] < no_skills_result["score"]

    def test_no_eligibility_data_does_not_crash(self):
        opportunity = _opportunity(eligibility=[], requirements=[], skills=[])
        result = calculate_profile_fit(COMPLETE_PROFILE, opportunity)
        assert 0 <= result["score"] <= 100

    def test_cgpa_below_requirement_scores_lower_than_meeting_it(self):
        low_cgpa_profile = {**COMPLETE_PROFILE, "cgpa": 2.5}
        opportunity = _opportunity(eligibility=["Minimum CGPA: 3.0"])
        low = calculate_profile_fit(low_cgpa_profile, opportunity)
        high = calculate_profile_fit(COMPLETE_PROFILE, opportunity)
        assert low["breakdown"]["cgpaMatch"]["points"] < high["breakdown"]["cgpaMatch"]["points"]

    def test_no_matching_profile_fields_scores_low(self):
        empty_profile = {
            "cgpa": 0,
            "program": "",
            "skills": [],
            "interests": [],
            "preferredOpportunityTypes": [],
            "locationPreference": [],
            "pastExperience": [],
        }
        result = calculate_profile_fit(empty_profile, _opportunity())
        full_result = calculate_profile_fit(COMPLETE_PROFILE, _opportunity())
        assert result["score"] < full_result["score"]


class TestUrgency:
    def test_no_deadline_returns_baseline_score(self):
        result = calculate_urgency(None)
        assert result["score"] == 20
        assert result["daysRemaining"] is None

    def test_expired_deadline_scores_zero(self):
        result = calculate_urgency(_iso_days_from_now(-5))
        assert result["score"] == 0
        assert result["daysRemaining"] < 0

    def test_urgent_deadline_scores_highest(self):
        result = calculate_urgency(_iso_days_from_now(2))
        assert result["score"] == 100

    def test_distant_deadline_scores_low(self):
        result = calculate_urgency(_iso_days_from_now(60))
        assert result["score"] == 30

    def test_unparseable_deadline_is_treated_as_no_deadline(self):
        result = calculate_urgency("not a real date at all !!!")
        assert result["score"] == 20


class TestCompleteness:
    def test_fully_complete_opportunity_scores_100(self):
        result = calculate_completeness(_opportunity())
        assert result["score"] == 100
        assert result["missingFields"] == []

    def test_missing_fields_are_reported(self):
        opportunity = _opportunity(deadline=None, eligibility=[], applicationLink=None, contactEmail=None)
        result = calculate_completeness(opportunity)
        assert result["score"] < 100
        assert "deadline" in result["missingFields"]
        assert "applicationLink or contactEmail" in result["missingFields"]

    def test_score_bounds_are_respected(self):
        empty_opportunity = {}
        result = calculate_completeness(empty_opportunity)
        assert 0 <= result["score"] <= 100


class TestFinalScoreAndPriority:
    @pytest.mark.parametrize(
        "profile_fit,urgency,completeness,expected",
        [
            (100, 100, 100, 100),
            (0, 0, 0, 0),
            (95, 90, 100, 94),
        ],
    )
    def test_weighted_average(self, profile_fit, urgency, completeness, expected):
        assert calculate_final_score(profile_fit, urgency, completeness) == expected

    @pytest.mark.parametrize(
        "score,expected_priority",
        [
            (100, "CRITICAL"),
            (90, "CRITICAL"),
            (89, "HIGH"),
            (75, "HIGH"),
            (74, "MEDIUM"),
            (50, "MEDIUM"),
            (49, "LOW"),
            (0, "LOW"),
        ],
    )
    def test_priority_thresholds(self, score, expected_priority):
        assert priority_from_score(score) == expected_priority
