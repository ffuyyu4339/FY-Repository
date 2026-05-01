param(
    [string]$ApiBaseUrl = "http://localhost:8000",
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"
$frontendDir = Join-Path (Split-Path $PSScriptRoot -Parent) "frontend"

Push-Location $frontendDir
try {
    if (-not (Test-Path "node_modules")) {
        npm install
    }

    $env:NEXT_PUBLIC_API_BASE_URL = $ApiBaseUrl
    $env:PORT = "$Port"
    npm run dev
} finally {
    Pop-Location
}
