# Optimization Service

This FastAPI microservice exposes an endpoint for generating a staffing proposal using linear programming. It relies on [PuLP](https://pythonhosted.org/PuLP/) to solve a simple LP that adjusts FTE counts while staying within a target budget.

## Endpoint

`POST /optimize`

The request payload must contain the current staffing situation and budget target.

### Example request
```json
{
  "school_id": "skole-001",
  "budget": 8200000,
  "students": 312,
  "positions": [
    { "type": "Lærer", "fte": 18.0, "cost": 720000 },
    { "type": "Assistent", "fte": 4.0, "cost": 480000 },
    { "type": "Spesialpedagog", "fte": 3.0, "cost": 900000 }
  ],
  "special_ed_students": 11
}
```

### Example response
```json
{
  "recommendations": [
    { "type": "Lærer", "new_fte": 17.5 },
    { "type": "Assistent", "new_fte": 3.0 }
  ],
  "total_cost": 7985000
}
```

## Model Logic
* **Objective** – minimize the deviation between total staffing cost and the provided `budget`.
* **Decision variables** – new FTE for each position type.
* **Constraints**
  1. Total cost must not exceed `budget`.
  2. Teacher FTE divided by student count must be at least `1/18`.
  3. Special education FTE must cover at least `0.25` FTE per student with vedtak.

The service solves the LP and returns only the positions whose FTE changed along with the resulting cost.
