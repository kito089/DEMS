# DEMS Backend

## Dinner Environment Management System API

<p align="center">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js">
  <img src="https://img.shields.io/badge/Microsoft%20SQL%20Server-CC2927?style=for-the-badge&logo=microsoft%20sql%20server&logoColor=white" alt="SQL Server">
  <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io">
  <img src="https://img.shields.io/badge/jwt-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript">
</p>

---

## Descripción del Proyecto

DEMS (Dinner Environment Management System) Backend constituye la capa de servicios del sistema integral diseñado para la cenaduría "Loma Bonita", establecimiento ubicado en Aguascalientes dedicado a la venta de alimentos típicos mexicanos. Este componente backend implementa una API REST desarrollada con Node.js y Express que gestiona toda la lógica de negocio del sistema.

La API administra trabajadores, reservaciones, platillos, pedidos, pagos y registros del sistema, proporcionando una estructura organizada y escalable que responde a los requisitos establecidos en el documento de Especificación de Requisitos de Software según el estándar IEEE 830-1998.

El sistema opera con Microsoft SQL Server como motor de base de datos principal, almacenando y gestionando toda la información operativa del negocio de manera local, tal como se especifica en las restricciones del proyecto. La comunicación en tiempo real para la sincronización de pedidos entre meseros y cocina se implementa mediante Socket.io, garantizando la actualización inmediata de los estados.

---

## Arquitectura del Sistema

El backend sigue una arquitectura modular por capas dentro del directorio src, separando claramente las responsabilidades y facilitando el mantenimiento y la escalabilidad del sistema. Esta organización responde a los requisitos de diseño establecidos en la sección 3.4 del documento ERS.

```
src/
 ├── controllers/     # Gestionan solicitudes y respuestas HTTP
 ├── repositories/    # Implementan consultas T-SQL a SQL Server
 ├── routes/          # Definen los endpoints REST
 ├── middleware/      # Autenticación, validación y manejo de errores
 ├── sockets/         # Configuración de comunicación en tiempo real
 └── app.js           # Configuración principal de la aplicación
```

La capa de rutas define los endpoints REST siguiendo una nomenclatura coherente. Los controladores procesan las solicitudes entrantes, validan los datos y generan las respuestas HTTP correspondientes. Los repositorios encapsulan toda la lógica de interacción con SQL Server mediante consultas T-SQL parametrizadas, garantizando la seguridad y el rendimiento del acceso a datos.

La comunicación en tiempo real se gestiona a través del módulo de sockets, que implementa la sincronización inmediata de pedidos entre los diferentes dispositivos conectados a la red local del establecimiento.

---

## Entidades Implementadas

La API incluye operaciones completas de creación, lectura, actualización y eliminación para todas las entidades identificadas en el modelo de datos del sistema, que corresponde al diagrama de base de datos presentado en el apéndice del documento ERS.

- **Trabajadores y Roles**: Gestión de usuarios del sistema con diferenciación por roles (Administrador, Mesero, Personal de Cocina), implementando los requisitos funcionales RF1 a RF5 del módulo de autenticación. Las contraseñas se almacenan mediante cifrado hashing, cumpliendo con los atributos de seguridad establecidos.

- **Reservaciones**: Administración completa de reservaciones de clientes según fecha y cantidad de personas, correspondiente a los requisitos RF6 a RF11. Incluye la generación de recordatorios automáticos.

- **Platillos y Categorías**: Control del menú con clasificación por categorías (bebidas, alimentos), dando cumplimiento a los requisitos RF21 a RF25.

- **Pedidos y Detalles de Pedido**: Gestión de pedidos con capacidad de agregar, editar y eliminar productos, así como registrar notas especiales por producto, atendiendo los requisitos RF12 a RF20. El módulo de sockets permite la actualización en tiempo real de los estados de pedido.

- **Tipos de Pago y Pagos**: Registro de transacciones con soporte para múltiples métodos de pago (efectivo, tarjeta, transferencia, pago mixto) y capacidad de dividir cuentas por cliente, conforme a los requisitos RF26 a RF30. El cálculo automático de totales se realiza en el backend.

- **Logs del Sistema**: Registro de operaciones realizadas por los usuarios para facilitar la auditoría y el historial de cambios, dando soporte al requisito RF34.

Todos los endpoints han sido probados utilizando Postman y mantienen una estructura REST coherente bajo el prefijo /api, asegurando la verificabilidad y trazabilidad exigidas por el estándar IEEE 830.

---

## Conexión con SQL Server

El backend establece conexión directa con Microsoft SQL Server mediante el paquete mssql, implementando un pool de conexiones optimizado para el entorno local. La configuración de conexión considera los siguientes parámetros:

