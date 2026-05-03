param(
    [string]$DatabaseUrl = "postgresql+psycopg://jobtracker:jobtracker@localhost:5432/jobtracker"
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

Start-Process powershell -WindowStyle Hidden -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    (Join-Path $root "scripts\start-backend.ps1"),
    "-DatabaseUrl",
    $DatabaseUrl
)

Start-Process powershell -WindowStyle Hidden -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    (Join-Path $root "scripts\start-frontend.ps1")
)

Write-Host "Backend:  http://localhost:8000/docs"
Write-Host "Frontend: http://localhost:3000"
