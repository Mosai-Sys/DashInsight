# PDF Service

A small microservice that converts HTML into PDF using Express and Playwright.

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

The service listens on port `8000` by default (change with the `PORT` environment variable).

## Environment variables

Create a `.env` file from `.env.example` and set `PORT` as needed.
When launching with `uvicorn` use `--env-file .env`.

## Endpoint

`POST /generate-pdf`

Body JSON:

```json
{
  "html": "<html><body><h1>Report</h1><p>Generated content here</p></body></html>"
}
```

The response is streamed with `Content-Type: application/pdf`.

### Example cURL

```bash
curl -X POST http://localhost:8000/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"html":"<html><body><h1>Report</h1><p>Generated content here</p></body></html>"}' \
  --output report.pdf
```
