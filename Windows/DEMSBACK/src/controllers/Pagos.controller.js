import service from '../services/Pagos.service.js';
import { sendEventToAll } from '../routes/sse.route.js';
import { sendTicketEmail } from '../services/Email.service.js';
import { generarTicket } from '../utils/generarTicket.js';
import { print } from 'pdf-to-printer';
import fs from 'fs';
import os from 'os';
import path from 'path';

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
// POST /pagos
const create = async (req, res) => {
  try {
    const { idPedido, pagos } = req.body;

    if (!idPedido || !pagos || !Array.isArray(pagos) || pagos.length === 0) {
      return res.status(400).json({
        error: 'idPedido y pagos son requeridos'
      });
    }

    const metodoMap = {
      efectivo: 1,
      transferencia: 2,
      tarjeta: 3
    };

    const idsPagos = [];

    for (const pago of pagos) {
      if (!pago.monto || pago.monto <= 0) {
        return res.status(400).json({
          error: 'Todos los pagos deben tener monto válido'
        });
      }

      const idTipoPago = metodoMap[pago.metodo];

      if (!idTipoPago) {
        return res.status(400).json({
          error: `Método de pago inválido: ${pago.metodo}`
        });
      }

      const idPago = await service.createPago({
        Monto: pago.monto,
        idPedido,
        idTipoPago
      });

      idsPagos.push(idPago);
    }

    return res.status(201).json({
      message: 'Pagos registrados correctamente',
      idsPagos
    });

  } catch (e) {
    console.error('Error al registrar pagos:', e);
    res.status(500).json({ error: e.message });
  }
};

// POST /pagos/enviar-ticket
export const enviarTicket = async (req, res) => {
  try {
    const { folio, ubicacion, correo, fecha, productos } = req.body;

    if (!correo) {
      return res.status(400).json({ error: 'correo es requerido' });
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'productos inválidos' });
    }

    const total = productos.reduce((acc, p) => {
      return acc + ((p.precio || 0) * (p.cantidad || 1));
    }, 0);

    const pedido = {
      folio,
      ubicacion,
      correo,
      fecha,
      productos,
      total
    };

    console.log('Enviando ticket:', pedido);

    await sendTicketEmail(pedido);

    return res.status(200).json({
      message: 'Ticket enviado correctamente'
    });

  } catch (e) {
    console.error('❌ Error en enviarTicket:', e);
    return res.status(500).json({ error: e.message });
  }
};

// POST /pagos/imprimir-ticket
export const imprimirTicket = async (req, res) => {
  try {
    const { folio, ubicacion, fecha, productos } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'productos inválidos' });
    }

    // 🔹 Calcular total
    const total = productos.reduce((acc, p) => {
      return acc + ((p.precio || 0) * (p.cantidad || 1));
    }, 0);

    const pedido = {
      folio,
      ubicacion: ubicacion || 'Mostrador',
      fecha,
      productos,
      total
    };

    console.log('🖨️ Generando ticket:', pedido);

    const pdfBuffer = await generarTicket(pedido);

    const filePath = path.join(os.tmpdir(), `ticket-${Date.now()}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);

    /*await print(filePath, {
      // printer: "",
      silent: true
    });*/

    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: 'Ticket impreso correctamente'
    });

  } catch (e) {
    console.error('❌ Error en imprimirTicket:', e);
    return res.status(500).json({ error: e.message });
  }
};

export default { getAll, getById, getByPedido, create, enviarTicket, imprimirTicket };