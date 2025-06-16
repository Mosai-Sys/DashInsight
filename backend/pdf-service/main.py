from fastapi import FastAPI, HTTPException, Response, Depends
from pydantic import BaseModel
from xhtml2pdf import pisa
from io import BytesIO
from backend.shared.security import get_current_user
from backend.shared.observability import setup_observability

app = FastAPI()
log = setup_observability(app, "pdf-service")

class HtmlPayload(BaseModel):
    html: str

@app.get("/health")
def health():
    log.info("healthcheck")
    return {"status": "ok"}

@app.post("/generate-pdf")
async def generate_pdf(data: HtmlPayload, user: str = Depends(get_current_user)):
    if not data.html:
        log.info("missing_html")
        raise HTTPException(status_code=400, detail="Missing html")
    result = BytesIO()
    if pisa.CreatePDF(data.html, dest=result).err:
        log.info("pdf_error")
        raise HTTPException(status_code=500, detail="Failed to generate PDF")
    log.info("pdf_generated")
    return Response(content=result.getvalue(), media_type="application/pdf")
