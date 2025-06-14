# Vismagi Service

This FastAPI microservice suggests basic chart types based on dataset metadata.
It expects a list of column descriptions with a simple `type` indicator. The
supported types are `numeric`, `categorical`, and `datetime`.

## Endpoint

`POST /recommend`

Request body example:
```json
{
  "columns": [
    {"name": "Age", "type": "numeric"},
    {"name": "Gender", "type": "categorical"},
    {"name": "Date", "type": "datetime"}
  ]
}
```

The service applies these rules to generate recommendations:

1. Two or more numeric columns → include `scatter`.
2. One numeric and one categorical column → include `bar`.
3. One numeric and one datetime column → include `line`.
4. If none of the above rules match → return `table`.

Response example:
```json
{
  "charts": ["bar", "line", "scatter"]
}
```
