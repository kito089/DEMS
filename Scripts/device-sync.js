const express = require('express');
const QRCode = require('qrcode');
const open = require('open');

const app = express();

let connected = 0;
const expected = 3; // luego lo haces dinámico

const ip = process.argv[2];

app.use(express.json());

app.post('/register', (req, res) => {
  connected++;
  console.log(`Dispositivo conectado: ${connected}`);
  res.send({ ok: true });

  if (connected >= expected) {
    console.log("Todos conectados ✔");
    process.exit(0);
  }
});

app.listen(3000, '0.0.0.0', async () => {
  const url = `http://${ip}:3000/register`;

  await QRCode.toFile('qr.png', url);

  console.log("Escanea el QR para conectar dispositivos");

  await open('qr.png');
});