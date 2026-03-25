CREATE DATABASE DEMS;
GO
USE DEMS;

-- 1. TABLAS CATALOGO
CREATE TABLE RolTrabajadores (
    idRolTrabajadores INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(15) NOT NULL
);

INSERT INTO RolTrabajadores (Nombre) VALUES 
('Administrador'),
('Mesero'),
('Cocina');

CREATE TABLE TiposPago (
    idTiposPago INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(20) NOT NULL
);

INSERT INTO TiposPago (Nombre) VALUES
('Efectivo'),
('Transferencia'),
('Tarjeta');

CREATE TABLE CategoriasPlatillos (
    idCategoriasPlatillos INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(15) NOT NULL
);

INSERT INTO CategoriasPlatillos (Nombre) VALUES
('Comida'),
('Bebidas'),
('Extras');

-- 2. TABLAS PRINCIPALES
CREATE TABLE Trabajadores (
    idTrabajador INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(45) NOT NULL,
    Contra VARCHAR(100) NOT NULL,
    RolTrabajadores_idRolTrabajadores INT NOT NULL,
    Activo TINYINT NOT NULL DEFAULT 1,
    FOREIGN KEY (RolTrabajadores_idRolTrabajadores) REFERENCES RolTrabajadores(idRolTrabajadores)
);

CREATE TABLE Platillos (
    idPlatillo INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(45) NOT NULL,
    Descripcion VARCHAR(45),
    Precio DECIMAL(10,2) NOT NULL,
    CategoriasPlatillos_idCategoriasPlatillos INT NOT NULL,
    Activo TINYINT NOT NULL DEFAULT 1,
    FOREIGN KEY (CategoriasPlatillos_idCategoriasPlatillos) REFERENCES CategoriasPlatillos(idCategoriasPlatillos)
);

CREATE TABLE Reservaciones (
    idReservacion INT PRIMARY KEY IDENTITY(1,1),
    NombreCliente VARCHAR(45) NOT NULL,
    Telefono VARCHAR(10),
    Correo VARCHAR(45),
    Fecha DATETIME NOT NULL,
    NoPersonas INT NOT NULL,
    Estado VARCHAR(45) NOT NULL,
    trabajadores_idTrabajador INT NOT NULL,
    FOREIGN KEY (trabajadores_idTrabajador) REFERENCES trabajadores(idTrabajador)
);

CREATE TABLE Pedidos (
    idPedido INT PRIMARY KEY IDENTITY(1,1),
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Estado VARCHAR(45) NOT NULL,
    Tipo TINYINT NOT NULL, 
    NoMesa INT,            
    trabajadores_idTrabajador INT NOT NULL,
    FOREIGN KEY (trabajadores_idTrabajador) REFERENCES trabajadores(idTrabajador)
);

CREATE TABLE Pagos (
    idPago INT PRIMARY KEY IDENTITY(1,1),
    Monto DECIMAL(10,2) NOT NULL,
    Pedidos_idPedido INT NOT NULL,
    TiposPago_idTiposPago INT NOT NULL,
    FOREIGN KEY (Pedidos_idPedido) REFERENCES pedidos(idPedido),
    FOREIGN KEY (TiposPago_idTiposPago) REFERENCES TiposPago(idTiposPago)
);

CREATE TABLE DetallesPedido (
    idDetallePedido INT PRIMARY KEY IDENTITY(1,1),
    Pedidos_idPedido INT NOT NULL,
    Platillos_idPlatillo INT NOT NULL,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL,
    Nota VARCHAR(45),
    FOREIGN KEY (Pedidos_idPedido) REFERENCES pedidos(idPedido),
    FOREIGN KEY (Platillos_idPlatillo) REFERENCES platillos(idPlatillo)
);

CREATE TABLE Logs (
    idHistorial INT PRIMARY KEY IDENTITY(1,1),
    trabajadores_idTrabajador INT NOT NULL,
    TablaAfectada VARCHAR(45) NOT NULL,
    Accion VARCHAR(20) NOT NULL,
    DatosAnt VARCHAR(100),
    DatosNv VARCHAR(100),
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    Descripcion VARCHAR(45),
    FOREIGN KEY (trabajadores_idTrabajador) REFERENCES trabajadores(idTrabajador)
);
GO

