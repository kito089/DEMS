param(
  [string]$SetupDir
)

Write-Host "Instalando SQL Server Express..."
Write-Host "SetupDir: $SetupDir"

$setup = Join-Path $SetupDir "SETUP.EXE"

if (!(Test-Path $setup)) {
    Write-Host "No existe SETUP.EXE en: $SetupDir"
    exit 1
}

$sql = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue

if ($sql) {
    Write-Host "SQL Server ya instalado (estado: $($sql.Status))"
    exit 0
}

$p = Start-Process $setup -ArgumentList `
    "/Q /ACTION=Install /FEATURES=SQLEngine /INSTANCENAME=SQLEXPRESS /SECURITYMODE=SQL /SAPWD=Admin123! /TCPENABLED=1 /NPENABLED=1 /IACCEPTSQLSERVERLICENSETERMS" `
    -WorkingDirectory $SetupDir `
    -Wait -PassThru

Write-Host "SETUP.EXE exit code: $($p.ExitCode)"

if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
    Write-Host "SQL Server falló con código: $($p.ExitCode)"
    exit 1
}

$retries = 0
do {
    Start-Sleep -Seconds 10
    $sql = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue
    $retries++
    Write-Host "Esperando servicio SQL... intento $retries/12"
} while (!$sql -and $retries -lt 12)

if (!$sql) {
    Write-Host "SQL Server no quedó registrado como servicio"
    exit 1
}

Write-Host "SQL Server instalado correctamente"
exit 0