#!/usr/bin/env pwsh

Write-Host "🔧 Fixing package-lock.json sync issues after MongoDB migration..." -ForegroundColor Cyan

# Check if npm is available
try {
    npm --version | Out-Null
} catch {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js and npm first: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Remove existing lock files
Write-Host "🗑️  Removing old lock files..." -ForegroundColor Yellow
Remove-Item -Path "package-lock.json" -ErrorAction SilentlyContinue
Remove-Item -Path "server/package-lock.json" -ErrorAction SilentlyContinue

# Clean npm cache
Write-Host "🧹 Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Reinstall dependencies
Write-Host "📦 Reinstalling root dependencies..." -ForegroundColor Green
npm install

Write-Host "📦 Reinstalling server dependencies..." -ForegroundColor Green
Set-Location server
npm install
Set-Location ..

# Verify the installation
Write-Host "✅ Verifying installation..." -ForegroundColor Green
npm ci --dry-run
Set-Location server
npm ci --dry-run
Set-Location ..

Write-Host "✅ Lock files updated successfully!" -ForegroundColor Green
Write-Host "💡 Now commit the changes:" -ForegroundColor Cyan
Write-Host "   git add package-lock.json server/package-lock.json" -ForegroundColor White
Write-Host "   git commit -m 'fix: update package-lock.json files after MongoDB migration'" -ForegroundColor White
Write-Host "   git push" -ForegroundColor White