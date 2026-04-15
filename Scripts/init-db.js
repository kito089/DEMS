const sql = require('mssql');
const fs = require('fs');
const path = require('path');

async function run() {
    // Tomamos la ruta del SQL desde la misma carpeta donde esté este script
    const scriptPath = path.join(__dirname, 'SQLDEMS.sql');
    
    if (!fs.existsSync(scriptPath)) {
        console.error("No se encontró el archivo SQL en:", scriptPath);
        process.exit(1);
    }

    const script = fs.readFileSync(scriptPath, 'utf8');
    const servers = ['localhost\\SQLEXPRESS', 'localhost'];
    let connected = false;

    for (const server of servers) {
        try {
            console.log(`Intentando conectar a: ${server}...`);
            await sql.connect({
                user: 'sa',
                password: '0891',
                server: server,
                database: 'master',
                options: { encrypt: false, trustServerCertificate: true, connectTimeout: 5000 }
            });
            connected = true;
            break; 
        } catch (err) {
            console.log(`No se pudo conectar a ${server}.`);
        }
    }

    if (!connected) {
        console.error("Error: No se encontró SQL Server activo.");
        process.exit(1);
    }

    try {
        console.log("Ejecutando script SQL...");
        const batches = script.split(/^\s*GO\s*$/im).map(b => b.trim()).filter(b => b.length > 0);

        for (const batch of batches) {
            await sql.query(batch);
        }

        console.log("Base de datos configurada.");
        await sql.close();
        process.exit(0);
    } catch (err) {
        console.error("Error ejecutando SQL:", err.message);
        process.exit(1);
    }
}
run();