const repo = require('../repositories/trabajadores.repository');

exports.getAll = async (req, res) => {
    try {
        const data = await repo.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener trabajadores' });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await repo.getById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener trabajador' });
    }
};

exports.create = async (req, res) => {
    try {
        const nuevo = await repo.create(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear trabajador' });
    }
};

exports.update = async (req, res) => {
    try {
        const actualizado = await repo.update(req.params.id, req.body);
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar trabajador' });
    }
};

exports.remove = async (req, res) => {
    try {
        await repo.remove(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar trabajador' });
    }
};