from pydantic import BaseModel, Field, validator
from enum import Enum
from typing import List

class PositionType(str, Enum):
    TEACHER = "teacher"
    SPECIAL_ED = "special_ed"

POSITION_ALIASES = {
    "lærer": PositionType.TEACHER,
    "laerer": PositionType.TEACHER,
    "teacher": PositionType.TEACHER,
    "spesialpedagog": PositionType.SPECIAL_ED,
    "specialpedagog": PositionType.SPECIAL_ED,
    "special_ed": PositionType.SPECIAL_ED,
}

def normalize_position_type(value: str) -> PositionType:
    key = value.lower()
    if key in POSITION_ALIASES:
        return POSITION_ALIASES[key]
    raise ValueError(f"Unknown position type '{value}'")

class Position(BaseModel):
    type: PositionType
    fte: float = Field(gt=0)
    cost: float = Field(gt=0, description="Cost per FTE")

    @validator("type", pre=True)
    def _normalize_type(cls, v):
        return normalize_position_type(v)

class Recommendation(BaseModel):
    type: PositionType
    new_fte: float

class StaffingInput(BaseModel):
    school_id: str
    budget: float = Field(gt=0)
    students: int = Field(gt=0)
    positions: List[Position]
    special_ed_students: int = Field(ge=0)
