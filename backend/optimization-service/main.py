from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
import pulp
from backend.shared.models import Position, StaffingInput, Recommendation, PositionType
from backend.shared.security import get_current_user

app = FastAPI()

TEACHER_STUDENT_RATIO = 1 / 18  # minimum teachers per student
SPECIAL_ED_RATIO = 0.25  # FTE per special education student

class OptimizationOutput(BaseModel):
    recommendations: List[Recommendation]
    total_cost: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/optimize", response_model=OptimizationOutput)
def optimize(data: StaffingInput, user: str = Depends(get_current_user)):
    prob = pulp.LpProblem("staff_optimization", pulp.LpMinimize)

    fte_vars: Dict[PositionType, pulp.LpVariable] = {
        p.type: pulp.LpVariable(f"fte_{p.type}", lowBound=0)
        for p in data.positions
    }

    total_cost = pulp.lpSum([fte_vars[p.type] * p.cost for p in data.positions])
    deviation = pulp.LpVariable("deviation", lowBound=0)

    prob += deviation
    prob += total_cost <= data.budget
    prob += data.budget - total_cost <= deviation

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
        raise HTTPException(status_code=400, detail="No feasible solution found")

    recommendations = []
    for p in data.positions:
        new_val = fte_vars[p.type].value()
        if new_val is None:
            raise HTTPException(status_code=500, detail="Solver error")
        if abs(new_val - p.fte) > 0.01:
            recommendations.append(Recommendation(type=p.type, new_fte=round(new_val, 2)))

    total = sum(fte_vars[p.type].value() * p.cost for p in data.positions)

    return OptimizationOutput(recommendations=recommendations, total_cost=round(total, 2))
