const { getConnection, sql } = require('./config/connection');

// GET todos los trabajadores — tabla Trabajadores directo (no hay vista)
const findAll = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`SELECT idTrabajador, Nombre, RolTrabajadores_idRolTrabajadores, Activo FROM Trabajadores`);
    return result.recordset;
};

// GET trabajadores con estructura — sp_GetTrabajadoresEstructura
// El SP usa FOR JSON PATH, devuelve un string JSON en la primera columna del primer registro
const findStructure = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .execute('sp_GetTrabajadoresEstructura');
    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    return JSON.parse(raw);
};

// GET trabajador por ID — tabla Trabajadores directo (no hay vista ni SP)
const findById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT idTrabajador, Nombre, RolTrabajadores_idRolTrabajadores, Activo FROM Trabajadores WHERE idTrabajador = @id`);
    return result.recordset[0] ?? null;
};

// INSERT — sp_CrearTrabajador(@Nom, @Con, @Rol)
const insertOne = async (Nombre, hash, idRol) => {
    const pool = await getConnection();
    await pool.request()
        .input('Nom', sql.VarChar(45),  Nombre)
        .input('Con', sql.VarChar(100), hash)
        .input('Rol', sql.Int,          idRol)
        .execute('sp_CrearTrabajador');
};

// UPDATE — no hay SP, query directo (Contra opcional, ya hasheada si viene)
const updateOne = async (id, Nombre, idRol, hash = null) => {
    const pool = await getConnection();
    const req = pool.request()
        .input('id',     sql.Int,         id)
        .input('Nombre', sql.VarChar(45), Nombre)
        .input('idRol',  sql.Int,         idRol);

    let setContra = '';
    if (hash) {
        req.input('Contra', sql.VarChar(100), hash);
        setContra = 'Contra = @Contra,';
    }

    const result = await req.query(`
        UPDATE Trabajadores
        SET Nombre = @Nombre,
            ${setContra}
            RolTrabajadores_idRolTrabajadores = @idRol
        WHERE idTrabajador = @id
    `);

    return result.rowsAffected[0];
};

// Soft DELETE — no hay SP, query directo
const deactivateOne = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`UPDATE Trabajadores SET Activo = 0 WHERE idTrabajador = @id`);
    return result.rowsAffected[0];
};

// LOGIN — sp_LoginTrabajador(@Nombre)
const findForLogin = async (Nombre) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Nombre', sql.VarChar(45), Nombre)
        .execute('sp_LoginTrabajador');
    return result.recordset[0] ?? null;
};

module.exports = { findAll, findStructure, findById, insertOne, updateOne, deactivateOne, findForLogin };