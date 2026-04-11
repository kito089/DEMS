const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

// ============================
// CONFIG
// ============================
const expected = parseInt(process.argv[2], 10) || 1;
const devices = new Set();
let connected = 0;

const basePath = __dirname;
const statusPath = path.join(basePath, 'status.txt');
const qrPath = path.join(basePath, 'qr.png');

// ============================
// OBTENER IP LOCAL
// ============================
function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (let name in interfaces) {
    for (let net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return '127.0.0.1';
}

const ip = getLocalIP();

// Guardar IP (opcional)
fs.writeFileSync(path.join(basePath, 'ip.txt'), ip);

// ============================
// ESTADO
// ============================
function updateStatus() {
  fs.writeFileSync(statusPath, `${connected}/${expected}`);
}

// Inicializar estado
updateStatus();

// ============================
// API
// ============================
app.use(express.json());

app.post('/register', (req, res) => {
  const id = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!devices.has(id)) {
    devices.add(id);
    connected++;
    updateStatus();
  }

  console.log(`Dispositivo conectado: ${connected}/${expected}`);

  res.send({ ok: true });

  if (connected >= expected) {
    console.log("Todos conectados ✔");
    process.exit(0);
  }
});

// ============================
// SERVIDOR + QR
// ============================
app.listen(3000, '0.0.0.0', async () => {
  try {
    const url = `http://${ip}:3000/login`;

    await QRCode.toFile(qrPath, url, { width: 300 });

    console.log("=================================");
    console.log("Servidor iniciado");
    console.log("IP:", ip);
    console.log("URL:", url);
    console.log("QR generado en:", qrPath);
    console.log("Escanea el QR para conectar dispositivos");
    console.log("=================================");
  } catch (err) {
    console.error("Error generando QR:", err);
  }
});