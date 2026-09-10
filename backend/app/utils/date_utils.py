from datetime import datetime, timezone

from dateutil import parser as date_parser


def parse_deadline(deadline: str | None) -> datetime | None:
    """Safely parse a deadline string into a timezone-aware UTC datetime.

    Returns None if the deadline is missing, empty, or unparseable — callers
    should treat that as "no deadline found" rather than raising.
    """
    if not deadline or not str(deadline).strip():
        return None
    try:
        parsed = date_parser.parse(str(deadline))
    except (ValueError, OverflowError):
        return None

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


def days_remaining(deadline: str | None, now: datetime | None = None) -> int | None:
    """Whole days between now and the deadline. Negative if the deadline has passed.

    Returns None when there is no usable deadline.
    """
    parsed = parse_deadline(deadline)
    if parsed is None:
        return None

    reference = now or datetime.now(timezone.utc)
    if reference.tzinfo is None:
        reference = reference.replace(tzinfo=timezone.utc)

    delta = parsed.date() - reference.date()
    return delta.days
