import svc from '../services/Pedidos.service.js';
import { sendEventToAll } from '../routes/sse.route.js';
// GET /pedidos
const getAll = async (_req, res) => {
    try {
        const data = await svc.getPedidos();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /pedidos/:id/detalles
const getDetalles = async (req, res) => {
    try {
        const data = await svc.getDetalles(req.params.id);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /pedidos
const create = async (req, res) => {
    try {
        const { TrabajadorId, Tipo, NoMesa, Detalles } = req.body;

        if (!TrabajadorId || Tipo === undefined || !Detalles)
            return res.status(400).json({ error: 'Datos incompletos' });

        await svc.createPedido({ TrabajadorId, Tipo, NoMesa, Detalles });

        sendEventToAll('nuevo_pedido', { TrabajadorId, Tipo, NoMesa, Detalles });

        res.status(201).json({ message: 'Pedido registrado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /pedidos/:id
const update = async (req, res) => {
    try {
        console.log('Actualizar pedido - req.body:', req.body);
        const { TrabajadorId, Tipo, NoMesa, Detalles } = req.body;
        if (!Detalles || !Array.isArray(Detalles) || Detalles.length === 0) {
            return res.status(400).json({ error: 'Detalles inválidos' });
        }

        await svc.updatePedido(req.params.id, { TrabajadorId, Tipo, NoMesa, Detalles });
        res.json({ message: 'Pedido actualizado' });
    } catch (e) {
        console.log('Error al actualizar pedido:', e);
        res.status(500).json({ error: e.message });
    }
};

// PUT /pedidos/:id/ready
const ready = async (req, res) => {
    try {
        await svc.marcarReady(req.params.id);
        
        sendEventToAll('pedido_ready', { id: req.params.id });

        res.json({ message: 'Pedido marcado como listo' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


// PUT /pedidos/:id/finalizar
const finalizar = async (req, res) => {
    try {
        await svc.finalizarPedido(req.params.id);

        sendEventToAll('pedido_finalizado', { id: req.params.id });

        res.json({ message: 'Pedido finalizado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT /pedidos/:id/cancelar
const cancelar = async (req, res) => {
    try {
        const ok = await svc.cancelar(req.params.id);

        if (!ok) {
            return res.status(400).json({
                error: 'No se pudo cancelar (pedido no existe o ya está terminado)'
            });
        }

        sendEventToAll('pedido_cancelado', { id: req.params.id });

        res.json({ message: 'Pedido cancelado' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default {
    getAll,
    getDetalles,
    create,
    update,
    ready,
    finalizar,
    cancelar
};