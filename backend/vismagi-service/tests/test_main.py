from fastapi.testclient import TestClient
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from main import app

client = TestClient(app)

def test_recommend_bar_chart():
    payload = {
        "columns": [
            {"name": "Age", "type": "numeric"},
            {"name": "Gender", "type": "categorical"}
        ]
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "bar" in data["charts"]


def test_recommend_line_chart():
    payload = {
        "columns": [
            {"name": "Date", "type": "datetime"},
            {"name": "Value", "type": "numeric"}
        ]
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "line" in data["charts"]


def test_default_table():
    payload = {"columns": [{"name": "Name", "type": "categorical"}]}
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["charts"] == ["table"]
