# Auth Service

This FastAPI microservice issues JWTs for authenticated users.

## Environment variables

Copy `.env.example` to `.env` and set `JWT_SECRET` and `PORT`. Start the service with:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --env-file .env
```
