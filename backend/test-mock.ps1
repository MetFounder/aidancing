# PowerShell script để test với mock Kling API
# Chạy mock server và main server + worker
# 
# LƯU Ý: Chạy PowerShell Run as Administrator nếu gặp lỗi execution policy
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "🚀 Starting Mock Kling API Test..." -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  .env file not found. Creating from env.example..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host ""
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "🔧 Starting services..." -ForegroundColor Cyan
Write-Host ""

# Set environment variable for PowerShell
$env:USE_MOCK_KLING = "true"

# Start mock server
Write-Host "1️⃣  Starting Mock Kling Server (port 3002)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node mockKlingServer.js"
Start-Sleep -Seconds 2

# Start main server
Write-Host "2️⃣  Starting Main Server (port 3001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; `$env:USE_MOCK_KLING='true'; node server.js"
Start-Sleep -Seconds 2

# Start worker
Write-Host "3️⃣  Starting Worker..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; `$env:USE_MOCK_KLING='true'; node worker.js"

Write-Host ""
Write-Host "✅ All services started in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Services:" -ForegroundColor Cyan
Write-Host "   - Mock Kling API: http://localhost:3002"
Write-Host "   - Main Server:   http://localhost:3001"
Write-Host "   - Worker:        Running"
Write-Host ""
Write-Host "🌐 Open in browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:3001/" -ForegroundColor Yellow
Write-Host ""
Write-Host "🧪 Test endpoints:" -ForegroundColor Cyan
Write-Host "   POST http://localhost:3001/api/dancing/create-job"
Write-Host "   GET  http://localhost:3001/api/dancing/job-status/:job_id"
Write-Host ""
Write-Host "📊 Mock Kling Debug:" -ForegroundColor Cyan
Write-Host "   GET  http://localhost:3002/mock/tasks"
Write-Host ""
Write-Host "💡 Close PowerShell windows to stop services" -ForegroundColor Yellow
Write-Host ""

