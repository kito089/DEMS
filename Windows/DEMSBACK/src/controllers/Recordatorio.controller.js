import { getReservacionesProximas } from '../services/Recordatorios.service.js';
import { sendReminderEmail, sendTicketEmail, getPedidoById } from '../services/Email.service.js';
// 👆 quita el import de PedidoService, ya no lo necesitas

export const enviarRecordatorios = async (req, res) => {
  try {
    const reservaciones = await getReservacionesProximas();

    for (const r of reservaciones) {
      await sendReminderEmail(r.Correo, r.Fecha, r.NombreCliente);
    }

    res.status(200).json({
      message: 'Correos enviados',
      total: reservaciones.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al enviar correos',
      details: error.message
    });
  }
};

export const enviarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { correo } = req.query;

    if (!correo) {
      return res.status(400).json({ error: 'El correo es requerido' });
    }

    const pedido = await getPedidoById(id); // 👈 directo, sin PedidoService

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedido.correo = correo;

    await sendTicketEmail(pedido);

    res.json({ mensaje: 'Ticket enviado', destinatario: correo });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar ticket' });
  }
};