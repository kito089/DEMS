[Setup]
AppName=DEMS
AppVersion=1.0.0
DefaultDirName={pf}\DEMS
DefaultGroupName=DEMS
OutputDir=.
OutputBaseFilename=DEMS-Installer
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Files]
; App Electron
Source: "..\Windows\electron\dist\win-unpacked\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

; Backend
Source: "..\Windows\DEMSBACK\*"; DestDir: "{app}\DEMSBACK"; Flags: recursesubdirs
Source: "..\Windows\Database\SQLDEMS.sql"; DestDir: "{app}\DEMSBACK"; Flags: ignoreversion

; Scripts
Source: "..\Scripts\*"; DestDir: "{tmp}\Scripts"; Flags: recursesubdirs

; Extraccion temprana para InitializeSetup
Source: "..\Scripts\01_setup_deps.ps1"; DestDir: "{tmp}"; Flags: dontcopy
Source: "..\Installers\node-v24.14.1-x64.msi"; DestDir: "{tmp}"; Flags: dontcopy
; Reemplaza la línea del SQLEXPR_x64_ESN.exe por la carpeta ya extraída
Source: "..\Installers\SQLEXPR_x64_ESN\*"; DestDir: "{tmp}\SQLEXPR"; Flags: recursesubdirs

; Instaladores a {app}
Source: "..\Installers\*"; DestDir: "{app}\installers"; Flags: recursesubdirs

[Icons]
Name: "{group}\DEMS"; Filename: "{app}\DEMS.exe"
Name: "{commondesktop}\DEMS"; Filename: "{app}\DEMS.exe"

[Run]
Filename: "{app}\DEMS.exe"; Description: "Abrir DEMS"; Flags: nowait postinstall skipifsilent

[Code]

var
  ResultCode: Integer;
  DeviceCount: Integer;
  DevicePage: TInputQueryWizardPage;
  QRImage: TBitmapImage;
  StatusLabelDevices: TNewStaticText;
  IP: String;


