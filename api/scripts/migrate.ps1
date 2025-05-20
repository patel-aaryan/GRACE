param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

# Change to project root directory where alembic.ini is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = (Get-Item $scriptDir).Parent.FullName
Set-Location $projectRoot

Write-Host "Generating migration: $Message" -ForegroundColor Cyan

# Generate the migration
Write-Host "`nStep 1: Creating migration script..." -ForegroundColor Yellow
alembic revision --autogenerate -m "$Message"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nError generating migration!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Apply the migration
Write-Host "`nStep 2: Applying migration to database..." -ForegroundColor Yellow
alembic upgrade head

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nError applying migration!" -ForegroundColor Red
    exit $LASTEXITCODE
}

# Show current migration status
Write-Host "`nMigration Status:" -ForegroundColor Green
alembic current

Write-Host "`nMigration complete!" -ForegroundColor Cyan 