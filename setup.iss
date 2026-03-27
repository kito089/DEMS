[Code]

var
  ResultCode: Integer;

procedure UpdateProgress(Value: Integer);
begin
  WizardForm.ProgressGauge.Position := Value;
end;

procedure RunStep(Step: String; Progress: Integer);
begin
  WizardForm.StatusLabel.Caption := Step;
  UpdateProgress(Progress);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
  begin
    RunStep('Instalando dependencias...', 10);
    Exec('powershell.exe',
      '-ExecutionPolicy Bypass -File "' + ExpandConstant('{app}\Scripts\01_setup_deps.ps1') + '"',
      '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

    RunStep('Configurando base de datos...', 30);
    Exec('powershell.exe',
      '-File "' + ExpandConstant('{app}\Scripts\02_init_db.ps1') + '"',
      '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

    RunStep('Validando red...', 50);
    Exec('powershell.exe',
      '-File "' + ExpandConstant('{app}\Scripts\03_validate_network.ps1') + '"',
      '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

    RunStep('Obteniendo IP...', 60);
    Exec('powershell.exe',
      '-File "' + ExpandConstant('{app}\Scripts\04_get_ip.ps1') + '"',
      '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

    RunStep('Configurando sistema...', 75);
    Exec('powershell.exe',
      '-File "' + ExpandConstant('{app}\Scripts\05_configure.ps1') + '"',
      '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

    RunStep('Configurando red...', 85);
    Exec('powershell.exe',
      '-File "' + ExpandConstant('{app}\Scripts\06_firewall.ps1') + '"',
      '', SW_HIDE, ewWaitUntilTerminated, ResultCode);

    RunStep('Sincronizando dispositivos...', 95);
    Exec('node',
      ExpandConstant('{app}\Scripts\device-sync.js'),
      '', SW_SHOW, ewWaitUntilTerminated, ResultCode);

    RunStep('Finalizando...', 100);
  end;
end;