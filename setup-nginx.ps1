# Setup script for nginx on Windows
Write-Host "Setting up nginx for Digital Marketplace..." -ForegroundColor Green

# Check if nginx is already installed
$nginxPath = "C:\nginx"
if (!(Test-Path $nginxPath)) {
    Write-Host "Nginx not found. Please download nginx for Windows from https://nginx.org/en/download.html" -ForegroundColor Yellow
    Write-Host "Extract it to C:\nginx and run this script again." -ForegroundColor Yellow
    exit 1
}

# Build the application first
Write-Host "Building the application..." -ForegroundColor Blue
npm run build

# Copy nginx configuration
$configSource = "nginx-dev.conf"
$configDest = "$nginxPath\conf\nginx.conf"

if (Test-Path $configSource) {
    Copy-Item $configSource $configDest -Force
    Write-Host "Nginx configuration copied successfully." -ForegroundColor Green
} else {
    Write-Host "nginx-dev.conf not found!" -ForegroundColor Red
    exit 1
}

# Start nginx
Write-Host "Starting nginx..." -ForegroundColor Blue
Start-Process -FilePath "$nginxPath\nginx.exe" -WorkingDirectory $nginxPath

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Your application will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Make sure to start your Express server on port 3000 with: npm run dev" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "To stop nginx later, run: taskkill /f /im nginx.exe" -ForegroundColor Yellow
