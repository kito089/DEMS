const { getConnection } = require('./config/connection');

// Ejecuta la vista vw_Platillos (devuelve nombre y categoría entre otros campos)
const getPlatillos = async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM vw_Platillos`);
    return result.recordset;
};

const getPlatilloById = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', id)
        .query(`SELECT * FROM vw_Platillos WHERE idPlatillo = @id`);
    return result.recordset[0] || null;
};

// Devuelve la estructura de la tabla Platillos (columnas y sus propiedades)
const getStructure = async () => {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM vw_EstructuraPlatillos`);
    return result.recordset;
};

const createPlatillo = async ({ Nombre, Descripcion, Precio, idCategoria }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Nombre', Nombre)
        .input('Descripcion', Descripcion || null)
        .input('Precio', Precio)
        .input('idCategoria', idCategoria)
        .query(`
            INSERT INTO Platillos (Nombre, Descripcion, Precio, CategoriasPlatillos_idCategoriasPlatillos)
            OUTPUT INSERTED.idPlatillo
            VALUES (@Nombre, @Descripcion, @Precio, @idCategoria)
        `);
    return result.recordset[0].idPlatillo;
};

const updatePlatillo = async (id, { Nombre, Descripcion, Precio, idCategoria }) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', id)
        .input('Nombre', Nombre)
        .input('Descripcion', Descripcion || null)
        .input('Precio', Precio)
        .input('idCategoria', idCategoria)
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

// Soft delete — pone Activo = 0
const deletePlatillo = async (id) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', id)
        .query(`UPDATE Platillos SET Activo = 0 WHERE idPlatillo = @id`);
    return result.rowsAffected[0] > 0;
};

// Menú digital agrupado por categoría
const getMenuDigital = async () => {
    const platillos = await getPlatillos();
    return platillos.reduce((menu, p) => {
        const cat = p.Categoria;
        if (!menu[cat]) menu[cat] = [];
        menu[cat].push({
            id:          p.idPlatillo,
            nombre:      p.Nombre,
            descripcion: p.Descripcion,
            precio:      p.Precio
        });
        return menu;
    }, {});
};

module.exports = { getPlatillos, getPlatilloById, getStructure, createPlatillo, updatePlatillo, deletePlatillo, getMenuDigital };