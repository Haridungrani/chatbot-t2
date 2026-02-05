# Chatbot Project - Quick Setup Script
# Run this script to set up everything

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Chatbot Project - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "🔍 Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
Write-Host "🔍 Checking environment file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}
Write-Host ""

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Start services
Write-Host "🚀 Starting services (PostgreSQL, Hasura, Adminer)..." -ForegroundColor Yellow
Write-Host "   This may take a minute..." -ForegroundColor Gray
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Services started successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check container status
Write-Host ""
Write-Host "📊 Container Status:" -ForegroundColor Cyan
docker-compose ps
Write-Host ""

# Display access information
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your services:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Hasura Console:  http://localhost:8080" -ForegroundColor White
Write-Host "   Admin Secret:    chatbot_admin_secret_2026" -ForegroundColor Gray
Write-Host ""
Write-Host "   Adminer (DB UI): http://localhost:8081" -ForegroundColor White
Write-Host "   Username:        postgres" -ForegroundColor Gray
Write-Host "   Password:        postgres_password" -ForegroundColor Gray
Write-Host "   Database:        chatbot_db" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Read HASURA_SETUP.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
Write-Host "🧪 Test GraphQL API at: http://localhost:8080/api/api-explorer" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs:       docker-compose logs -f" -ForegroundColor Gray
Write-Host "   Stop services:   docker-compose down" -ForegroundColor Gray
Write-Host "   Restart:         docker-compose restart" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
