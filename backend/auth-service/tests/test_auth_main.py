import os
import importlib.util
from fastapi.testclient import TestClient

module_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "main.py")
spec = importlib.util.spec_from_file_location("auth_main", module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
app = module.app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_login():
    os.environ["JWT_SECRET"] = "secret"
    response = client.post("/login", json={"username": "user", "password": "pass"})
    assert response.status_code == 200
    assert "token" in response.json()
