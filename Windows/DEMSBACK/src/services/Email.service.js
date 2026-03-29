import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { generarTicket } from '../utils/generarTicket.js';

// CONFIGURACIÓN DEL CORREO
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'erushg66@gmail.com',
    pass: 'rjbthvrolosmlgxz' // ⚠️ NO tu contraseña normal
  }
});

// FUNCIÓN PARA GENERAR HTML
function generarHTML(fecha, nombre) {
  const ruta = path.resolve('src/assets/templates/reservacion.html');
  let html = fs.readFileSync(ruta, 'utf-8');

  html = html.replace('{{fecha}}', fecha);
  html = html.replace('{{nombre}}', nombre);

  return html;
}

// FUNCIÓN PRINCIPAL
export const sendReminderEmail = async (correo, fecha, nombre) => {
  try {
    const html = generarHTML(fecha, nombre);

    await transporter.sendMail({
      from: '"Reservaciones" <erushg66@gmail.com>',
      to: correo,
      subject: 'Recordatorio de tu reservación',
      html: html
    });

    console.log(`Correo enviado a ${correo}`);

  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};

export const sendTicketEmail = async (pedido) => {
  const pdfPath = generarTicket(pedido);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: pedido.correo,
    subject: 'Tu ticket de compra 🧾',
    text: 'Gracias por tu compra, aquí está tu ticket.',
    attachments: [
      {
        filename: 'ticket.pdf',
        path: pdfPath
      }
    ]
  });
};