from fastapi import FastAPI

app = FastAPI()

SERVICES = [
    "auth-service",
    "profiling-service",
    "vismagi-service",
    "optimization-service",
    "simulation-service",
    "pdf-service",
]

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/services")
async def list_services():
    return {"services": SERVICES}
