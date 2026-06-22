$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$phpDir = Join-Path $projectDir "php74"
$installDir = Join-Path $projectDir "install"
$mdir = Join-Path $projectDir "mariadb\mariadb-11.4.5-winx64"

$oldPath = $env:Path
$env:Path = "$phpDir;$env:Path"

# Start MariaDB if not running
$mysqlProcess = Get-Process -Name mariadbd -ErrorAction SilentlyContinue
if (-not $mysqlProcess) {
    Write-Host "Starting MariaDB..."
    $dataDir = Join-Path $mdir "data"
    Start-Process -FilePath "$mdir\bin\mariadbd.exe" -ArgumentList "--datadir=`"$dataDir`"", "--port=3307", "--skip-grant-tables" -WindowStyle Hidden
    Start-Sleep -Seconds 4
    Write-Host "MariaDB started on port 3307"
}

# Clear caches
Write-Host "Clearing caches..."
Set-Location -LiteralPath $installDir
php artisan view:clear 2>$null
php artisan cache:clear 2>$null
php artisan config:clear 2>$null

# Start Laravel dev server
Write-Host "Starting Laravel dev server..."
$existing = Get-Process -Name php -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*artisan serve*" }
if (-not $existing) {
    Start-Process -FilePath "$phpDir\php.exe" -ArgumentList "artisan serve --host=0.0.0.0 --port=8000" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "============================================"
Write-Host "  Vivaah Setu Matrimonial"
Write-Host "  Site: http://localhost:8000/"
Write-Host "  Admin: http://localhost:8000/admin/login"
Write-Host "  Email: admin@example.com"
Write-Host "  Pass:  password"
Write-Host "============================================"
Write-Host ""
Write-Host "Press any key to stop servers..."
$null = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "Stopping servers..."
Get-Process -Name php -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name mariadbd -ErrorAction SilentlyContinue | Stop-Process -Force

$env:Path = $oldPath
