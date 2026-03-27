const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backend;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  win.loadFile(path.join(__dirname, 'renderer/index.html'));
}

app.whenReady().then(() => {

  // 🔥 Levantar backend
  backend = spawn('node', [path.join(__dirname, '../DEMSBACK/server.js')]);

  createWindow();
});

app.on('before-quit', () => {
  if (backend) backend.kill();
});