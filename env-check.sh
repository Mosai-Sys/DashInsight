#!/bin/bash
set -euo pipefail

: "${JWT_SECRET:?JWT_SECRET is not set}"

echo "Environment variables OK"
