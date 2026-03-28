# Run all services with separate PowerShell windows
# Usage: `.\run-dev.ps1` from F:\TA

$backendPath = "F:\TA\FEBE-main\FEBE-main\backend"
$frontendPath = "F:\TA\FEBE-main\FEBE-main\frontend"
$mlApiPath = "F:\TA\ML-API-main\ML-API-main"

Write-Host "Starting backend at $backendPath..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm install; npm start"

Write-Host "Starting frontend at $frontendPath..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm install; npm start"

Write-Host "Starting ML API at $mlApiPath..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mlApiPath'; python -m pip install -r requirements.txt; python main.py"

Write-Host "Semua service dijalankan (backend, frontend, ml-api)." -ForegroundColor Cyan
