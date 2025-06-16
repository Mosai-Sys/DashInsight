import os
import io
import importlib.util
from fastapi.testclient import TestClient
import pandas as pd

module_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'main.py')
spec = importlib.util.spec_from_file_location('prof_main', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
app = module.app

client = TestClient(app)

def test_health():
    resp = client.get('/health')
    assert resp.status_code == 200
    assert resp.json()['status'] == 'ok'

def test_upload():
    df = pd.DataFrame({'a':[1,2], 'b':[3,4]})
    buf = io.BytesIO()
    df.to_excel(buf, index=False)
    buf.seek(0)
    files = {'file': ('test.xlsx', buf, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
    resp = client.post('/upload', files=files)
    assert resp.status_code == 200
    data = resp.json()
    assert data['metadata']['rows'] == 2
