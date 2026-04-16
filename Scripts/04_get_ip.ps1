$activeIP = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notmatch '^127\.' -and 
    $_.IPAddress -notmatch '^169\.254\.' -and
    $_.InterfaceAlias -notmatch 'Loopback|Bluetooth|Pseudo|Virtual'
} | Select-Object -First 1 -ExpandProperty IPAddress

# Si por alguna razón falla, usamos localhost por seguridad
if (-not $activeIP) { $activeIP = "127.0.0.1" }

# Guardamos en el archivo que lee Inno Setup
$activeIP | Out-File -FilePath (Join-Path $PSScriptRoot "ip.txt") -Encoding ascii -Force
Write-Host "IP Detectada: $activeIP"