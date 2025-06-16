from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import pulp

app = FastAPI()


@app.get("/health")
async def health():
    return {"status": "ok"}

TEACHER_STUDENT_RATIO = 1 / 18  # minimum teachers per student
SPECIAL_ED_RATIO = 0.25  # FTE per special education student

class Position(BaseModel):
    type: str
    fte: float
    cost: float  # cost per FTE

class OptimizationInput(BaseModel):
    school_id: str
    budget: float
    students: int
    positions: List[Position]
    special_ed_students: int

class Recommendation(BaseModel):
    type: str
    new_fte: float

class OptimizationOutput(BaseModel):
    recommendations: List[Recommendation]
    total_cost: float


@app.post("/optimize", response_model=OptimizationOutput)
def optimize(data: OptimizationInput):
    prob = pulp.LpProblem("staff_optimization", pulp.LpMinimize)

    fte_vars: Dict[str, pulp.LpVariable] = {
        p.type: pulp.LpVariable(f"fte_{p.type}", lowBound=0)
        for p in data.positions
    }

    total_cost = pulp.lpSum([fte_vars[p.type] * p.cost for p in data.positions])
    deviation = pulp.LpVariable("deviation", lowBound=0)

    # Objective: minimize deviation from budget
    prob += deviation

    # Total cost must be below budget but allowed to be lower
    prob += total_cost <= data.budget
    prob += data.budget - total_cost <= deviation

    # Teacher/student ratio constraint
    teacher_var = fte_vars.get("Lærer")
    if teacher_var is None:
        teacher_var = fte_vars.get("Laerer")
    if teacher_var is None:
        teacher_var = fte_vars.get("teacher")
    if teacher_var is not None:
        prob += teacher_var >= TEACHER_STUDENT_RATIO * data.students
    else:
        raise HTTPException(status_code=400, detail="Teacher position missing")

    # Special education staffing constraint
    sp_var = fte_vars.get("Spesialpedagog")
    if sp_var is None:
        sp_var = fte_vars.get("special_ed")
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
