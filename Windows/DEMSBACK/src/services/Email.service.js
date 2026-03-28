import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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