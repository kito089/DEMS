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

; Scripts a TMP (IMPORTANTE)
Source: "..\Scripts\*"; DestDir: "{tmp}\Scripts"; Flags: recursesubdirs

; Instaladores a TMP
Source: "..\installers\*"; DestDir: "{tmp}\installers"; Flags: recursesubdirs

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
begin
  Result := True;

  if not Exec(
    'powershell.exe',
    '-NoProfile -ExecutionPolicy Bypass -File "' +
    ExpandConstant('{tmp}\Scripts\01_setup_deps.ps1') + '"',
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  ) then
  begin
    MsgBox('Error ejecutando script de dependencias', mbError, MB_OK);
    Result := False;
    exit;
  end;

  if ResultCode <> 0 then
  begin
    MsgBox('Falló la instalación de dependencias. Código: ' + IntToStr(ResultCode), mbError, MB_OK);
    Result := False;
    exit;
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
  WizardForm.ProgressGauge.Max := 100;

  DevicePage := CreateInputQueryPage(
    wpSelectDir,
    'Configuración de dispositivos',
    'Cantidad de meseros',
    'Ingrese cuántos dispositivos móviles se conectarán:'
  );

  DevicePage.Add('Número de dispositivos:', False);

  QRImage := TBitmapImage.Create(WizardForm);
  QRImage.Parent := WizardForm;
  QRImage.Left := ScaleX(20);
  QRImage.Top := ScaleY(140);
  QRImage.Width := ScaleX(200);
  QRImage.Height := ScaleY(200);

  StatusLabelDevices := TNewStaticText.Create(WizardForm);
  StatusLabelDevices.Parent := WizardForm;
  StatusLabelDevices.Left := ScaleX(20);
  StatusLabelDevices.Top := ScaleY(350);
  StatusLabelDevices.Caption := 'Dispositivos conectados: 0/0';
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
  if LoadStringFromFile(ExpandConstant('{app}\Scripts\status.txt'), Status) then
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
    if LoadStringFromFile(ExpandConstant('{app}\Scripts\status.txt'), Status) then
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
begin
  if CurStep = ssInstall then
  begin
    // DB
    ExecOrFail('powershell.exe',
      '-NoProfile -ExecutionPolicy Bypass -File "' +
      ExpandConstant('{app}\Scripts\02_init_db.ps1') + '"');

    // Red
    ExecOrFail('powershell.exe',
      '-NoProfile -ExecutionPolicy Bypass -File "' +
      ExpandConstant('{app}\Scripts\03_validate_network.ps1') + '"');

    // Sync dispositivos
    if not Exec(
      'node',
      '"' + ExpandConstant('{app}\Scripts\device-sync.js') + '" ' +
      IntToStr(DeviceCount),
      '',
      SW_SHOW,
      ewNoWait,
      ResultCode
    ) then
    begin
      MsgBox('Error iniciando sincronización', mbError, MB_OK);
      Abort;
    end;

    WaitForDevices();

    // Obtener IP
    ExecOrFail('powershell.exe',
      '-NoProfile -ExecutionPolicy Bypass -File "' +
      ExpandConstant('{app}\Scripts\04_get_ip.ps1') + '"');

    IP := GetIPFromFile();
    if IP = '' then Abort;

    // Firewall
    ExecOrFail('powershell.exe',
      '-NoProfile -ExecutionPolicy Bypass -File "' +
      ExpandConstant('{app}\Scripts\06_firewall.ps1') + '"');
  end;
end;