const sql = require('mssql');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const scriptPath = path.join(__dirname, '..', 'Database', 'SQLDEMS.sql');
    const script = fs.readFileSync(scriptPath, 'utf8');

    await sql.connect({
      user: 'sa',
      password: 'Admin123!',
      server: 'localhost\\SQLEXPRESS',
      database: 'master',
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    });

    console.log("Ejecutando script SQL...");
    await sql.query(script);

    console.log("Base de datos creada correctamente ✔");
    process.exit(0);

  } catch (err) {
    console.error("Error BD:", err);
    process.exit(1);
  }
}

run();