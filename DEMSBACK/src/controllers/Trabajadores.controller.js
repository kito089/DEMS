const bcrypt = require('bcrypt');
const { getConnection, sql } = require('./config/connection');

const SALT_ROUNDS = 10;

// GET /trabajadores
const getAll = async (_req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`SELECT * FROM vw_Trabajadores`);
        res.json(result.recordset);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /trabajadores/structure
const getStructure = async (_req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`SELECT * FROM vw_EstructuraTrabajadores`);
        res.json(result.recordset);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /trabajadores/:id
const getById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`SELECT * FROM vw_Trabajadores WHERE idTrabajador = @id`);

        const trabajador = result.recordset[0];
        if (!trabajador) return res.status(404).json({ error: 'Trabajador no encontrado' });
        res.json(trabajador);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /trabajadores
const create = async (req, res) => {
    try {
        const { Nombre, Contra, idRol } = req.body;
        if (!Nombre || !Contra || !idRol)
            return res.status(400).json({ error: 'Nombre, Contra e idRol son requeridos' });

        const hash = await bcrypt.hash(Contra, SALT_ROUNDS);
        const pool = await getConnection();
        const result = await pool.request()
            .input('Nombre', sql.VarChar(45),  Nombre)
            .input('Contra', sql.VarChar(100), hash)
            .input('idRol',  sql.Int,          idRol)
            .query(`
                INSERT INTO Trabajadores (Nombre, Contra, RolTrabajadores_idRolTrabajadores)
                OUTPUT INSERTED.idTrabajador
                VALUES (@Nombre, @Contra, @idRol)
            `);

        res.status(201).json({ message: 'Trabajador creado', idTrabajador: result.recordset[0].idTrabajador });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /trabajadores/:id  (Contra opcional)
const update = async (req, res) => {
    try {
        const { Nombre, Contra, idRol } = req.body;
        if (!Nombre || !idRol)
            return res.status(400).json({ error: 'Nombre e idRol son requeridos' });

        const pool = await getConnection();
        const req2 = pool.request()
            .input('id',     sql.Int,         req.params.id)
            .input('Nombre', sql.VarChar(45), Nombre)
            .input('idRol',  sql.Int,         idRol);

        let setContra = '';
        if (Contra) {
            const hash = await bcrypt.hash(Contra, SALT_ROUNDS);
            req2.input('Contra', sql.VarChar(100), hash);
            setContra = 'Contra = @Contra,';
        }

        const result = await req2.query(`
            UPDATE Trabajadores
            SET Nombre = @Nombre,
                ${setContra}
                RolTrabajadores_idRolTrabajadores = @idRol
            WHERE idTrabajador = @id
        `);

        if (!result.rowsAffected[0]) return res.status(404).json({ error: 'Trabajador no encontrado' });
        res.json({ message: 'Trabajador actualizado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// DELETE /trabajadores/:id  (soft delete)
const remove = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query(`UPDATE Trabajadores SET Activo = 0 WHERE idTrabajador = @id`);

        if (!result.rowsAffected[0]) return res.status(404).json({ error: 'Trabajador no encontrado' });
        res.json({ message: 'Trabajador desactivado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /trabajadores/login
const login = async (req, res) => {
    try {
        const { Nombre, Contra } = req.body;
        if (!Nombre || !Contra)
            return res.status(400).json({ error: 'Nombre y Contra son requeridos' });

        const pool = await getConnection();
        const result = await pool.request()
            .input('Nombre', sql.VarChar(45), Nombre)
            .execute('sp_LoginTrabajador');

        const trabajador = result.recordset[0];
        if (!trabajador) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const match = await bcrypt.compare(Contra, trabajador.Contra);
        if (!match) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const { Contra: _, ...datos } = trabajador;
        res.json({ message: 'Login exitoso', trabajador: datos });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { getAll, getStructure, getById, create, update, remove, login };