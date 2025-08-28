![CI](https://github.com/example/repo/actions/workflows/ci.yml/badge.svg)

# README.md

[Instructions for developers and testers]

## Features

- Upload Excel files to generate profiling metadata
- Automatic chart recommendations
- AI-generated report with PDF export
- Light/dark theme toggle
- Mobile-friendly navigation between sections
- Compare KPIs across schools

## User guide (start to finish)

This guide walks you through using DashInsight step by step without technical knowledge.

1. **Install required tools**
   - Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop).
   - Install [Node.js](https://nodejs.org/).

2. **Download the program**
   - Go to the project's GitHub page, click **Code** → **Download ZIP**, and extract the folder.

3. **Prepare the environment**
   - Open a terminal or command window.
   - Navigate to the folder you extracted, for example:
     ```bash
     cd DashInsight
     ```
   - Copy the example configuration:
     ```bash
     cp .env.example .env
     ```

4. **Start the background services**
   - Run:
     ```bash
     docker-compose up --build
     ```
   - Wait until the terminal shows all services are ready.

5. **Start the user interface**
   - Open a new terminal window and run:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - The terminal displays a link, usually `http://localhost:5173`.

6. **Use DashInsight**
   - Open the link in your browser.
   - Upload an Excel file to get suggested charts and KPIs.
   - Open the AI analysis, click **Generate** to create a report, and **Export to PDF** to download it.
   - Explore menus such as **Compare schools** to compare multiple schools.

7. **Stop the program**
   - In the frontend terminal: press `Ctrl+C` to exit.
   - In the terminal with the background services: press `Ctrl+C` and run
     ```bash
     docker-compose down
     ```

## Exporting AI reports

1. Generate a report with the **Generate** button in the AI analysis view.
2. Click **Export to PDF** to send the report HTML to the backend.
3. When the backend responds, the PDF file will be downloaded automatically and the status will show `Download ready`.

Ensure the GraphQL gateway and pdf-service are running so the `generateReport` mutation is available.

## Dashboard

The main dashboard fetches data from the GraphQL API and shows KPIs and recommended charts. Below is a placeholder for a future screenshot.

![Dashboard screenshot](docs/dashboard-screenshot.png)

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
