# README.md

[Instruksjoner for utviklere og testere]

## Exporting AI reports

1. Generate a report with the **Generate** button in the AI analysis view.
2. Click **Export to PDF** to send the report HTML to the backend.
3. When the backend responds, the PDF file will be downloaded automatically and the status will show `Download ready`.

Ensure the GraphQL gateway and pdf-service are running so the `generateReport` mutation is available.

## Dashboard

The main dashboard fetches data from the GraphQL API and shows KPIs and recommended charts. Below is a placeholder for a future screenshot.

![Dashboard screenshot](docs/dashboard-screenshot.png)

## Multi-tenant dashboard

Use the school selector in the header to switch between different schools. The selector fetches schools with the `allSchools` query and loads the selected school's data with `school(id)`.
