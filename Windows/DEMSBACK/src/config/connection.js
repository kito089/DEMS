import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  server: process.env.DB_SERVER, // ← debe ser STRING limpio
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        console.log("Conexión a SQL Server establecida");
        return pool;
    } catch (error) {
        console.error("Error de conexión a SQL Server:", error);
        throw error; //IMPORTANTE Y CHAMAGOSO
    }
};

export { sql };