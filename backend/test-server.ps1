# Test start server trực tiếp
Write-Host "🧪 Testing server start..." -ForegroundColor Cyan
Write-Host ""

# Set working directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Check files
Write-Host "Checking files..." -ForegroundColor Cyan
if (Test-Path "server.js") {
    Write-Host "✅ server.js found" -ForegroundColor Green
} else {
    Write-Host "❌ server.js NOT found" -ForegroundColor Red
    exit 1
}

if (Test-Path "node_modules") {
    Write-Host "✅ node_modules found" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules NOT found - running npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Setting environment variable..." -ForegroundColor Cyan
$env:USE_MOCK_KLING = "true"
Write-Host "USE_MOCK_KLING = $env:USE_MOCK_KLING" -ForegroundColor Green

Write-Host ""
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start server
node server.js


