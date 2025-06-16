import os
import importlib.util
from fastapi.testclient import TestClient

module_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'main.py')
spec = importlib.util.spec_from_file_location('gw_main', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
app = module.app

client = TestClient(app)

def test_health():
    resp = client.get('/health')
    assert resp.status_code == 200
    assert resp.json()['status'] == 'ok'

def test_services():
    resp = client.get('/services')
    assert resp.status_code == 200
    data = resp.json()
    assert 'services' in data and isinstance(data['services'], list)
