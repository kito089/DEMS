import service from '../services/Pagos.service.js';
import { sendEventToAll } from '../routes/sse.route.js';

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
        const { Monto, idPedido, Pagos } = req.body;
        if (!Monto || !idPedido || !Pagos)
            return res.status(400).json({ error: 'Monto, idPedido y Pagos son requeridos' });

        const idPago = await service.createPago({ Monto, idPedido, idTipoPago });

        sendEventToAll('nuevo_pago', { Monto, idPedido, idTipoPago, idPago });

        res.status(201).json({ message: 'Pago registrado', idPago });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST /pagos/enviar-ticket
const enviarTicket = async (req, res) => {
    try {
        const { idPago, email } = req.body;
        if (!idPago || !email)
            return res.status(400).json({ error: 'idPago y email son requeridos' });
    }catch (e) {
        res.status(500).json({ error: e.message });
    }


export default { getAll, getById, getByPedido, create, enviarTicket };