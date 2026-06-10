from sqlalchemy.orm import Session

from app.models.event_preset import EventPreset
from app.schemas.preset_schema import EventPresetCreate


def get_all_presets(db: Session):
    return db.query(EventPreset).order_by(EventPreset.id.asc()).all()


def create_preset(db: Session, preset_data: EventPresetCreate):
    preset = EventPreset(**preset_data.model_dump())

    db.add(preset)
    db.commit()
    db.refresh(preset)

    return preset


def seed_default_presets(db: Session):
    existing_preset = (
        db.query(EventPreset)
        .filter(EventPreset.key == "tesco_shift")
        .first()
    )

    if existing_preset:
        return

    default_preset = EventPreset(
        key="tesco_shift",
        label="Shift @ Tesco",
        default_title="Shift @ Tesco",
        default_start_time="15:00",
        default_end_time="23:00",
        default_reminder_minutes=30,
        default_color_id="9",
        color_label="Work",
    )

    db.add(default_preset)
    db.commit()