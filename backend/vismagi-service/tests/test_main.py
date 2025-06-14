from fastapi.testclient import TestClient
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from main import app

client = TestClient(app)


def has_chart(charts, chart_type):
    return any(c.get("type") == chart_type for c in charts)


def test_recommend_bar_chart():
    payload = {
        "columns": [
            {"name": "dept", "type": "categorical"},
            {"name": "score", "type": "numeric"}
        ]
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert has_chart(data, "bar")


def test_recommend_line_chart():
    payload = {
        "columns": [
            {"name": "date", "type": "temporal"},
            {"name": "value", "type": "numeric"}
        ]
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert has_chart(data, "line")


def test_recommend_scatter_chart():
    payload = {
        "columns": [
            {"name": "x", "type": "numeric"},
            {"name": "y", "type": "numeric"}
        ]
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert has_chart(data, "scatter")


def test_recommend_heatmap():
    payload = {
        "columns": [
            {"name": "region", "type": "geo"},
            {"name": "value", "type": "numeric"}
        ]
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert has_chart(data, "heatmap")


def test_recommend_treemap():
    payload = {
        "columns": [
            {"name": "a", "type": "categorical"},
            {"name": "b", "type": "categorical"},
            {"name": "c", "type": "categorical"}
        ]
    }
    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert has_chart(data, "treemap")
