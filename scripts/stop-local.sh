#!/usr/bin/env bash
set -euo pipefail

BACKEND_SCREEN="${BACKEND_SCREEN:-jobtracker-backend}"
FRONTEND_SCREEN="${FRONTEND_SCREEN:-jobtracker-frontend}"

if ! command -v screen >/dev/null 2>&1; then
  echo "Missing dependency: screen"
  exit 1
fi

if screen -list | rg -q "\.${BACKEND_SCREEN}[[:space:]]"; then
  screen -S "$BACKEND_SCREEN" -X quit || true
fi
if screen -list | rg -q "\.${FRONTEND_SCREEN}[[:space:]]"; then
  screen -S "$FRONTEND_SCREEN" -X quit || true
fi

echo "Stopped screens: $BACKEND_SCREEN, $FRONTEND_SCREEN"
