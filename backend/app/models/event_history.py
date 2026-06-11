from sqlalchemy import Column, Integer, String

from app.db.database import Base


class EventHistory(Base):
    __tablename__ = "event_history"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    reminder_minutes = Column(Integer, default=30)
    color_id = Column(String, default="1")
    google_event_id = Column(String, nullable=True)
    html_link = Column(String, nullable=True)