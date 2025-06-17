#!/bin/bash
set -euo pipefail

# start services
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose up -d --build
  trap 'docker-compose down' EXIT

  ports=(8001 8002 8003 8004 8005 8006 8000)
  for p in "${ports[@]}"; do
    until curl -s "http://localhost:$p/health" >/dev/null; do
      echo "Waiting for port $p"; sleep 2;
    done
    echo "Service on $p OK"
  done

  curl -s -X POST http://localhost:8000/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ health }"}'
else
  echo "docker-compose not available" >&2
fi

# frontend
cd frontend
npm install
npm ls onnxruntime-web >/dev/null
npm run build
PORT=5173 npm run dev >/tmp/vite.log 2>&1 &
VITE_PID=$!
sleep 5
kill $VITE_PID || true
cd ..

# install python dependencies for tests
for req in backend/*/requirements.txt; do
  pip install -r "$req" >/dev/null
done
pip install httpx >/dev/null
pip install python-multipart >/dev/null

pytest backend

echo "All tests completed"
