param(
  [string]$InstallerDir = $PSScriptRoot,
  [string]$LogFile = "C:\dems_install_log.txt"
)

Start-Transcript -Path $LogFile -Force

Write-Host "Verificando dependencias..."
Write-Host "InstallerDir: $InstallerDir"

function Install-MSI($path) {
    if (!(Test-Path $path)) {
        Write-Host "No existe MSI: $path"
        Stop-Transcript
        exit 1
    }
    $p = Start-Process "msiexec.exe" -ArgumentList "/i `"$path`" /quiet /norestart" -Wait -PassThru
    if ($p.ExitCode -ne 0) {
        Write-Host "MSI falló con código: $($p.ExitCode)"
        Stop-Transcript
        exit 1
    }
}

# ============================
# NODE
# ============================
$node = Get-Command node -ErrorAction SilentlyContinue

if (!$node) {
    Write-Host "Instalando Node..."
    Install-MSI (Join-Path $InstallerDir "node-v24.14.1-x64.msi")

    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("Path", "User")

    $node = Get-Command node -ErrorAction SilentlyContinue
    if (!$node) {
        Write-Host "Node no se instaló correctamente"
        Stop-Transcript
        exit 1
    }
    Write-Host "Node instalado: $(node --version)"
}
else {
    Write-Host "Node ya instalado: $(node --version)"
}

# ============================
# SQL SERVER EXPRESS (offline)
# ============================
$sql = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue

if (!$sql) {
    Write-Host "Instalando SQL Server Express..."

    $setup = Join-Path $InstallerDir "SQLEXPR_x64_ESN.exe"

    if (!(Test-Path $setup)) {
        Write-Host "No existe instalador offline: $setup"
        Write-Host "Coloca SQLEXPR_x64_ENU.exe en la carpeta /Installers/ del proyecto"
        Stop-Transcript
        exit 1
    }

    $p = Start-Process $setup -ArgumentList `
        "/Q /ACTION=Install /FEATURES=SQLEngine /INSTANCENAME=SQLEXPRESS /SECURITYMODE=SQL /SAPWD=Admin123! /TCPENABLED=1 /NPENABLED=1 /IACCEPTSQLSERVERLICENSETERMS" `
        -Wait -PassThru

    Write-Host "SQL installer exit code: $($p.ExitCode)"

    if ($p.ExitCode -ne 0 -and $p.ExitCode -ne 3010) {
        Write-Host "SQL Server falló con código: $($p.ExitCode)"
        Stop-Transcript
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
        Stop-Transcript
        exit 1
    }

    Write-Host "SQL Server instalado correctamente"
}
else {
    Write-Host "SQL Server ya instalado (estado: $($sql.Status))"
}

Write-Host "Dependencias listas"
Stop-Transcript
exit 0