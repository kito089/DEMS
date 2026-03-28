import service from '../services/Pagos.service.js';

// GET /pagos
const getAll = async (_req, res) => {
    try {
        const pagos = await service.getPagos();
        res.json(pagos);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /pagos/:id
const getById = async (req, res) => {
    try {
        const pago = await service.getPagoById(req.params.id);
        if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
        res.json(pago);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET /pagos/pedido/:idPedido
const getByPedido = async (req, res) => {
    try {
        const pagos = await service.getPagosByPedido(req.params.idPedido);
        res.json(pagos);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /pagos
const create = async (req, res) => {
    try {
        const { Monto, idPedido, idTipoPago } = req.body;
        if (!Monto || !idPedido || !idTipoPago)
            return res.status(400).json({ error: 'Monto, idPedido e idTipoPago son requeridos' });

        const idPago = await service.createPago({ Monto, idPedido, idTipoPago });
        res.status(201).json({ message: 'Pago registrado', idPago });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export default { getAll, getById, getByPedido, create };