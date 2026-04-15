Write-Host "Inicializando base de datos desde Scripts..."

# El archivo ahora está en la misma carpeta que este .ps1 ({tmp}\Scripts)
$initDb = Join-Path $PSScriptRoot "init-db.js"

# Buscar node.exe
$nodeExe = "node.exe"
if (Test-Path "$env:ProgramFiles\nodejs\node.exe") { $nodeExe = "$env:ProgramFiles\nodejs\node.exe" }

if (!(Test-Path $initDb)) {
    Write-Host "Error: No se encuentra $initDb"
    exit 1
}

# Ejecutar Node
& $nodeExe $initDb

if ($LASTEXITCODE -ne 0) {
    Write-Host "Fallo en init-db.js. Código: $LASTEXITCODE"
    exit 1
}

exit 0