import os
import importlib.util
import sys
from fastapi.testclient import TestClient

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.append(ROOT)
module_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "main.py")
spec = importlib.util.spec_from_file_location("auth_main", module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
app = module.app

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_login_success():
    os.environ["JWT_SECRET"] = "secret"
    resp = client.post("/login", json={"username": "user", "password": "pass"})
    assert resp.status_code == 200
    assert "token" in resp.json()


def test_login_wrong_password():
    os.environ["JWT_SECRET"] = "secret"
    resp = client.post("/login", json={"username": "user", "password": "wrong"})
    assert resp.status_code == 401


def test_me_requires_token():
    os.environ["JWT_SECRET"] = "secret"
    resp = client.get("/me")
    assert resp.status_code == 401
    token = client.post("/login", json={"username": "user", "password": "pass"}).json()["token"]
    resp2 = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert resp2.status_code == 200
    assert resp2.json()["user"] == "user"
