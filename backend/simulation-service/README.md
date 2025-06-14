# Simulation Service

This FastAPI microservice evaluates hypothetical staffing scenarios.
It checks each scenario against a set of constraints and reports any
violations.

## Endpoint

`POST /simulate`

### Example request
```json
{
  "school_id": "skole-001",
  "budget": 8200000,
  "students": 312,
  "positions": [
    { "type": "L\u00e6rer", "fte": 17.0, "cost": 720000 },
    { "type": "Assistent", "fte": 3.0, "cost": 480000 },
    { "type": "Spesialpedagog", "fte": 2.0, "cost": 900000 }
  ],
  "special_ed_students": 11
}
```

### Example response
```json
{
  "valid": false,
  "violations": [
    { "type": "hard", "message": "L\u00e6rernorm not met (1:18.4)" },
    { "type": "soft", "message": "Budget exceeded by 150000 NOK" }
  ]
}
```

## Validation Rules
* **Hard constraints**
  1. Teacher FTE divided by student count must be at least `1/16`.
  2. Special education FTE must be greater than or equal to the number of
     students with vedtak.
* **Soft constraint**
  * Total staffing cost should not exceed the provided `budget`. If it does,
    the service returns a soft warning but the scenario may still be marked as
    valid if no hard constraints are broken.
