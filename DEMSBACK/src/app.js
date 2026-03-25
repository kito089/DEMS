const express = require('express');
const cors = require('cors');


//const de rutas
const trabajadoresRoutes = require('./routes/trabajadores.routes');
const rolTrabajadoresRoutes = require('./routes/roltrabajadores.routes');
const reservacionesRoutes = require('./routes/reservaciones.routes');
const platillosRoutes = require('./routes/platillos.routes');
const categoriasPlatillosRoutes = require('./routes/categoriasplatillos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const detallesPedidoRoutes = require('./routes/detallespedido.routes');
const pagosRoutes = require('./routes/pagos.routes');
const tiposPagoRoutes = require('./routes/tipospago.routes');
const logsRoutes = require('./routes/logs.routes');
const app = express();

app.use(cors());
app.use(express.json());

//rutas 
app.use('/api/trabajadores', trabajadoresRoutes);
app.use('/api/roltrabajadores', rolTrabajadoresRoutes);
app.use('/api/reservaciones', reservacionesRoutes);
app.use('/api/platillos', platillosRoutes);
app.use('/api/categoriasplatillos', categoriasPlatillosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/detallespedido', detallesPedidoRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/tipospago', tiposPagoRoutes);
app.use('/api/logs', logsRoutes);

app.listen(3000, () => {
    console.log('Backend corriendo en puerto 3000');
});