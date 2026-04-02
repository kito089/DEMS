import bcrypt from 'bcrypt';
import service from '../services/Trabajadores.service.js';
import jwt from 'jsonwebtoken';


const SALT_ROUNDS = 10;

// GET /trabajadores
const getAll = async (_req, res) => {
    try {
        const trabajadores = await service.findAll();
        res.json(trabajadores);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /trabajadores/structure
const getStructure = async (_req, res) => {
    try {
        const estructura = await service.findStructure();
        res.json(estructura);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /trabajadores/:id
const getById = async (req, res) => {
    try {
        const trabajador = await service.findById(req.params.id);
        if (!trabajador) {
            return res.status(404).json({ error: 'Trabajador no encontrado' });
        }
        res.json(trabajador);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /trabajadores
const create = async (req, res) => {
    try {
        const { Nombre, Contra, idRol } = req.body;

        if (!Nombre || !Contra || idRol == null) {
            return res.status(400).json({
                error: 'Nombre, Contra e idRol son requeridos'
            });
        }

        const hash = await bcrypt.hash(Contra, SALT_ROUNDS);

        await service.insertOne(Nombre, hash, idRol);

        res.status(201).json({
            message: 'Trabajador creado'
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /trabajadores/:id
const update = async (req, res) => {
    try {
        const { Nombre, Contra, idRol } = req.body;

        if (!Nombre || idRol == null) {
            return res.status(400).json({
                error: 'Nombre e idRol son requeridos'
            });
        }

        const hash = Contra
            ? await bcrypt.hash(Contra, SALT_ROUNDS)
            : null;

        const affected = await service.updateOne(
            req.params.id,
            Nombre,
            idRol,
            hash
        );

        if (!affected) {
            return res.status(404).json({
                error: 'Trabajador no encontrado'
            });
        }

        res.json({ message: 'Trabajador actualizado' });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// DELETE /trabajadores/:id (soft delete)
const remove = async (req, res) => {
    try {
        const affected = await service.deactivateOne(req.params.id);

        if (!affected) {
            return res.status(404).json({
                error: 'Trabajador no encontrado'
            });
        }

        res.json({ message: 'Trabajador desactivado' });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /trabajadores/login
const login = async (req, res) => {
    try {
        const { Nombre, Contra } = req.body;

        if (!Nombre || !Contra) {
            return res.status(400).json({
                error: 'Nombre y Contraseña son requeridos'
            });
        }

        const trabajador = await service.findForLogin(Nombre);

        if (!trabajador) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const match = await bcrypt.compare(Contra, trabajador.Contra);

        if (!match) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const { Contra: _, ...datos } = trabajador;

        // TOKENSSSSS
        const token = jwt.sign(
            { id: datos.idTrabajador, rol: datos.Rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Login exitoso',
            token,           // 👈 y esto
            trabajador: datos
        });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default {
    getAll,
    getStructure,
    getById,
    create,
    update,
    remove,
    login
};


