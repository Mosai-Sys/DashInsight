import os
import importlib.util
from fastapi.testclient import TestClient

module_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'main.py')
spec = importlib.util.spec_from_file_location('opt_main', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
app = module.app

client = TestClient(app)


def test_health():
    resp = client.get('/health')
    assert resp.status_code == 200
    assert resp.json()['status'] == 'ok'


def test_optimize():
    payload = {
        "school_id": "1",
        "budget": 800000,
        "students": 180,
        "positions": [
            {"type": "Lærer", "fte": 10, "cost": 50000},
            {"type": "Spesialpedagog", "fte": 2, "cost": 55000}
        ],
        "special_ed_students": 4
    }
    resp = client.post('/optimize', json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert 'total_cost' in data
