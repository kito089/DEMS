import express from 'express';
import cors from 'cors';

// Rutas
import TrabajadoresRoutes from './routes/Trabajadores.route.js';
import platillosRoutes from './routes/Platillos.route.js';
import PagosRoutes from './routes/Pagos.route.js';
import recordatorioRoutes from './routes/Recordatorio.route.js';

// Jobs (cron)
import { iniciarRecordatorios } from './jobs/Recordatorios.job.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/Trabajadores', TrabajadoresRoutes);
app.use('/Platillos', platillosRoutes);
app.use('/Pagos', PagosRoutes);
app.use('/recordatorios', recordatorioRoutes);

// 👇 iniciar tareas automáticas
iniciarRecordatorios();

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

export default app;