from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel
from xhtml2pdf import pisa
from io import BytesIO

app = FastAPI()

class HtmlPayload(BaseModel):
    html: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/generate-pdf")
async def generate_pdf(data: HtmlPayload):
    if not data.html:
        raise HTTPException(status_code=400, detail="Missing html")
    result = BytesIO()
    if pisa.CreatePDF(data.html, dest=result).err:
        raise HTTPException(status_code=500, detail="Failed to generate PDF")
    return Response(content=result.getvalue(), media_type="application/pdf")
