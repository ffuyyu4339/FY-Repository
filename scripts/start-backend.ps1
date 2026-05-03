param(
    [string]$DatabaseUrl = "postgresql+psycopg://jobtracker:jobtracker@localhost:5432/jobtracker",
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"
$backendDir = Join-Path (Split-Path $PSScriptRoot -Parent) "backend"
$venvPython = Join-Path $backendDir ".venv\Scripts\python.exe"

Push-Location $backendDir
try {
    if (-not (Test-Path $venvPython)) {
        python -m venv .venv
    }

    & $venvPython -m pip install -r requirements.txt

    $env:DATABASE_URL = $DatabaseUrl
    $env:FRONTEND_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"
    $env:FRONTEND_ORIGIN_REGEX = "https://.*\.app\.github\.dev$|https://.*\.githubpreview\.dev$"

    & $venvPython -m app.cli init-db
    & $venvPython -m uvicorn app.main:app --reload --host 0.0.0.0 --port $Port
} finally {
    Pop-Location
}
