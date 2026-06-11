from sqlalchemy.orm import Session

from app.models.event_history import EventHistory


def create_event_history(db: Session, event_data, created_event: dict):
    history = EventHistory(
        title=event_data.title,
        date=event_data.date,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
        reminder_minutes=event_data.reminder_minutes,
        color_id=str(event_data.color_id or "1"),
        google_event_id=created_event.get("id"),
        html_link=created_event.get("htmlLink"),
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


def get_recent_event_history(db: Session, limit: int = 10):
    return (
        db.query(EventHistory)
        .order_by(EventHistory.id.desc())
        .limit(limit)
        .all()
    )