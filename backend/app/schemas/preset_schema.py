from pydantic import BaseModel


class EventPresetBase(BaseModel):
    key: str
    label: str
    default_title: str
    default_start_time: str
    default_end_time: str
    default_reminder_minutes: int = 30
    default_color_id: str = "9"
    color_label: str = "Work"


class EventPresetCreate(EventPresetBase):
    pass


class EventPresetResponse(EventPresetBase):
    id: int

    class Config:
        from_attributes = True