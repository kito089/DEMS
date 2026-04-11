Write-Host "Verificando dependencias..."

function Install-MSI($path) {
    Start-Process "msiexec.exe" -ArgumentList "/i `"$path`" /quiet /norestart" -Wait -NoNewWindow
}

function Install-EXE($path, $args) {
    Start-Process $path -ArgumentList $args -Wait -NoNewWindow
}

# ============================
# NODE
# ============================
$node = Get-Command node -ErrorAction SilentlyContinue

if (!$node) {
    Write-Host "Instalando Node..."
    Install-MSI "$PSScriptRoot\..\installers\node.msi"

    # refrescar PATH real
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
}

# ============================
# SQL SERVER
# ============================
$sql = Get-Service -Name "MSSQL$SQLEXPRESS" -ErrorAction SilentlyContinue

if (!$sql) {
    Write-Host "Instalando SQL Server..."

    Install-EXE "$PSScriptRoot\..\installers\SQLEXPR_x64.exe" `
    "/Q /ACTION=Install /FEATURES=SQLEngine /INSTANCENAME=SQLEXPRESS /SECURITYMODE=SQL /SAPWD=Admin123! /TCPENABLED=1 /NPENABLED=1"

    Start-Sleep -Seconds 20
}

Write-Host "Dependencias listas"