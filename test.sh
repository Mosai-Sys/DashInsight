#!/bin/bash
set -euo pipefail

# Build and start services
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose up -d --build
  trap 'docker-compose down' EXIT

  # Wait for services to start
  sleep 5

  declare -A ports=( [auth-service]=8001 [profiling-service]=8002 [vismagi-service]=8003 [optimization-service]=8004 [simulation-service]=8005 [pdf-service]=8006 [gateway]=8000 )
  for svc in "${!ports[@]}"; do
    port=${ports[$svc]}
    echo "Testing $svc on port $port"
    curl -f "http://localhost:$port/health" && echo " OK"
  done
else
  echo "docker-compose not available; skipping container tests" >&2
fi

# Frontend install and build
cd frontend
npm install
npm run build
cd ..

# Run backend tests
pytest backend

