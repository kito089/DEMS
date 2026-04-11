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

; Scripts
Source: "..\Scripts\*"; DestDir: "{tmp}\Scripts"; Flags: recursesubdirs

; Extraccion temprana para InitializeSetup
Source: "..\Scripts\01_setup_deps.ps1"; DestDir: "{tmp}"; Flags: dontcopy
Source: "..\Installers\node-v24.14.1-x64.msi"; DestDir: "{tmp}"; Flags: dontcopy
Source: "..\Installers\SQLEXPR_x64_ESN.exe"; DestDir: "{tmp}"; Flags: dontcopy

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


// ============================
// EJECUCIÓN SEGURA
// ============================
procedure ExecOrFail(FileName, Params: String);
begin
  if not Exec(FileName, Params, '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    MsgBox('Error al ejecutar: ' + FileName, mbError, MB_OK);
    Abort;
  end;

  if ResultCode <> 0 then
  begin
    MsgBox('El proceso falló: ' + FileName + #13#10 + 'Código: ' + IntToStr(ResultCode), mbError, MB_OK);
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
  ExtractTemporaryFile('SQLEXPR_x64_ESN.exe');

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
  IP: AnsiString;
begin
  if LoadStringFromFile(ExpandConstant('{app}\ip.txt'), IP) then
    Result := Trim(IP)
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
// VALIDACIÓN INPUT
// ============================
function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;

  if CurPageID = DevicePage.ID then
  begin
    DeviceCount := StrToIntDef(DevicePage.Values[0], 0);

    if DeviceCount <= 0 then
    begin
      MsgBox('Ingrese un número válido', mbError, MB_OK);
      Result := False;
    end;
  end;
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


// ============================
// FLUJO PRINCIPAL
// ============================
procedure CurStepChanged(CurStep: TSetupStep);
var
  IP: String;
  ScriptsPath: String;
begin
  if CurStep = ssInstall then
  begin
    ScriptsPath := ExpandConstant('{tmp}\Scripts\');

    // DB
    ExecOrFail('powershell.exe',
      '-NoProfile -ExecutionPolicy Bypass -File "' + ScriptsPath + '02_init_db.ps1"');

    // Red
    ExecOrFail('powershell.exe',
      '-NoProfile -ExecutionPolicy Bypass -File "' + ScriptsPath + '03_validate_network.ps1"');

    // Sync dispositivos (sin bloquear)
    if not Exec(
      'node',
      '"' + ScriptsPath + 'device-sync.js" ' + IntToStr(DeviceCount),
      '',
      SW_SHOW,
      ewNoWait,
      ResultCode
    ) then
    begin
      MsgBox('Error iniciando sincronización', mbError, MB_OK);
      Abort;
    end;

    StatusLabelDevices.Visible := True;
    WaitForDevices();

    // Obtener IP
    ExecOrFail('powershell.exe',
      '-NoProfile -ExecutionPolicy Bypass -File "' + ScriptsPath + '04_get_ip.ps1"');

    IP := GetIPFromFile();
    if IP = '' then
    begin
      MsgBox('No se pudo obtener la IP de red', mbError, MB_OK);
      Abort;
    end;

    // Firewall
    ExecOrFail('powershell.exe',
      '-NoProfile -ExecutionPolicy Bypass -File "' + ScriptsPath + '06_firewall.ps1"');
  end;
end;