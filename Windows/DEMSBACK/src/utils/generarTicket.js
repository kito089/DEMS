import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generarTicket = (pedido) => {
  const doc = new PDFDocument();

  const filePath = path.join('tickets', `ticket_${pedido.id}.pdf`);

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('TICKET DE COMPRA', { align: 'center' });

  doc.moveDown();
  doc.fontSize(12).text(`Cliente: ${pedido.nombre}`);
  doc.text(`Correo: ${pedido.correo}`);
  doc.text(`Fecha: ${pedido.fecha}`);

  doc.moveDown();
  doc.text('--- Detalles ---');

  pedido.productos.forEach(p => {
    doc.text(`${p.nombre} - $${p.precio}`);
  });

  doc.moveDown();
  doc.text(`Total: $${pedido.total}`);

  doc.end();

  return filePath;
};