// ============================
// EJECUCIÓN SEGURA
// ============================
procedure ExecOrFail(FileName, Params: String);
begin
  if not Exec(FileName, Params, '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    MsgBox('Error al ejecutar: ' + FileName + #13#10 + 'Params: ' + Params, mbError, MB_OK);
    Abort;
  end;

  if ResultCode <> 0 then
  begin
    MsgBox('El proceso falló: ' + FileName + #13#10 + 'Params: ' + Params + #13#10 + 'Código: ' + IntToStr(ResultCode), mbError, MB_OK);
    Abort;
  end;
end;


// ============================
// VALIDAR DEPENDENCIAS (ANTES DE UI)
// ============================
function InitializeSetup(): Boolean;
var
  ScriptPath: String;
  InstallerPath: String;
begin
  Result := True;

  ExtractTemporaryFile('01_setup_deps.ps1');
  ExtractTemporaryFile('node-v24.14.1-x64.msi');

  ScriptPath    := ExpandConstant('{tmp}\01_setup_deps.ps1');
  InstallerPath := ExpandConstant('{tmp}');

  if not Exec(
    'powershell.exe',
    '-NoProfile -ExecutionPolicy Bypass -File "' + ScriptPath + '" -InstallerDir "' + InstallerPath + '" -LogFile "C:\dems_install_log.txt"',
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  ) then
  begin
    MsgBox('Error ejecutando script de dependencias', mbError, MB_OK);
    Result := False;
    Exit;
  end;

  if ResultCode <> 0 then
  begin
    MsgBox('Falló la instalación de dependencias. Código: ' + IntToStr(ResultCode) + #13#10 + 'Ver: C:\dems_install_log.txt', mbError, MB_OK);
    Result := False;
    Exit;
  end;
end;

// ============================
// LEER IP
// ============================
function GetIPFromFile(): String;
var
  IPContent: AnsiString;
begin
  if LoadStringFromFile(ExpandConstant('{tmp}\Scripts\ip.txt'), IPContent) then
    Result := Trim(String(IPContent))
  else
    Result := '';
end;


// ============================
// UI
// ============================
procedure InitializeWizard();
begin
  DevicePage := CreateInputQueryPage(
    wpSelectDir,
    'Configuración de dispositivos',
    'Cantidad de meseros',
    'Ingrese cuántos dispositivos móviles se conectarán:'
  );
  DevicePage.Add('Número de dispositivos:', False);

  // Crear sobre la superficie de DevicePage, no sobre WizardForm
  QRImage := TBitmapImage.Create(DevicePage.Surface);
  QRImage.Parent := DevicePage.Surface;
  QRImage.Left := ScaleX(20);
  QRImage.Top := ScaleY(80);
  QRImage.Width := ScaleX(200);
  QRImage.Height := ScaleY(200);
  QRImage.Visible := False; // oculto hasta que haya IP

  StatusLabelDevices := TNewStaticText.Create(DevicePage.Surface);
  StatusLabelDevices.Parent := DevicePage.Surface;
  StatusLabelDevices.Left := ScaleX(20);
  StatusLabelDevices.Top := ScaleY(290);
  StatusLabelDevices.Caption := 'Dispositivos conectados: 0/0';
  StatusLabelDevices.Visible := False; // oculto hasta ssInstall
end;

// ============================
// ACTUALIZAR UI
// ============================
procedure UpdateStatusUI();
var
  Status: AnsiString;
begin
  // Corregido: los scripts están en {tmp}\Scripts, no en {app}\Scripts
  if LoadStringFromFile(ExpandConstant('{tmp}\Scripts\status.txt'), Status) then
    StatusLabelDevices.Caption := 'Dispositivos conectados: ' + Trim(Status);
end;


// ============================
// ESPERAR DISPOSITIVOS
// ============================
procedure WaitForDevices();
var
  Status: AnsiString;
  Current: Integer;
  SepPos: Integer;
begin
  while True do
  begin
    // Corregido: ruta consistente con {tmp}\Scripts
    if LoadStringFromFile(ExpandConstant('{tmp}\Scripts\status.txt'), Status) then
    begin
      Status := Trim(Status);
      SepPos := Pos('/', Status);

      if SepPos > 0 then
      begin
        Current := StrToIntDef(Copy(Status, 1, SepPos - 1), 0);
        StatusLabelDevices.Caption := 'Dispositivos conectados: ' + Status;

        if Current >= DeviceCount then
          Break;
      end;
    end;

    WizardForm.Refresh;
    Sleep(1000);
  end;
end;

procedure CenterQRImage();
begin
  QRImage.Left := (DevicePage.SurfaceWidth - QRImage.Width) div 2;
  // Ajustamos el Top para que no choque con el texto superior
  QRImage.Top := ScaleY(100); 
end;

function NextButtonClick(CurPageID: Integer): Boolean;
var
  ScriptsPath: String;
  QRPngPath, QRBmpPath: String;
  PSCommand: String;
  Timeout: Integer;
begin
  Result := True;

  if CurPageID = DevicePage.ID then
  begin
    DeviceCount := StrToIntDef(DevicePage.Values[0], 0);
    if DeviceCount <= 0 then
    begin
      MsgBox('Por favor, ingrese un número válido.', mbError, MB_OK);
      Result := False;
      Exit;
    end;

    ScriptsPath := ExpandConstant('{tmp}\Scripts\');
    QRPngPath := ScriptsPath + 'qr.png';
    QRBmpPath := ScriptsPath + 'qr.bmp';

    // 1. Limpiar archivos de un intento anterior
    if FileExists(QRPngPath) then DeleteFile(QRPngPath);
    if FileExists(QRBmpPath) then DeleteFile(QRBmpPath);

    // 2. Ejecutar Node en segundo plano (creará el qr.png)
    if not Exec('node', '"' + ScriptsPath + 'device-sync.js" ' + IntToStr(DeviceCount), 
                '', SW_HIDE, ewNoWait, ResultCode) then
    begin
      MsgBox('Error al iniciar Node.js', mbError, MB_OK);
      Result := False;
      Exit;
    end;

    StatusLabelDevices.Caption := 'Generando código QR...';
    StatusLabelDevices.Visible := True;
    WizardForm.Refresh;

    // 3. Esperar hasta 5 segundos a que Node cree el archivo PNG
    Timeout := 0;
    while (not FileExists(QRPngPath)) and (Timeout < 25) do
    begin
      Sleep(200);
      Timeout := Timeout + 1;
    end;

    // 4. Magia de Windows: Convertir PNG a BMP usando PowerShell
    if FileExists(QRPngPath) then
    begin
      // Este comando usa la librería nativa System.Drawing de Windows para convertir la imagen
      PSCommand := Format('-NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile(''%s''); $img.Save(''%s'', [System.Drawing.Imaging.ImageFormat]::Bmp); $img.Dispose();"', [QRPngPath, QRBmpPath]);
      
      Exec('powershell.exe', PSCommand, '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

      // 5. Mostrar el BMP en Inno Setup
      if FileExists(QRBmpPath) then
      begin
        QRImage.Bitmap.LoadFromFile(QRBmpPath);
        QRImage.Visible := True;
        QRImage.Left := (DevicePage.SurfaceWidth - QRImage.Width) div 2;
        QRImage.Top := ScaleY(85); 
      end else
      begin
        MsgBox('Error: Windows no pudo convertir el QR a formato BMP.', mbError, MB_OK);
      end;
    end else
    begin
      MsgBox('Error: No se pudo generar el QR base (Node.js falló).', mbError, MB_OK);
    end;

    // 6. Bloquear el instalador hasta que los dispositivos se conecten
    WizardForm.NextButton.Enabled := False;
    try
      WaitForDevices();
    finally
      WizardForm.NextButton.Enabled := True;
    end;
  end;
end;

// ============================
// FLUJO PRINCIPAL
// ============================
procedure CurStepChanged(CurStep: TSetupStep);
var
  ScriptsPath: String;
  SqlSetupDir: String;
begin
  if CurStep = ssInstall then
  begin
    ScriptsPath := ExpandConstant('{tmp}\Scripts\');
    SqlSetupDir := ExpandConstant('{tmp}\SQLEXPR');

    // 1. Instalar SQL Server con comillas reforzadas
    ExecOrFail('powershell.exe', 
      Format('-NoProfile -ExecutionPolicy Bypass -File "%s05_install_sql.ps1" -SetupDir "%s"', [ScriptsPath, SqlSetupDir]));

    // 2. Inicializar DB
    ExecOrFail('powershell.exe', 
      Format('-NoProfile -ExecutionPolicy Bypass -File "%s02_init_db.ps1" -AppDir "%s"', [ScriptsPath, ExpandConstant('{app}')]));

    // 3. Obtener la IP final (por si cambió durante el proceso)
    ExecOrFail('powershell.exe', 
      Format('-NoProfile -ExecutionPolicy Bypass -File "%s04_get_ip.ps1"', [ScriptsPath]));

    IP := GetIPFromFile(); // Ahora usa la variable global declarada al principio
    
    if IP = '' then
    begin
      MsgBox('Advertencia: No se pudo recuperar la IP local, pero la instalación continuará.', mbInformation, MB_OK);
    end;

    // 4. Configurar Firewall usando la IP si tu script lo requiere
    ExecOrFail('powershell.exe', 
      Format('-NoProfile -ExecutionPolicy Bypass -File "%s06_firewall.ps1"', [ScriptsPath]));
  end;
end;