param(
    [string]$HostName = "localhost",
    [int]$Port = 5432,
    [string]$AdminUser = "postgres",
    [string]$AdminPassword = "",
    [string]$DatabaseName = "jobtracker",
    [string]$DatabaseUser = "jobtracker",
    [string]$DatabasePassword = "jobtracker"
)

$ErrorActionPreference = "Stop"

function Escape-SqlLiteral {
    param([string]$Value)
    return $Value.Replace("'", "''")
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

$psql = Find-PostgresTool "psql"
if (-not $psql) {
    throw "psql was not found. Install PostgreSQL and add its bin directory to PATH."
}

$createdb = Find-PostgresTool "createdb"
if (-not $createdb) {
    throw "createdb was not found. Install PostgreSQL and add its bin directory to PATH."
}

$escapedUser = Escape-SqlLiteral $DatabaseUser
$escapedPassword = Escape-SqlLiteral $DatabasePassword

function Invoke-CheckedNative {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,
        [string[]]$Arguments
    )

    $output = & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $FilePath $($Arguments -join ' ')"
    }
    return $output
}

$roleSql = @"
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$escapedUser') THEN
        CREATE ROLE "$DatabaseUser" LOGIN PASSWORD '$escapedPassword';
    ELSE
        ALTER ROLE "$DatabaseUser" WITH LOGIN PASSWORD '$escapedPassword';
    END IF;
END
`$`$;
"@

Write-Host "Ensuring PostgreSQL role '$DatabaseUser'..."
if ($AdminPassword) {
    $env:PGPASSWORD = $AdminPassword
}
Invoke-CheckedNative $psql @("-h", $HostName, "-p", "$Port", "-U", $AdminUser, "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-c", $roleSql)

$dbExists = Invoke-CheckedNative $psql @("-h", $HostName, "-p", "$Port", "-U", $AdminUser, "-d", "postgres", "-tAc", "SELECT 1 FROM pg_database WHERE datname = '$DatabaseName';")
if (($dbExists -join "").Trim() -ne "1") {
    Write-Host "Creating database '$DatabaseName'..."
    Invoke-CheckedNative $createdb @("-h", $HostName, "-p", "$Port", "-U", $AdminUser, "-O", $DatabaseUser, $DatabaseName)
} else {
    Write-Host "Database '$DatabaseName' already exists."
}

$schemaPath = Join-Path (Split-Path $PSScriptRoot -Parent) "db\init.sql"
Write-Host "Applying schema from $schemaPath..."
$env:PGPASSWORD = $DatabasePassword
Invoke-CheckedNative $psql @("-h", $HostName, "-p", "$Port", "-U", $DatabaseUser, "-d", $DatabaseName, "-v", "ON_ERROR_STOP=1", "-f", $schemaPath)
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

Write-Host "Local PostgreSQL is ready."
