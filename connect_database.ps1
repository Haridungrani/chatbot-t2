# Add database to Hasura via API
# This connects your PostgreSQL database to Hasura

$hasuraEndpoint = "http://localhost:8080"
$adminSecret = "chatbot_admin_secret_2026"

$headers = @{
    "Content-Type" = "application/json"
    "x-hasura-admin-secret" = $adminSecret
}

# Add the PostgreSQL data source
$body = @{
    type = "pg_add_source"
    args = @{
        name = "default"
        configuration = @{
            connection_info = @{
                database_url = "postgresql://postgres:postgres@host.docker.internal:5432/chatbot_db2"
                pool_settings = @{
                    max_connections = 50
                    idle_timeout = 180
                    retries = 1
                }
            }
        }
    }
} | ConvertTo-Json -Depth 10

Write-Host "Connecting database to Hasura..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$hasuraEndpoint/v1/metadata" -Method Post -Headers $headers -Body $body
    Write-Host "[SUCCESS] Database connected!" -ForegroundColor Green
    Write-Host "Database name: default" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next step: Refresh Hasura Console and track tables" -ForegroundColor Yellow
}
catch {
    Write-Host "[ERROR] Failed to connect database" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Please connect manually through the UI instead." -ForegroundColor Yellow
}
