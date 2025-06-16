#!/bin/bash
set -euo pipefail

./env-check.sh

if command -v lsof >/dev/null 2>&1; then
  ports=(8000 8001 8002 8003 8004 8005 8006 5173)
  for p in "${ports[@]}"; do
    if lsof -i :$p | grep LISTEN >/dev/null 2>&1; then
      echo "Port $p already in use" >&2
      exit 1
    fi
  done
else
  echo "lsof not available; skipping port checks" >&2
fi

cd frontend
npm run build >/dev/null
cd ..

echo "Build check passed"
