import { getConnection, sql } from '../config/connection.js';

const getHistorialVentas = async (fechaInicio, fechaFin) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('FechaInicio', sql.DateTime, new Date(fechaInicio))
        .input('FechaFin', sql.DateTime, new Date(fechaFin))
        .execute('sp_ReporteHistorialVentas');

    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    return JSON.parse(raw);
};

const getTopPlatillos = async (fechaInicio, fechaFin) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('FechaInicio', sql.DateTime, new Date(fechaInicio))
        .input('FechaFin', sql.DateTime, new Date(fechaFin))
        .execute('sp_GraficaTopPlatillos');

    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    return JSON.parse(raw);
};

const getMetodosPago = async (fechaInicio, fechaFin) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('FechaInicio', sql.DateTime, new Date(fechaInicio))
        .input('FechaFin', sql.DateTime, new Date(fechaFin))
        .execute('sp_GraficaMetodosPago');

    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    return JSON.parse(raw);
};

const getVentasPorFecha = async (fechaInicio, fechaFin) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('FechaInicio', sql.DateTime, new Date(fechaInicio))
        .input('FechaFin', sql.DateTime, new Date(fechaFin))
        .execute('sp_GraficaVentasPorFecha');

    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    return JSON.parse(raw);
};

const getHistorialCambios = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`
            SELECT 
                l.idHistorial,
                l.TablaAfectada,
                l.Accion,
                l.DatosAnt,
                l.DatosNv,
                l.Fecha,
                l.Descripcion,
                t.Nombre AS trabajador
            FROM Logs l
            INNER JOIN trabajadores t ON l.trabajadores_idTrabajador = t.idTrabajador
            ORDER BY l.Fecha DESC
        `);
    return result.recordset;
};

export default {
    getHistorialVentas,
    getTopPlatillos,
    getMetodosPago,
    getVentasPorFecha,
    getHistorialCambios
};