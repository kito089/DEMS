import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import sseRoutes from './routes/sse.route.js';



const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor DEMS! corriendo en http://localhost:${PORT}`);
});

app.use('/sse', sseRoutes);

//Para probar este archivo con node server.js
//se ejecuta node server.js desde la carpeta de src