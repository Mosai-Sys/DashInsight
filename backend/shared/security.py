import os
import jwt
from fastapi import Header, HTTPException

def get_current_user(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")
    token = authorization.split()[1]
    secret = os.getenv("JWT_SECRET", "secret")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = payload.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user
