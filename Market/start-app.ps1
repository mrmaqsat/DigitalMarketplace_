# Quick start script for Digital Marketplace
Write-Host "Starting Digital Marketplace..." -ForegroundColor Green

# Check if nginx is running
$nginxProcess = Get-Process -Name "nginx" -ErrorAction SilentlyContinue
if (-not $nginxProcess) {
    Write-Host "Starting nginx..." -ForegroundColor Yellow
    Start-Process -FilePath "C:\nginx\nginx.exe" -WorkingDirectory "C:\nginx"
    Start-Sleep 2
}

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" }).IPAddress | Select-Object -First 1

Write-Host "✅ Nginx is running!" -ForegroundColor Green
Write-Host ""
Write-Host "🌍 Access your app at:" -ForegroundColor Cyan
Write-Host "  Local:    http://localhost:8080" -ForegroundColor White
Write-Host "  Network:  http://$localIP:8080" -ForegroundColor White
Write-Host ""
Write-Host "📱 Share with others on same WiFi: http://$localIP:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Now starting Express server..." -ForegroundColor Blue
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start Express server
npm run dev
