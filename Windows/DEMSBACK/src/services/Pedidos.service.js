import { getConnection, sql } from '../config/connection.js';

// GET pedidos
const getPedidos = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .execute('sp_GetPedidosEstructura');

    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    if (!raw) return [];

    const pedidos = JSON.parse(raw);

    const pedidosCompJSON = pedidos.map(p => ({
        ...p,
        Mesero: p.Mesero ? JSON.parse(p.Mesero) : null,
        Platillo: p.Platillo ? JSON.parse(p.Platillo) : null
    }));

    return pedidosCompJSON;
};

// GET detalles
const getDetalles = async (idPedido) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('idPedido', sql.Int, idPedido)
        .execute('sp_GetDetallesPedidoEstructura');

    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    return raw ? JSON.parse(raw) : [];
};

// INSERT
const createPedido = async ({ TrabajadorId, Tipo, NoMesa, Detalles }) => {
    if (!Detalles || !Array.isArray(Detalles) || Detalles.length === 0) {
        throw new Error('Detalles inválidos');
    }

    const pool = await getConnection();

    await pool.request()
        .input('TrabajadorId', sql.Int, TrabajadorId)
        .input('Tipo', sql.TinyInt, Tipo)
        .input('NoMesa', sql.Int, NoMesa)
        .input('DetallesPedido', sql.NVarChar(sql.MAX), JSON.stringify(Detalles))
        .execute('sp_RegistrarPedido');

    return true;
};

// UPDATE
const updatePedido = async (idPedido, { TrabajadorId, Tipo, NoMesa, Detalles }) => {
    if (!Detalles || !Array.isArray(Detalles) || Detalles.length === 0) {
        throw new Error('Datos inválidos');
    }
    const pool = await getConnection();

    await pool.request()
        .input('idPedido', sql.Int, idPedido)
        .input('TrabajadorId', sql.Int, TrabajadorId)
        .input('Tipo', sql.TinyInt, Tipo)
        .input('NoMesa', sql.Int, NoMesa)
        .input('DetallesPedido', sql.NVarChar(sql.MAX), JSON.stringify(Detalles))
        .execute('sp_ActualizarPedido');
    return true;
};

// FINALIZAR
const finalizarPedido = async (idPedido) => {
    const pool = await getConnection();

    await pool.request()
        .input('idPedido', sql.Int, idPedido)
        .execute('sp_FinalizarPedido');

    return true;
};

// CANCELAR
const cancelar = async (idPedido) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input('idPedido', sql.Int, idPedido)
        .query(`
            UPDATE Pedidos 
            SET Estado = 'Cancelado' 
            WHERE idPedido = @idPedido
              AND Estado NOT IN ('Terminado', 'Completado');

            SELECT @@ROWCOUNT AS affected;
        `);

    return result.recordset[0].affected > 0;
};

export default {
    getPedidos,
    getDetalles,
    createPedido,
    updatePedido,
    finalizarPedido,
    cancelar
};