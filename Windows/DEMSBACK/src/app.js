import express from 'express';
import cors from 'cors';

import TrabajadoresRoutes from './routes/Trabajadores.route.js';
import platillosRoutes from './routes/Platillos.route.js';
import PagosRoutes from './routes/Pagos.route.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/Trabajadores', TrabajadoresRoutes);
app.use('/Platillos', platillosRoutes);
app.use('/Pagos', PagosRoutes);

export default app;