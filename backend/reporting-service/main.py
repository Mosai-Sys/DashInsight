from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List
import httpx
from backend.shared.models import Position, StaffingInput
from backend.shared.security import get_current_user
from backend.shared.observability import setup_observability

app = FastAPI()
log = setup_observability(app, "reporting-service")

class ReportRequest(BaseModel):
    school_id: str
    budget: float
    students: int
    special_ed_students: int
    positions: List[Position]

@app.get("/health")
def health():
    log.info("healthcheck")
    return {"status": "ok"}

@app.post("/reports/generate")
async def generate_report(req: ReportRequest, user: str = Depends(get_current_user)):
    log.info("generate_report", school_id=req.school_id)
    opt_input = StaffingInput(
        school_id=req.school_id,
        budget=req.budget,
        students=req.students,
        positions=req.positions,
        special_ed_students=req.special_ed_students,
    )
    async with httpx.AsyncClient() as client:
        try:
            opt_res = await client.post(
                "http://optimization-service:8000/optimize",
                json=opt_input.model_dump(),
                headers={"Authorization": f"Bearer {user}"},
            )
            opt_res.raise_for_status()
        except httpx.HTTPError as e:
            log.info("optimization_failed", error=str(e))
            raise HTTPException(status_code=502, detail="optimization failed")
        opt_data = opt_res.json()

        meta = {
            "columns": [
                {"name": "position", "type": "categorical"},
                {"name": "fte", "type": "numeric"},
            ]
        }
        try:
            vis_res = await client.post("http://vismagi-service:8000/recommend", json=meta)
            vis_res.raise_for_status()
            chart = vis_res.json()[0]
        except Exception as e:
            log.info("vismagi_failed", error=str(e))
            chart = {"type": "bar"}

        rows = "".join(
            f"<tr><td>{r['type']}</td><td>{r['new_fte']}</td></tr>" for r in opt_data.get("recommendations", [])
        )
        html = f"""
        <html><body>
        <h1>Recommendations</h1>
        <table border='1'><tr><th>Position</th><th>New FTE</th></tr>{rows}</table>
        <h2>Suggested chart: {chart.get('type')}</h2>
        </body></html>
        """
        try:
            pdf_res = await client.post(
                "http://pdf-service:8000/generate-pdf",
                json={"html": html},
                headers={"Authorization": f"Bearer {user}"},
            )
            pdf_res.raise_for_status()
        except httpx.HTTPError as e:
            log.info("pdf_failed", error=str(e))
            raise HTTPException(status_code=502, detail="pdf generation failed")

    return Response(content=pdf_res.content, media_type="application/pdf")
