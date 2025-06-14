# Test Scenarios

This document summarizes manual and automated testing of the dashboard.

| Module | Scenario | Expected Output | Result |
|-------|----------|----------------|-------|
| Backend startup | `docker-compose up` | All services start | **FAIL** – `docker-compose` not available |
| Frontend startup | `npm run dev` | Dev server runs on port 5173 | **FAIL** – missing Tailwind dependency |
| Excel upload | `POST /upload` with Excel file | Returns metadata JSON | Not tested |
| Chart recommendations | `POST /recommend` with metadata | Returns list of chart configs | **PASS** – covered by pytest |
| AI report export | `generateReport` mutation | Downloads PDF | Not tested |
| Theme switch | Toggle theme button | UI switches between light and dark | Not tested |
| Navigation | Router links across sections | Views load on mobile/desktop | Not tested |
| KPI comparison | `compareSchools` query | Table of KPIs for selected schools | Not tested |
| GraphQL API | `mySchool`, `compareSchools`, `generateReport`, `proposeStaffingChanges` | Valid schema and responses | Not tested |

Automated tests were executed with `pytest` for the vismagi-service and all passed.
