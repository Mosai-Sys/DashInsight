from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
import pandas as pd
import io
from backend.shared.security import get_current_user
from backend.shared.observability import setup_observability

app = FastAPI()
log = setup_observability(app, "profiling-service")

@app.get("/health")
def health():
    log.info("healthcheck")
    return {"status": "ok"}

@app.get("/profile/{item_id}")
def profile(item_id: str):
    log.info("profile", item_id=item_id)
    return {"profile": item_id}

@app.post("/upload")
async def upload(file: UploadFile = File(...), user: str = Depends(get_current_user)):
    """Receive an Excel file and return basic profiling metadata."""
    try:
        contents = await file.read()
        if len(contents) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large")
        dataframe = pd.read_excel(io.BytesIO(contents))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Excel file")

    metadata = {
        "columns": dataframe.columns.tolist(),
        "rows": len(dataframe),
        "summary": dataframe.describe(include="all").fillna(0).to_dict(),
    }
    log.info("file_uploaded", filename=file.filename)
    return {"filename": file.filename, "metadata": metadata}
