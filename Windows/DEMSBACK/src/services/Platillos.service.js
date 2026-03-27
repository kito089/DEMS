const { getConnection, sql } = require('./config/connection');

// GET todos los platillos — vista vw_MenuDetallado
const getPlatillos = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`SELECT * FROM vw_MenuDetallado`);
    return result.recordset;
};

// GET platillo por ID — vw_MenuDetallado filtrada (no hay SP ni vista específica)
const getPlatilloById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM vw_MenuDetallado WHERE idPlatillo = @id`);
    return result.recordset[0] || null;
};

// GET estructura de platillos con categoría anidada — sp_GetPlatillosEstructura
// El SP usa FOR JSON PATH, devuelve un string JSON en la primera columna del primer registro
const getStructure = async () => {
    const pool = await getConnection();
    const result = await pool.request()
        .execute('sp_GetPlatillosEstructura');
    const raw = result.recordset[0][Object.keys(result.recordset[0])[0]];
    return JSON.parse(raw);
};

// INSERT — no hay SP, query directo a Platillos
const createPlatillo = async ({ Nombre, Descripcion, Precio, idCategoria }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Nombre',      sql.VarChar(45),     Nombre)
        .input('Descripcion', sql.VarChar(45),     Descripcion || null)
        .input('Precio',      sql.Decimal(10, 2),  Precio)
        .input('idCategoria', sql.Int,             idCategoria)
        .query(`
            INSERT INTO Platillos (Nombre, Descripcion, Precio, CategoriasPlatillos_idCategoriasPlatillos)
            OUTPUT INSERTED.idPlatillo
            VALUES (@Nombre, @Descripcion, @Precio, @idCategoria)
        `);
    return result.recordset[0].idPlatillo;
};

// UPDATE — no hay SP, query directo a Platillos
const updatePlatillo = async (id, { Nombre, Descripcion, Precio, idCategoria }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id',          sql.Int,            id)
        .input('Nombre',      sql.VarChar(45),    Nombre)
        .input('Descripcion', sql.VarChar(45),    Descripcion || null)
        .input('Precio',      sql.Decimal(10, 2), Precio)
        .input('idCategoria', sql.Int,            idCategoria)
        .query(`
            UPDATE Platillos
            SET Nombre      = @Nombre,
                Descripcion = @Descripcion,
                Precio      = @Precio,
                CategoriasPlatillos_idCategoriasPlatillos = @idCategoria
            WHERE idPlatillo = @id
        `);
    return result.rowsAffected[0] > 0;
};

// Soft DELETE — no hay SP, query directo a Platillos
const deletePlatillo = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`UPDATE Platillos SET Activo = 0 WHERE idPlatillo = @id`);
    return result.rowsAffected[0] > 0;
};

// Menú digital agrupado por categoría — consume vw_MenuDetallado via getPlatillos
const getMenuDigital = async () => {
    const platillos = await getPlatillos();
    return platillos.reduce((menu, p) => {
        const cat = p.Categoria;
        if (!menu[cat]) menu[cat] = [];
        menu[cat].push({
            id:          p.idPlatillo,
            nombre:      p.Platillo,       // vw_MenuDetallado expone el campo como "Platillo"
            precio:      p.Precio
        });
        return menu;
    }, {});
};

module.exports = { getPlatillos, getPlatilloById, getStructure, createPlatillo, updatePlatillo, deletePlatillo, getMenuDigital };