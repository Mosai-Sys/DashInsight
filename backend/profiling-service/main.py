from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
import io

app = FastAPI()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/profile/{item_id}")
async def profile(item_id: str):
    return {"profile": item_id}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    """Receive an Excel file and return basic profiling metadata."""
    try:
        contents = await file.read()
        dataframe = pd.read_excel(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Excel file")

    metadata = {
        "columns": dataframe.columns.tolist(),
        "rows": len(dataframe),
        "summary": dataframe.describe(include="all").fillna(0).to_dict(),
    }
    return {"filename": file.filename, "metadata": metadata}