-- 3. PROCESOS ALMACENADOS
CREATE PROCEDURE sp_LoginTrabajador @Nombre VARCHAR(45) AS
BEGIN
    SELECT t.idTrabajador, t.Nombre, t.Contra, r.Nombre AS Rol
    FROM trabajadores t
    INNER JOIN RolTrabajadores r ON t.RolTrabajadores_idRolTrabajadores = r.idRolTrabajadores
    WHERE t.Nombre = @Nombre AND t.Activo = 1;
END;
GO

CREATE PROCEDURE sp_RegistrarPedido @TrabajadorId INT, @Tipo TINYINT, @NoMesa INT, @DetallesPedido NVARCHAR(MAX) AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        INSERT INTO pedidos (Fecha, Estado, Tipo, NoMesa, trabajadores_idTrabajador)
        VALUES (GETDATE(), 'Proceso', @Tipo, @NoMesa, @TrabajadorId);
        DECLARE @Id INT = SCOPE_IDENTITY();
        INSERT INTO detallespedido (Pedidos_idPedido, Platillos_idPlatillo, Cantidad, PrecioUnitario, Nota)
        SELECT @Id, idPlatillo, cantidad, precio, nota FROM OPENJSON(@DetallesPedido)
        WITH (idPlatillo INT, cantidad INT, precio DECIMAL(10,2), nota VARCHAR(45));
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH ROLLBACK TRANSACTION; THROW; END CATCH
END;
GO

CREATE PROCEDURE sp_FinalizarPedido @idPedido INT AS
BEGIN
    UPDATE pedidos SET Estado = 'Completado' WHERE idPedido = @idPedido;
END;
GO

CREATE PROCEDURE sp_CrearTrabajador @Nom VARCHAR(45), @Con VARCHAR(100), @Rol INT AS
BEGIN
    INSERT INTO trabajadores (Nombre, Contra, RolTrabajadores_idRolTrabajadores) VALUES (@Nom, @Con, @Rol);
END;
GO

-- 4. TRIGGERS (Tus triggers están bien, solo asegúrate de que se creen aquí)
-- [Aquí van todos tus triggers de Logs y Reservaciones]
GO

-- 5. SEGURIDAD (AL FINAL)
USE master; 
GO
CREATE LOGIN admin_login WITH PASSWORD = 'Admin123!';
CREATE LOGIN mesero_login WITH PASSWORD = 'Mesero123!';
CREATE LOGIN cocina_login WITH PASSWORD = 'Cocina123!';
GO

USE DEMS; 
GO
CREATE USER admin_user FOR LOGIN admin_login;
CREATE USER mesero_user FOR LOGIN mesero_login;
CREATE USER cocina_user FOR LOGIN cocina_login;
GO

CREATE ROLE rol_admin; GRANT CONTROL TO rol_admin;
CREATE ROLE rol_mesero;
GRANT SELECT ON Platillos TO rol_mesero;
GRANT SELECT, INSERT ON reservaciones TO rol_mesero;
GRANT SELECT, INSERT, UPDATE ON pedidos TO rol_mesero;
GRANT SELECT, INSERT ON detallespedido TO rol_mesero;
GRANT SELECT, INSERT ON pagos TO rol_mesero;
DENY SELECT ON trabajadores(Contra) TO rol_mesero;

CREATE ROLE rol_cocina;
GRANT SELECT ON pedidos TO rol_cocina;
GRANT SELECT ON detallespedido TO rol_cocina;
GRANT EXECUTE ON sp_FinalizarPedido TO rol_cocina;

ALTER ROLE rol_admin ADD MEMBER admin_user;
ALTER ROLE rol_mesero ADD MEMBER mesero_user;
ALTER ROLE rol_cocina ADD MEMBER cocina_user;

GRANT EXECUTE ON sp_LoginTrabajador TO rol_mesero, rol_cocina, rol_admin;
GRANT EXECUTE ON sp_RegistrarPedido TO rol_mesero, rol_admin;
GRANT EXECUTE ON sp_CrearTrabajador TO rol_admin;
GO