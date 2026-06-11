from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.preset_schema import EventPresetCreate, EventPresetResponse
from app.services.preset_service import (
    create_preset,
    delete_preset,
    get_all_presets,
)

router = APIRouter()


@router.get("/presets", response_model=List[EventPresetResponse])
def list_presets(db: Session = Depends(get_db)):
    return get_all_presets(db)


@router.post("/presets", response_model=EventPresetResponse)
def add_preset(
    request: EventPresetCreate,
    db: Session = Depends(get_db),
):
    return create_preset(db, request)


@router.delete("/presets/{preset_id}")
def remove_preset(
    preset_id: int,
    db: Session = Depends(get_db),
):
    return delete_preset(db, preset_id)