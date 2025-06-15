from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import jwt

app = FastAPI()

class LoginInput(BaseModel):
    username: str
    password: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/login")
async def login(data: LoginInput):
    secret = os.getenv("JWT_SECRET", "testsecret")
    if not data.username or not data.password:
        raise HTTPException(status_code=400, detail="Missing credentials")
    token = jwt.encode({"user": data.username}, secret, algorithm="HS256")
    return {"token": token}
