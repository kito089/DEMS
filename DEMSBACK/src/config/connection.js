const sql = require('mssql');

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    options: {
        encrypt: false, // Cambiar a true si usas Azure
        trustServerCertificate: true, // Importante para conexiones locales
    },
};

const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        console.log("Conexión a SQL Server establecida");
        return pool;
    } catch (error) {
        console.error("Error de conexión a SQL Server:", error);
    }
};

module.exports = {
    getConnection,
    sql
};