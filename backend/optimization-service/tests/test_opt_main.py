import os
import importlib.util
import sys
import jwt
from fastapi.testclient import TestClient

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.append(ROOT)
module_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'main.py')
spec = importlib.util.spec_from_file_location('opt_main', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
app = module.app

client = TestClient(app)


def _auth_header():
    token = jwt.encode({'user': 'user'}, 'secret', algorithm='HS256')
    return {'Authorization': f'Bearer {token}'}


def test_health():
    resp = client.get('/health')
    assert resp.status_code == 200
    assert resp.json()['status'] == 'ok'


def test_optimize_requires_auth():
    payload = {
        'school_id': '1',
        'budget': 800000,
        'students': 180,
        'positions': [
            {'type': 'Lærer', 'fte': 10, 'cost': 50000},
            {'type': 'Spesialpedagog', 'fte': 2, 'cost': 55000}
        ],
        'special_ed_students': 4
    }
    resp = client.post('/optimize', json=payload)
    assert resp.status_code == 401
    resp = client.post('/optimize', json=payload, headers=_auth_header())
    assert resp.status_code == 200


def test_optimize_infeasible():
    payload = {
        'school_id': '1',
        'budget': 10000,
        'students': 500,
        'positions': [
            {'type': 'teacher', 'fte': 1, 'cost': 50000},
            {'type': 'special_ed', 'fte': 0.1, 'cost': 55000}
        ],
        'special_ed_students': 300
    }
    resp = client.post('/optimize', json=payload, headers=_auth_header())
    assert resp.status_code == 400
