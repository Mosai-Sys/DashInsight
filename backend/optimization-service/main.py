from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
import os
import pulp
from backend.shared.models import Position, StaffingInput, Recommendation, PositionType
from backend.shared.security import get_current_user
from backend.shared.observability import setup_observability

app = FastAPI()
log = setup_observability(app, "optimization-service")

TEACHER_STUDENT_RATIO = float(os.getenv("TEACHER_STUDENT_RATIO", 1 / 18))
SPECIAL_ED_RATIO = float(os.getenv("SPECIAL_ED_RATIO", 0.25))

class OptimizationOutput(BaseModel):
    recommendations: List[Recommendation]
    total_cost: float

@app.get("/health")
def health():
    log.info("healthcheck")
    return {"status": "ok"}

@app.post("/optimize", response_model=OptimizationOutput)
def optimize(data: StaffingInput, user: str = Depends(get_current_user)):
    log.info("optimize_start", school_id=data.school_id)
    prob = pulp.LpProblem("staff_optimization", pulp.LpMinimize)

    fte_vars: Dict[PositionType, pulp.LpVariable] = {
        p.type: pulp.LpVariable(f"fte_{p.type}", lowBound=0)
        for p in data.positions
    }

    total_cost = pulp.lpSum([fte_vars[p.type] * p.cost for p in data.positions])

    prob += total_cost
    prob += total_cost <= data.budget

    teacher_var = fte_vars.get(PositionType.TEACHER)
    if teacher_var is not None:
        prob += teacher_var >= TEACHER_STUDENT_RATIO * data.students
    else:
        raise HTTPException(status_code=400, detail="Teacher position missing")

    sp_var = fte_vars.get(PositionType.SPECIAL_ED)
    if sp_var is not None:
        prob += sp_var >= SPECIAL_ED_RATIO * data.special_ed_students
    else:
        raise HTTPException(status_code=400, detail="Spesialpedagog position missing")

    prob.solve(pulp.PULP_CBC_CMD(msg=False))

    if pulp.LpStatus[prob.status] != "Optimal":
        log.info("no_solution")
        raise HTTPException(status_code=400, detail="No feasible solution found")

    recommendations = []
    for p in data.positions:
        new_val = fte_vars[p.type].value()
        if new_val is None:
            raise HTTPException(status_code=500, detail="Solver error")
        if abs(new_val - p.fte) > 0.01:
            recommendations.append(Recommendation(type=p.type, new_fte=round(new_val, 2)))

    total = sum(fte_vars[p.type].value() * p.cost for p in data.positions)

    log.info("optimize_complete", recommendations=len(recommendations))
    return OptimizationOutput(recommendations=recommendations, total_cost=round(total, 2))
