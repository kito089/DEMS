import cron from 'node-cron';
import { getReservacionesProximas } from '../services/Recordatorios.service.js';
import { sendReminderEmail } from '../services/Email.service.js';

// PROGRAMAR TAREA
export const iniciarRecordatorios = () => {

  // ⏰ Se ejecuta todos los días a las 9:00 AM
 // cron.schedule('0 9 * * *', async () => {
     cron.schedule('* * * * *', async () => {
    console.log('⏰ Ejecutando envío de recordatorios...');

    try {
      const reservaciones = await getReservacionesProximas();

      for (const r of reservaciones) {
        await sendReminderEmail(
          r.Correo,
          r.Fecha,
          r.NombreCliente
        );
      }

      console.log(`✅ Correos enviados: ${reservaciones.length}`);

    } catch (error) {
      console.error('❌ Error en cron:', error);
    }
  });

};