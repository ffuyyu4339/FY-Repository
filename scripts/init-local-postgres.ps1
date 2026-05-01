param(
    [string]$HostName = "localhost",
    [int]$Port = 5432,
    [string]$AdminUser = "postgres",
    [string]$DatabaseName = "jobtracker",
    [string]$DatabaseUser = "jobtracker",
    [string]$DatabasePassword = "jobtracker"
)

$ErrorActionPreference = "Stop"

function Escape-SqlLiteral {
    param([string]$Value)
    return $Value.Replace("'", "''")
}

$psql = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psql) {
    throw "psql was not found. Install PostgreSQL and add its bin directory to PATH."
}

$createdb = Get-Command createdb -ErrorAction SilentlyContinue
if (-not $createdb) {
    throw "createdb was not found. Install PostgreSQL and add its bin directory to PATH."
}

$escapedUser = Escape-SqlLiteral $DatabaseUser
$escapedPassword = Escape-SqlLiteral $DatabasePassword

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
& psql -h $HostName -p $Port -U $AdminUser -d postgres -v ON_ERROR_STOP=1 -c $roleSql

$dbExists = & psql -h $HostName -p $Port -U $AdminUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DatabaseName';"
if ($dbExists.Trim() -ne "1") {
    Write-Host "Creating database '$DatabaseName'..."
    & createdb -h $HostName -p $Port -U $AdminUser -O $DatabaseUser $DatabaseName
} else {
    Write-Host "Database '$DatabaseName' already exists."
}

$schemaPath = Join-Path (Split-Path $PSScriptRoot -Parent) "db\init.sql"
Write-Host "Applying schema from $schemaPath..."
& psql -h $HostName -p $Port -U $DatabaseUser -d $DatabaseName -v ON_ERROR_STOP=1 -f $schemaPath

Write-Host "Local PostgreSQL is ready."
