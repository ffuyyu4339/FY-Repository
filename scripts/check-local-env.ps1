$ErrorActionPreference = "Continue"

function Test-Tool {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if ($command) {
        Write-Host "[OK] $Name -> $($command.Source)"
        return $true
    }

    Write-Host "[MISS] $Name"
    return $false
}

function Find-PostgresTool {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }

    $matches = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "$Name.exe" -ErrorAction SilentlyContinue |
        Sort-Object @{ Expression = { $_.FullName -like "*\pgAdmin 4\*" } }, FullName
    if ($matches) {
        return $matches[0].FullName
    }

    return $null
}

$ok = $true
$ok = (Test-Tool "node") -and $ok
$ok = (Test-Tool "npm") -and $ok
$ok = (Test-Tool "python") -and $ok

$psql = Find-PostgresTool "psql"
if ($psql) {
    Write-Host "[OK] psql -> $psql"
} else {
    Write-Host "[MISS] psql"
    $ok = $false
}

$postgresServices = Get-Service | Where-Object {
    $_.Name -like "*postgres*" -or $_.DisplayName -like "*postgres*"
}

if ($postgresServices) {
    $postgresServices | Select-Object Name, DisplayName, Status, StartType | Format-Table -AutoSize
} else {
    Write-Host "[MISS] PostgreSQL Windows service"
    $ok = $false
}

$ports = @(3000, 8000, 5432)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "[INFO] Port $port is in use"
        $connections | Select-Object LocalAddress, LocalPort, State, OwningProcess | Format-Table -AutoSize
    } else {
        Write-Host "[INFO] Port $port is free"
    }
}

if (-not $ok) {
    Write-Host ""
    Write-Host "Local environment is not ready. Install PostgreSQL first, then run scripts/init-local-postgres.ps1."
    exit 1
}

Write-Host ""
Write-Host "Local environment looks ready."
