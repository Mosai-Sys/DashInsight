# README.md

[Instruksjoner for utviklere og testere]

## Exporting AI reports

1. Generate a report with the **Generate** button in the AI analysis view.
2. Click **Export to PDF** to send the report HTML to the backend.
3. When the backend responds, the PDF file will be downloaded automatically and the status will show `Download ready`.

Ensure the GraphQL gateway and pdf-service are running so the `generateReport` mutation is available.
