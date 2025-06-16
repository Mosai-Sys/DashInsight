from fastapi import FastAPI, Depends
from pydantic import BaseModel
from typing import List
from backend.shared.models import Position, StaffingInput, PositionType, Recommendation
from backend.shared.security import get_current_user
from backend.shared.observability import setup_observability

app = FastAPI()
log = setup_observability(app, "simulation-service")

LAERERNORM = 1 / 16  # minimum teacher FTE per student

class Violation(BaseModel):
    type: str  # 'hard' or 'soft'
    message: str

class SimulationResult(BaseModel):
    valid: bool
    violations: List[Violation]

def _sum_fte(positions: List[Position], pos_type: PositionType) -> float:
    return sum(p.fte for p in positions if p.type == pos_type)

def _total_cost(positions: List[Position]) -> float:
    return sum(p.fte * p.cost for p in positions)

@app.get("/health")
def health():
    log.info("healthcheck")
    return {"status": "ok"}

@app.post("/simulate", response_model=SimulationResult)
def simulate(data: StaffingInput, user: str = Depends(get_current_user)) -> SimulationResult:
    log.info("simulate_start", school_id=data.school_id)
    violations: List[Violation] = []

    teacher_fte = _sum_fte(data.positions, PositionType.TEACHER)
    special_fte = _sum_fte(data.positions, PositionType.SPECIAL_ED)
    cost = _total_cost(data.positions)

    if teacher_fte / data.students < LAERERNORM:
        ratio = teacher_fte / data.students
        ratio_display = f"1:{round(1/ratio, 1)}" if ratio else "inf"
        violations.append(Violation(type="hard", message=f"Lærernorm not met ({ratio_display})"))

    if special_fte < data.special_ed_students:
        violations.append(Violation(type="hard", message="Special ed staffing below student needs"))

    if cost > data.budget:
        diff = int(cost - data.budget)
        violations.append(Violation(type="soft", message=f"Budget exceeded by {diff} NOK"))

    valid = not any(v.type == "hard" for v in violations)
    log.info("simulate_complete", valid=valid)
    return SimulationResult(valid=valid, violations=violations)
