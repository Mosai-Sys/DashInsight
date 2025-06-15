# Profiling Service

This FastAPI microservice exposes a single endpoint for uploading Excel files.
It returns the column names, number of rows, and descriptive statistics for the
uploaded dataset.

## Endpoint

`POST /upload`

Body: multipart form with a field named `file` containing an Excel file.

Response example:
```json
{
  "filename": "example.xlsx",
  "metadata": {
    "columns": ["A", "B"],
    "rows": 100,
    "summary": { ... }
  }
}
```

## Environment variables

Copy `.env.example` to `.env` and set `PORT` if you need a custom port.
Run the service with:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --env-file .env
```