- Servidor local con autenticación integrada de Windows
- Base de datos correspondiente al esquema presentado en el diagrama de BD
- Pool de conexiones con límites definidos para garantizar el rendimiento
- Consultas parametrizadas para prevenir inyección SQL

Los repositorios implementan procedimientos almacenados y consultas T-SQL optimizadas que reflejan fielmente las relaciones establecidas en el modelo entidad-relación del sistema. La base de datos opera de manera exclusivamente local, sin dependencia de servicios en la nube, cumpliendo con las restricciones de infraestructura definidas en el proyecto.

---

## Comunicación en Tiempo Real

La sincronización inmediata entre la toma de pedido (meseros) y la visualización en pantalla (cocina) se implementa mediante Socket.io, respondiendo al requisito RF16 del sistema. Esta capa de comunicación permite:

- Actualización instantánea del estado de los pedidos (Pendiente, Listo)
- Notificaciones en tiempo real a los dispositivos correspondientes
- Sincronización de cambios sin necesidad de recargar las interfaces

El tiempo de respuesta para las actualizaciones de estado se mantiene por debajo de los 2 segundos en la red local, cumpliendo con el requisito de rendimiento RNF1 establecido en la especificación.

---

## Instalación y Ejecución

El backend requiere Node.js y SQL Server para su ejecución. Los pasos para poner en funcionamiento el servicio son los siguientes:

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Acceder al directorio del proyecto
cd dems-backend

# Instalar las dependencias
npm install

# Configurar variables de entorno
# Editar el archivo .env con los parámetros de conexión a SQL Server

# Iniciar el servidor
npm start

# Modo desarrollo con recarga automática
npm run dev
```

El servidor se ejecuta en el puerto 3000 por defecto. Los endpoints de la API estarán disponibles en:

```
http://localhost:3000/api
```

La conexión a SQL Server debe estar configurada previamente con el esquema de base de datos implementado según el diagrama incluido en el apéndice del documento ERS.

---

## Seguridad y Autenticación

El sistema implementa un módulo de autenticación obligatorio basado en JSON Web Tokens (JWT), cumpliendo con los requisitos de seguridad establecidos en la sección 3.5 del documento ERS.

- Las contraseñas se almacenan utilizando algoritmos de hashing seguros
- El acceso a los endpoints está restringido según el rol del usuario
- Los tokens JWT tienen un tiempo de expiración definido
- Las operaciones críticas requieren verificación de permisos

El middleware de autenticación intercepta todas las solicitudes y valida la identidad del usuario antes de permitir el acceso a los recursos protegidos, garantizando que cada usuario solo pueda visualizar y modificar la información correspondiente a sus funciones.

---

## Integración con el Sistema Completo

El backend se comunica con los frontends (aplicación móvil para meseros y aplicación web/escritorio para cocina y administración) mediante protocolos HTTP y WebSockets, cumpliendo con lo especificado en la sección de protocolos de comunicación del documento ERS.

La aplicación móvil, desarrollada con Ionic/Capacitor y Angular, consume los endpoints de esta API para la toma de pedidos y gestión de mesas. La interfaz de escritorio, también desarrollada con Angular, utiliza los mismos servicios para la visualización de pedidos en cocina y la generación de reportes.

Ambos frontends se conectan al mismo servidor de sockets para recibir actualizaciones en tiempo real, asegurando la consistencia de la información en todos los dispositivos del establecimiento.

---

## Estado del Proyecto

El backend se encuentra completamente funcional en su entorno de producción, operando con Microsoft SQL Server como motor de base de datos definitivo. La arquitectura implementada sigue fielmente las especificaciones establecidas en el documento de requisitos, incluyendo la separación de la lógica de negocio de la interfaz de usuario y la implementación de comunicación en tiempo real mediante sockets.

Los requisitos funcionales identificados en la sección 3.2 del documento ERS han sido implementados en su totalidad a nivel de backend. Los atributos de seguridad, mantenibilidad y usabilidad han sido considerados en el diseño de la API, con contraseñas cifradas, código documentado y gestión mediante Git/GitHub para permitir actualizaciones futuras.

El sistema soporta al menos 10 conexiones simultáneas en la red local sin degradación del rendimiento, cumpliendo con el requisito de capacidad RNF2, y opera con disponibilidad completa mientras la red LAN y el servidor local permanezcan activos.

---

<p align="center">
  <strong>Universidad Tecnológica de Aguascalientes</strong><br>
  Tecnologías de la Información Área de Desarrollo de Software Multiplataforma<br>
  Estándares y Métricas para el Desarrollo de Software - Parcial 2
</p>

<p align="center">
  <strong>Desarrollado por:</strong> Yeraldin Alexandra Corral Rodriguez, Carlos Santiago Delgado Oliva, Aarón Huerta Rodríguez, Julio Enrique Zariñán Rodríguez
</p>
