# Database Setup Script for Local PostgreSQL
# This script creates the chatbot_db2 database and sets up all required tables

param(
    [string]$PostgresUser = "postgres",
    [string]$PostgresPassword = "postgres",
    [string]$DatabaseName = "chatbot_db2",
    [string]$DbHost = "localhost",
    [int]$Port = 5432
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Chatbot Database Setup (chatbot_db2)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set PGPASSWORD environment variable for this session
$env:PGPASSWORD = $PostgresPassword

Write-Host "[INFO] Configuration:" -ForegroundColor Yellow
Write-Host "   Host:     $DbHost" -ForegroundColor Gray
Write-Host "   Port:     $Port" -ForegroundColor Gray
Write-Host "   User:     $PostgresUser" -ForegroundColor Gray
Write-Host "   Database: $DatabaseName" -ForegroundColor Gray
Write-Host ""

# Check if psql is available
Write-Host "[INFO] Checking PostgreSQL client (psql)..." -ForegroundColor Yellow
$psqlExists = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlExists) {
    Write-Host "[ERROR] psql command not found!" -ForegroundColor Red
    Write-Host "   Please ensure PostgreSQL is installed and psql is in your PATH." -ForegroundColor Red
    Write-Host "   Common location: C:\Program Files\PostgreSQL\<version>\bin" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] psql found" -ForegroundColor Green
Write-Host ""

# Test connection to PostgreSQL
Write-Host "[INFO] Testing connection to PostgreSQL..." -ForegroundColor Yellow
$testConnection = psql -h $DbHost -p $Port -U $PostgresUser -d postgres -c "SELECT 1;" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Cannot connect to PostgreSQL!" -ForegroundColor Red
    Write-Host "   Please check:" -ForegroundColor Red
    Write-Host "   - PostgreSQL service is running" -ForegroundColor Yellow
    Write-Host "   - Username and password are correct" -ForegroundColor Yellow
    Write-Host "   - Host and port are correct" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Connected successfully" -ForegroundColor Green
Write-Host ""

# Create database if it doesn't exist
Write-Host "[INFO] Checking if database exists..." -ForegroundColor Yellow
$dbExists = psql -h $DbHost -p $Port -U $PostgresUser -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DatabaseName';" 2>&1
if ($dbExists -eq "1") {
    Write-Host "[WARNING] Database '$DatabaseName' already exists" -ForegroundColor Yellow
    $response = Read-Host "   Do you want to recreate it? This will DELETE all existing data! (yes/no)"
    if ($response -eq "yes") {
        Write-Host "[INFO] Dropping existing database..." -ForegroundColor Yellow
        psql -h $DbHost -p $Port -U $PostgresUser -d postgres -c "DROP DATABASE $DatabaseName;" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Database dropped" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Failed to drop database" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "   Skipping database creation, will use existing database" -ForegroundColor Yellow
    }
}

if (-not ($dbExists -eq "1") -or $response -eq "yes") {
    Write-Host "[INFO] Creating database '$DatabaseName'..." -ForegroundColor Yellow
    psql -h $DbHost -p $Port -U $PostgresUser -d postgres -c "CREATE DATABASE $DatabaseName;" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to create database" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Run the setup script
Write-Host "[INFO] Setting up tables, indexes, and sample data..." -ForegroundColor Yellow
$scriptPath = Join-Path $PSScriptRoot "database\setup_local.sql"
if (-not (Test-Path $scriptPath)) {
    Write-Host "[ERROR] SQL script not found: $scriptPath" -ForegroundColor Red
    exit 1
}

psql -h $DbHost -p $Port -U $PostgresUser -d $DatabaseName -f $scriptPath
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database setup completed successfully!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Database setup failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Verify tables
Write-Host "[INFO] Verifying tables..." -ForegroundColor Yellow
$tables = psql -h $DbHost -p $Port -U $PostgresUser -d $DatabaseName -tAc "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
Write-Host "   Tables created: $tables" -ForegroundColor Gray
Write-Host ""

# Display connection info for .env
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[INFO] Connection String for .env:" -ForegroundColor Cyan
Write-Host "   DATABASE_URL=postgresql://${PostgresUser}:${PostgresPassword}@${Host}:${Port}/$DatabaseName" -ForegroundColor White
Write-Host ""
Write-Host "[INFO] Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Update .env file with your PostgreSQL password" -ForegroundColor White
Write-Host "   2. Run: docker-compose up -d" -ForegroundColor White
Write-Host "   3. Access Hasura Console: http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green

# Clear password from environment
$env:PGPASSWORD = $null
