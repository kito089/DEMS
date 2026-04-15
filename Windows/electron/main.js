const { app, BrowserWindow, Menu } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let backend;

// ============================
// BUSCAR node.exe EN EL SISTEMA
// ============================
// En producción, Electron no hereda el PATH del sistema.
// Buscamos node.exe en el registro y en rutas conocidas.
function findNodeExe() {
  const { execSync } = require('child_process');

  // 1. Intentar leer del registro de Windows (instalación global)
  try {
    const installPath = execSync(
      'reg query "HKLM\\SOFTWARE\\Node.js" /v InstallPath',
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    const match = installPath.match(/InstallPath\s+REG_SZ\s+(.+)/);
    if (match) {
      const candidate = path.join(match[1].trim(), 'node.exe');
      if (fs.existsSync(candidate)) return candidate;
    }
  } catch (_) {}

  // 2. Ruta por defecto del instalador MSI oficial
  const defaults = [
    'C:\\Program Files\\nodejs\\node.exe',
    'C:\\Program Files (x86)\\nodejs\\node.exe',
  ];
  for (const candidate of defaults) {
    if (fs.existsSync(candidate)) return candidate;
  }

  // 3. Fallback: confiar en el PATH (puede fallar en algunos entornos)
  return 'node';
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets/icon.ico'),
    autoHideMenuBar: true,
  });

  win.loadFile(path.join(__dirname, 'renderer/index.html'));
  win.setMenu(null);
  Menu.setApplicationMenu(null);
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  const nodeExe = findNodeExe();
  
  // Localizamos la carpeta DEMSBACK que Inno Setup instaló en la raíz de {app}
  // process.execPath es C:\Program Files\DEMS\DEMS.exe
  const appRoot = path.dirname(process.execPath);
  const backendDir = path.join(appRoot, 'DEMSBACK');
  const serverPath = path.join(backendDir, 'src', 'server.js');

  console.log('Buscando servidor en:', serverPath);

  if (fs.existsSync(serverPath)) {
    backend = spawn(nodeExe, [serverPath], {
      cwd: backendDir,
      windowsHide: true,
      stdio: 'pipe' // Cambiamos a pipe para poder leer logs si fuera necesario
    });

    backend.on('error', (err) => {
      console.error('Fallo al iniciar proceso backend:', err);
    });
  } else {
    console.error('No se encontró el archivo del servidor en la ruta:', serverPath);
  }

  createWindow();
});

app.on('before-quit', () => {
  if (backend) backend.kill();
});
