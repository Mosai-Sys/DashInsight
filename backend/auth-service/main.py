from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import os
import jwt
from passlib.context import CryptContext
from backend.shared.security import get_current_user
from backend.shared.observability import setup_observability

app = FastAPI()
log = setup_observability(app, "auth-service")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory users; for real deployments use a proper database
DEFAULT_USER = os.getenv("DEFAULT_USER", "user")
DEFAULT_PASS = os.getenv("DEFAULT_PASS", "pass")
USERS = {
    DEFAULT_USER: pwd_context.hash(DEFAULT_PASS),
}

class LoginInput(BaseModel):
    username: str
    password: str

@app.get("/health")
def health():
    log.info("healthcheck")
    return {"status": "ok"}

@app.post("/login")
def login(data: LoginInput):
    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="JWT secret not configured")
    hashed = USERS.get(data.username)
    if not hashed or not pwd_context.verify(data.password, hashed):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"user": data.username}, secret, algorithm="HS256")
    log.info("login_success", user=data.username)
    return {"token": token}

@app.get("/me")
def me(user: str = Depends(get_current_user)):
    log.info("current_user", user=user)
    return {"user": user}
