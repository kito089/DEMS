import { getReservacionesProximas } from '../services/Recordatorios.service.js';
import { sendReminderEmail } from '../services/Email.service.js';

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