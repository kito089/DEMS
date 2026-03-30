import PDFDocument from 'pdfkit';

export const generarTicket = (pedido) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    // Captura el PDF en memoria en lugar de escribirlo a disco
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

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
  });
};