const sql = require('mssql');

const dbSettings = {
    user: 'sa', // El que creaste en SSMS
    password: 'TuPasswordSegura',
    server: '192.168.1.XX', // Tu IP local
    database: 'CenaduriaLomaBonita',
    options: {
        encrypt: false, // Cambiar a true si usas Azure
        trustServerCertificate: true, // Importante para conexiones locales
    },
};

const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error("Error de conexión a SQL Server:", error);
    }
};

module.exports = {
    getConnection,
    sql
};