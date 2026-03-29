import { getReservacionesProximas } from '../services/Recordatorios.service.js';
import { sendReminderEmail } from '../services/Email.service.js';
import { sendTicketEmail } from '../services/Email.service.js';

export const enviarRecordatorios = async (req, res) => {
  try {
    const reservaciones = await getReservacionesProximas();

    for (const r of reservaciones) {
      await sendReminderEmail(
        r.Correo,
        r.Fecha,
        r.NombreCliente
      );
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

export const pruebaTicket = async (req, res) => {
  try {
    const pedido = {
      id: 1,
      nombre: 'Angel',
      correo: 'erushg66@gmail.com', // 👈 pon tu correo real
      fecha: new Date(),
      productos: [
        { nombre: 'Tacos', precio: 50 },
        { nombre: 'Refresco', precio: 20 }
      ],
      total: 70
    };

    await sendTicketEmail(pedido);

    res.json({ mensaje: 'Ticket enviado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar ticket' });
  }
};