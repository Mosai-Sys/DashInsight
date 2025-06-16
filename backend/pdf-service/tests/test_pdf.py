import os
import importlib.util
from fastapi.testclient import TestClient

module_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'main.py')
spec = importlib.util.spec_from_file_location('pdf_main', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
app = module.app

client = TestClient(app)

def test_health():
    resp = client.get('/health')
    assert resp.status_code == 200
    assert resp.json()['status'] == 'ok'

def test_generate_pdf():
    payload = {'html': '<html><body><h1>Hi</h1></body></html>'}
    resp = client.post('/generate-pdf', json=payload)
    assert resp.status_code == 200
    assert resp.headers['content-type'] == 'application/pdf'
