import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Para poder recibir los JSON de los pedidos
app.use('/trabajadores', require('./routes/trabajadores.routes'));
app.use('/Platillos', require('./routes/Platillos.route'));

export default app;