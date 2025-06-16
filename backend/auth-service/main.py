from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import os
import jwt
from passlib.context import CryptContext
from backend.shared.security import get_current_user

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory users; in production use a database
USERS = {
    "user": pwd_context.hash("pass"),
}

class LoginInput(BaseModel):
    username: str
    password: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/login")
def login(data: LoginInput):
    secret = os.getenv("JWT_SECRET", "secret")
    hashed = USERS.get(data.username)
    if not hashed or not pwd_context.verify(data.password, hashed):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"user": data.username}, secret, algorithm="HS256")
    return {"token": token}

@app.get("/me")
def me(user: str = Depends(get_current_user)):
    return {"user": user}
