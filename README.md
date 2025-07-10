![CI](https://github.com/Mosai-Sys/DashInsight/actions/workflows/ci.yml/badge.svg)

# README.md

[Instruksjoner for utviklere og testere]

## Features

- Upload Excel files to generate profiling metadata
- Automatic chart recommendations
- AI-generated report with PDF export
- Light/dark theme toggle
- Mobile-friendly navigation between sections
- Compare KPIs across schools

## Exporting AI reports

1. Generate a report with the **Generate** button in the AI analysis view.
2. Click **Export to PDF** to send the report HTML to the backend.
3. When the backend responds, the PDF file will be downloaded automatically and the status will show `Download ready`.

Ensure the GraphQL gateway and pdf-service are running so the `generateReport` mutation is available.

## Dashboard

The main dashboard fetches data from the GraphQL API and shows KPIs and recommended charts.

Additional preview:

![Desktop screenshot](assets/screenshots/desktop.png)

## Multi-tenant dashboard

Use the school selector in the header to switch between different schools. The selector fetches schools with the `allSchools` query and loads the selected school's data with `school(id)`.

## Compare Schools

Navigate to **Compare schools** in the dashboard header to select multiple schools and view their KPIs side-by-side.

Example table:

| KPI name | School A | School B |
|----------|----------|----------|
| Cost/student | 92 000 | 107 000 |
| Trivsel | 4.3 | 3.7 |

## Mobile view

Below is a preview of the new mobile layout.

## Running locally

```bash
docker-compose up --build
cd frontend
npm install
npm run dev
```


## First time run

1. Copy `.env.example` to `.env` and adjust any secrets.
2. Build and start all services:
   ```bash
   docker-compose up --build
   ```
3. In another terminal start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Verify services:
   ```bash
  ./test.sh
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
