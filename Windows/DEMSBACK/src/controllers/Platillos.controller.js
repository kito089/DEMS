import svc from '../services/Platillos.service.js';
import { sendEventToAll } from '../routes/sse.route.js';

// GET /platillos
const getAll = async (_req, res) => {
    try {
        const data = await svc.getPlatillos();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /platillos/completo
const getCompleto = async (_req, res) => {
    try {
        const data = await svc.getPlatillosCompletos();
        console.log("Enviando platillos completos: ", data);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /platillos/structure
const getStructure = async (_req, res) => {
    try {
        const data = await svc.getStructure();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /platillos/menu
const getMenu = async (_req, res) => {
    try {
        const menu = await svc.getMenuDigital();
        res.json(menu);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /platillos/:id
const getById = async (req, res) => {
    try {
        const platillo = await svc.getPlatilloById(req.params.id);
        if (!platillo) return res.status(404).json({ error: 'Platillo no encontrado' });
        res.json(platillo);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /platillos
const create = async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, idCategoria } = req.body;
        if (!Nombre || !Precio || !idCategoria)
            return res.status(400).json({ error: 'Nombre, Precio e idCategoria son requeridos' });

        const id = await svc.createPlatillo({ Nombre, Descripcion, Precio, idCategoria });

        sendEventToAll('nuevo_platillo', { Nombre, Descripcion, Precio, idCategoria, idPlatillo: id });

        res.status(201).json({ message: 'Platillo creado', idPlatillo: id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /platillos/:id
const update = async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, idCategoria } = req.body;
        if (!Nombre || !Precio || !idCategoria)
            return res.status(400).json({ error: 'Nombre, Precio e idCategoria son requeridos' });

        const ok = await svc.updatePlatillo(req.params.id, { Nombre, Descripcion, Precio, idCategoria });
        if (!ok) return res.status(404).json({ error: 'Platillo no encontrado' });

        sendEventToAll('platillo_actualizado', { id: req.params.id, Nombre, Descripcion, Precio, idCategoria });

        res.json({ message: 'Platillo actualizado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// DELETE /platillos/:id
const remove = async (req, res) => {
    try {
        const ok = await svc.deletePlatillo(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Platillo no encontrado' });

        sendEventToAll('platillo_eliminado', { id: req.params.id });

        res.json({ message: 'Platillo desactivado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default {
    getAll,
    getCompleto,
    getStructure,
    getMenu,
    getById,
    create,
    update,
    remove
};