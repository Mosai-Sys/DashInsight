from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

LAERERNORM = 1 / 16  # minimum teacher FTE per student

class Position(BaseModel):
    type: str
    fte: float
    cost: float

class SimulationInput(BaseModel):
    school_id: str
    budget: float
    students: int
    positions: List[Position]
    special_ed_students: int

class Violation(BaseModel):
    type: str  # 'hard' or 'soft'
    message: str

class SimulationResult(BaseModel):
    valid: bool
    violations: List[Violation]


def _sum_fte(positions: List[Position], names: List[str]) -> float:
    return sum(p.fte for p in positions if p.type.lower() in names)


def _total_cost(positions: List[Position]) -> float:
    return sum(p.fte * p.cost for p in positions)


@app.post("/simulate", response_model=SimulationResult)
def simulate(data: SimulationInput) -> SimulationResult:
    violations: List[Violation] = []

    teacher_fte = _sum_fte(data.positions, ["lærer", "laerer", "teacher"])
    special_fte = _sum_fte(data.positions, ["spesialpedagog", "specialpedagog", "special_ed"])
    cost = _total_cost(data.positions)

    # Hard constraints
    if teacher_fte / data.students < LAERERNORM:
        ratio = teacher_fte / data.students
        ratio_display = f"1:{round(1/ratio, 1)}" if ratio else "inf"
        violations.append(Violation(type="hard", message=f"Lærernorm not met ({ratio_display})"))

    if special_fte < data.special_ed_students:
        violations.append(Violation(type="hard", message="Special ed staffing below student needs"))

    # Soft constraint
    if cost > data.budget:
        diff = int(cost - data.budget)
        violations.append(Violation(type="soft", message=f"Budget exceeded by {diff} NOK"))

    valid = not any(v.type == "hard" for v in violations)
    return SimulationResult(valid=valid, violations=violations)
