Write-Host "Verificando dependencias..."

function Install-MSI($path) {
    Start-Process "msiexec.exe" -ArgumentList "/i `"$path`" /quiet /norestart" -Wait
}

function Install-EXE($path, $args) {
    Start-Process $path -ArgumentList $args -Wait
}

# NODE
$node = Get-Command node -ErrorAction SilentlyContinue
if (!$node) {
    Write-Host "Instalando Node..."
    Install-MSI "$PSScriptRoot\..\installers\node.msi"
    $env:Path += ";C:\Program Files\nodejs\"
}

# SQL SERVER
$sql = Get-Service -Name MSSQL* -ErrorAction SilentlyContinue
if (!$sql) {
    Write-Host "Instalando SQL Server..."
    Install-EXE "$PSScriptRoot\..\installers\SQLEXPR_x64.exe" `
    "/Q /ACTION=Install /FEATURES=SQLEngine /INSTANCENAME=SQLEXPRESS /SECURITYMODE=SQL /SAPWD=Admin123!"
    
    Start-Sleep -Seconds 15
}