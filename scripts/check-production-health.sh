#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-${HEALTHCHECK_BASE_URL:-}}"

if [[ -z "${BASE_URL}" ]]; then
  echo "Usage: $0 <base_url>"
  echo "Example: $0 https://fy-repository.vercel.app"
  exit 2
fi

BASE_URL="${BASE_URL%/}"
PAGES=("/dashboard" "/jobs")

ERROR_PATTERNS=(
  "Invalid API key"
  "Supabase 配置缺失"
  "Invalid supabaseUrl"
  "请求失败"
)

for path in "${PAGES[@]}"; do
  url="${BASE_URL}${path}"
  echo "[healthcheck] checking ${url}"

  body_file="$(mktemp)"
  http_code="$(curl -sS -L -o "${body_file}" -w "%{http_code}" "${url}")"

  if [[ "${http_code}" -lt 200 || "${http_code}" -ge 400 ]]; then
    echo "[healthcheck] failed: ${url} returned HTTP ${http_code}"
    rm -f "${body_file}"
    exit 1
  fi

  for pattern in "${ERROR_PATTERNS[@]}"; do
    if rg -n "${pattern}" "${body_file}" >/dev/null 2>&1; then
      echo "[healthcheck] failed: found error marker '${pattern}' on ${url}"
      rm -f "${body_file}"
      exit 1
    fi
  done

  rm -f "${body_file}"
  echo "[healthcheck] ok: ${url}"
  echo
 done

echo "[healthcheck] all checks passed"
