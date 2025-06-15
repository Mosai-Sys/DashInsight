# Vismagi Service

This microservice recommends chart configurations based on dataset metadata. It
expects a JSON object describing each column with a semantic `type` such as
`numeric`, `categorical`, `temporal`, or `geo`.

## Endpoint

`POST /recommend`

### Example request
```json
{
  "columns": [
    {"name": "department", "type": "categorical"},
    {"name": "score", "type": "numeric"},
    {"name": "date", "type": "temporal"}
  ]
}
```

## Recommendation Rules
1. One temporal column and one numeric column → **line chart**
2. One categorical column and one numeric column → **bar chart**
3. Two numeric columns → **scatter plot**
4. One geo column and one numeric column → **heatmap**
5. More than two categorical columns → **treemap**

### Example response
```json
[
  {
    "type": "bar",
    "xAxis": "department",
    "yAxis": "score",
    "title": "score by department"
  }
]
```

## Environment variables

Create a `.env` file based on `.env.example` and adjust `PORT` as needed.
Start the service with:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --env-file .env
```
