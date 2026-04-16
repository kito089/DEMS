import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Rutas
import TrabajadoresRoutes from './routes/Trabajadores.route.js';
import platillosRoutes from './routes/Platillos.route.js';
import PagosRoutes from './routes/Pagos.route.js';
import ReservacionesRoutes from './routes/Reservaciones.route.js';
import recordatorioRoutes from './routes/Recordatorio.route.js';
import PedidosRoutes from './routes/Pedidos.route.js';
import MenuRoutes from './routes/Menu.route.js';
import reportesRouter from './routes/Reportes.route.js';


// Jobs (cron)
import { iniciarRecordatorios } from './jobs/Recordatorios.job.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpeta de imágenes si no existe
const imagesDir = path.join(__dirname, 'images', 'platillos');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir imágenes de platillos como archivos estáticos
// Acceso: GET http://ip:3000/images/platillos/1.jpg
app.use('/images', express.static(path.join(__dirname, 'images')));

// Rutas
app.use('/Trabajadores', TrabajadoresRoutes);
app.use('/Platillos', platillosRoutes);
app.use('/Pagos', PagosRoutes);
app.use('/Reservaciones', ReservacionesRoutes);
app.use('/recordatorios', recordatorioRoutes);
app.use('/Pedidos', PedidosRoutes);
app.use('/Menu', MenuRoutes);
app.use('/reportes', reportesRouter);

app.post('/register', (req, res) => {
  res.status(200).json({ ok: true });
});

// iniciar tareas automáticas
iniciarRecordatorios();

export default app;