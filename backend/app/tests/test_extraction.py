import pytest
from pydantic import ValidationError

from app.services.checklist_service import generate_checklist
from app.services.extraction_service import ExtractedOpportunityData


class TestExtractedOpportunityData:
    def test_accepts_fully_populated_data(self):
        data = ExtractedOpportunityData(
            title="AI Research Internship",
            organization="ABC Labs",
            type="internship",
            deadline="2026-09-15",
            eligibility=["Undergraduate student"],
            requiredDocuments=["CV"],
            skills=["Python"],
            location="Remote",
            applicationLink="https://example.com",
            contactEmail="careers@example.com",
            requirements=[],
        )
        assert data.type == "Internship"  # normalized to canonical casing

    def test_all_fields_optional_and_default_safely(self):
        data = ExtractedOpportunityData()
        assert data.title is None
        assert data.deadline is None
        assert data.eligibility == []
        assert data.requiredDocuments == []

    def test_unknown_type_normalizes_to_other(self):
        data = ExtractedOpportunityData(type="Volunteering")
        assert data.type == "Other"

    def test_none_type_stays_none(self):
        data = ExtractedOpportunityData(type=None)
        assert data.type is None

    def test_blank_list_entries_are_stripped(self):
        data = ExtractedOpportunityData(skills=["Python", "  ", "", "React"])
        assert data.skills == ["Python", "React"]

    def test_never_hallucinates_missing_deadline(self):
        # Extraction must leave deadline as None rather than invent one.
        data = ExtractedOpportunityData(title="Some Opportunity")
        assert data.deadline is None

    def test_rejects_wrong_types(self):
        with pytest.raises(ValidationError):
            ExtractedOpportunityData(skills="Python")  # should be a list, not a string


class TestChecklistGeneration:
    def test_generates_items_for_required_documents(self):
        checklist = generate_checklist(
            {
                "requiredDocuments": ["CV", "Academic Transcript", "Motivation Letter"],
                "eligibility": ["Undergraduate student"],
                "deadline": "2026-09-15",
            }
        )
        titles = [item["title"] for item in checklist]
        assert "Prepare your CV" in titles
        assert "Prepare your academic transcript" in titles
        assert "Prepare your motivation letter" in titles
        assert "Review all eligibility requirements" in titles
        assert "Verify the application deadline" in titles
        assert "Submit the application" in titles

    def test_always_includes_submit_step(self):
        checklist = generate_checklist({})
        titles = [item["title"] for item in checklist]
        assert "Submit the application" in titles

    def test_no_duplicate_items(self):
        checklist = generate_checklist({"requiredDocuments": ["CV", "cv", "Cv"]})
        titles = [item["title"] for item in checklist]
        assert titles.count("Prepare your CV") == 1

    def test_all_items_start_incomplete(self):
        checklist = generate_checklist({"requiredDocuments": ["CV"], "deadline": "2026-09-15"})
        assert all(item["completed"] is False for item in checklist)
