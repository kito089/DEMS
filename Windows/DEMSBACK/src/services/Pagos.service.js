import { getConnection, sql } from '../config/connection.js';

// GET todos los pagos con método de pago anidado
const getPagos = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .execute('sp_GetPagosEstructura');

    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    return JSON.parse(raw);
};

// GET pago por ID
const getPagoById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
            SELECT idPago, Monto, Pedidos_idPedido, TiposPago_idTiposPago 
            FROM Pagos 
            WHERE idPago = @id
        `);

    return result.recordset[0] || null;
};

// GET pagos por pedido
const getPagosByPedido = async (idPedido) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('idPedido', sql.Int, idPedido)
        .query(`
            SELECT idPago, Monto, Pedidos_idPedido, TiposPago_idTiposPago 
            FROM Pagos 
            WHERE Pedidos_idPedido = @idPedido
        `);

    return result.recordset;
};

// INSERT
const createPago = async ({ Monto, idPedido, idTipoPago }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Monto', sql.Decimal(10, 2), Monto)
        .input('idPedido', sql.Int, idPedido)
        .input('idTipoPago', sql.Int, idTipoPago)
        .query(`
            INSERT INTO Pagos (Monto, Pedidos_idPedido, TiposPago_idTiposPago)
            OUTPUT INSERTED.idPago
            VALUES (@Monto, @idPedido, @idTipoPago)
        `);

    return result.recordset[0].idPago;
};

export default {
    getPagos,
    getPagoById,
    getPagosByPedido,
    createPago
};