#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_SCREEN="${BACKEND_SCREEN:-jobtracker-backend}"
FRONTEND_SCREEN="${FRONTEND_SCREEN:-jobtracker-frontend}"

DATABASE_URL="${DATABASE_URL:-postgresql+psycopg://jobtracker:jobtracker@localhost:5432/jobtracker}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_INTERNAL_URL="${BACKEND_INTERNAL_URL:-http://127.0.0.1:${BACKEND_PORT}}"

kill_port_owner() {
  local port="$1"
  local pids
  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Releasing port $port (pid: $pids)"
    kill $pids >/dev/null 2>&1 || true
    sleep 1
  fi
}

if ! command -v screen >/dev/null 2>&1; then
  echo "Missing dependency: screen"
  echo "Install with: brew install screen"
  exit 1
fi

if ! command -v pg_isready >/dev/null 2>&1; then
  echo "Missing dependency: pg_isready (PostgreSQL client)"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Missing dependency: npm"
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Missing dependency: python3"
  exit 1
fi

if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  echo "PostgreSQL is not ready on localhost:5432"
  echo "Start it first, for example: brew services start postgresql@16"
  exit 1
fi

if screen -list | rg -q "\.${BACKEND_SCREEN}[[:space:]]"; then
  screen -S "$BACKEND_SCREEN" -X quit || true
fi
if screen -list | rg -q "\.${FRONTEND_SCREEN}[[:space:]]"; then
  screen -S "$FRONTEND_SCREEN" -X quit || true
fi

kill_port_owner "$BACKEND_PORT"
kill_port_owner "$FRONTEND_PORT"

if [[ ! -x "$BACKEND_DIR/.venv/bin/python" ]]; then
  python3 -m venv "$BACKEND_DIR/.venv"
  "$BACKEND_DIR/.venv/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  (cd "$FRONTEND_DIR" && npm install)
fi

screen -dmS "$BACKEND_SCREEN" bash -lc "
  cd '$BACKEND_DIR'
  export DATABASE_URL='$DATABASE_URL'
  export FRONTEND_ORIGINS='http://localhost:${FRONTEND_PORT},http://127.0.0.1:${FRONTEND_PORT}'
  export FRONTEND_ORIGIN_REGEX='https://.*\\.app\\.github\\.dev$|https://.*\\.githubpreview\\.dev$'
  ./.venv/bin/python -m app.cli init-db
  ./.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port ${BACKEND_PORT} > /tmp/jobtracker-backend.screen.log 2>&1
"

screen -dmS "$FRONTEND_SCREEN" bash -lc "
  cd '$FRONTEND_DIR'
  export PORT='${FRONTEND_PORT}'
  export BACKEND_INTERNAL_URL='${BACKEND_INTERNAL_URL}'
  export NEXT_PUBLIC_API_BASE_URL='http://localhost:${BACKEND_PORT}'
  npm run dev > /tmp/jobtracker-frontend.screen.log 2>&1
"

sleep 3

if ! curl -fsS "http://127.0.0.1:${BACKEND_PORT}/api/health" >/dev/null; then
  echo "Backend health check failed after startup."
  exit 1
fi

if ! lsof -iTCP:"${FRONTEND_PORT}" -sTCP:LISTEN -n -P >/dev/null 2>&1; then
  echo "Frontend did not bind to port ${FRONTEND_PORT}."
  exit 1
fi

echo "Backend:  http://127.0.0.1:${BACKEND_PORT}/docs"
echo "Frontend: http://127.0.0.1:${FRONTEND_PORT}"
echo "Logs:"
echo "  /tmp/jobtracker-backend.screen.log"
echo "  /tmp/jobtracker-frontend.screen.log"
