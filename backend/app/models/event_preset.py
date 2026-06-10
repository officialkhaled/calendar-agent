from sqlalchemy import Column, Integer, String

from app.db.database import Base


class EventPreset(Base):
    __tablename__ = "event_presets"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    label = Column(String, nullable=False)
    default_title = Column(String, nullable=False)
    default_start_time = Column(String, nullable=False)
    default_end_time = Column(String, nullable=False)
    default_reminder_minutes = Column(Integer, default=30)
    default_color_id = Column(String, default="9")
    color_label = Column(String, default="Work")