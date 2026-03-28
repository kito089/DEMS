import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor DEMS! corriendo en http://localhost:${PORT}`);
});

//Para probar este archivo con node server.js
//se ejecuta node server.js desde la carpeta de src