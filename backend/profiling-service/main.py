from pathlib import Path

# Define base directory and file path
profiling_service_path = Path("/mnt/data/kommunalt-dashboard/backend/profiling-service")
profiling_service_path.mkdir(parents=True, exist_ok=True)
main_py_path = profiling_service_path / "main.py"

# Content for profiling-service main.py
main_py_code = """
from fastapi import FastAPI, UploadFile, File
import pandas as pd
import io

app = FastAPI()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_excel(io.BytesIO(contents))
    metadata = {
        "columns": list(df.columns),
        "rows": len(df),
        "summary": df.describe(include='all').to_dict()
    }
    return {"filename": file.filename, "metadata": metadata}
"""

# Write the file
main_py_path.write_text(main_py_code.strip(), encoding="utf-8")
main_py_path.name
