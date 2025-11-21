# Especificación de Requerimientos del Sistema (ERS)
## Sistema de E-commerce

---

**Versión:** 1.0  
**Fecha:** 2024  
**Proyecto:** Sistema de E-commerce con Spring Boot y React

---

## 1. Introducción

### 1.1 Propósito del Documento

Este documento especifica los requerimientos funcionales y no funcionales del sistema de e-commerce desarrollado con Spring Boot (backend) y React (frontend), incluyendo la gestión de productos, órdenes y usuarios con diferentes roles.

### 1.2 Alcance del Proyecto

El sistema permite:
- Gestión de productos (CRUD)
- Gestión de órdenes de compra
- Autenticación y autorización basada en roles
- Interfaz de usuario diferenciada según el rol
- Comunicación REST entre frontend y backend

### 1.3 Definiciones, Acrónimos y Abreviaciones

- **ERS:** Especificación de Requerimientos del Sistema
- **API:** Application Programming Interface
- **REST:** Representational State Transfer
- **JWT:** JSON Web Token
- **CRUD:** Create, Read, Update, Delete
- **JPA:** Java Persistence API
- **Hibernate:** Framework de mapeo objeto-relacional

---

## 2. Descripción General

### 2.1 Perspectiva del Producto

El sistema es una aplicación web de e-commerce que permite a diferentes tipos de usuarios interactuar con productos y órdenes según sus permisos.

### 2.2 Funciones del Producto

- **Gestión de Productos:** Crear, leer, actualizar y eliminar productos
- **Gestión de Órdenes:** Crear y gestionar órdenes de compra
- **Autenticación:** Sistema de login y registro con JWT
- **Autorización:** Control de acceso basado en roles
- **Interfaz de Usuario:** Vistas diferenciadas según el rol del usuario

### 2.3 Características del Usuario

El sistema está dirigido a tres tipos de usuarios:

1. **Administrador:** Acceso total al sistema
2. **Vendedor:** Puede visualizar productos y órdenes
3. **Cliente:** Solo puede acceder a la tienda y realizar compras

### 2.4 Restricciones

- El backend debe estar ejecutándose en el puerto 8082
- La base de datos debe ser MySQL
- El frontend requiere un navegador moderno con soporte para ES6+
- Se requiere conexión a internet para cargar recursos externos

---

## 3. Requerimientos Funcionales

### 3.1 Gestión de Productos

#### RF-001: Listar Productos
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir listar todos los productos activos disponibles.
- **Entrada:** Ninguna (o filtros opcionales)
- **Salida:** Lista de productos con sus detalles
- **Procesamiento:** Consulta a la base de datos filtrando productos activos

#### RF-002: Ver Detalle de Producto
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir ver los detalles completos de un producto específico.
- **Entrada:** ID del producto
- **Salida:** Información completa del producto
- **Procesamiento:** Búsqueda del producto por ID

#### RF-003: Crear Producto
- **Prioridad:** Alta
- **Descripción:** Solo los administradores pueden crear nuevos productos.
- **Entrada:** Datos del producto (nombre, descripción, precio, categoría, imagen)
- **Salida:** Producto creado con ID asignado
- **Procesamiento:** Validación de datos y persistencia en base de datos

#### RF-004: Actualizar Producto
- **Prioridad:** Alta
- **Descripción:** Solo los administradores pueden actualizar productos existentes.
- **Entrada:** ID del producto y datos actualizados
- **Salida:** Producto actualizado
- **Procesamiento:** Validación y actualización en base de datos

#### RF-005: Eliminar Producto
- **Prioridad:** Media
- **Descripción:** Solo los administradores pueden eliminar (desactivar) productos.
- **Entrada:** ID del producto
- **Salida:** Confirmación de eliminación
- **Procesamiento:** Cambio de estado activo a inactivo

#### RF-006: Buscar Productos
- **Prioridad:** Media
- **Descripción:** El sistema debe permitir buscar productos por nombre.
- **Entrada:** Texto de búsqueda
- **Salida:** Lista de productos que coinciden con la búsqueda
- **Procesamiento:** Búsqueda parcial en el nombre del producto

#### RF-007: Filtrar por Categoría
- **Prioridad:** Media
- **Descripción:** El sistema debe permitir filtrar productos por categoría.
- **Entrada:** Nombre de la categoría
- **Salida:** Lista de productos de la categoría especificada
- **Procesamiento:** Filtrado por categoría en base de datos

---

### 3.2 Gestión de Órdenes

#### RF-008: Listar Órdenes
- **Prioridad:** Alta
- **Descripción:** Vendedores y administradores pueden ver todas las órdenes.
- **Entrada:** Ninguna
- **Salida:** Lista de órdenes con sus detalles
- **Procesamiento:** Consulta a la base de datos

#### RF-009: Ver Detalle de Orden
- **Prioridad:** Alta
- **Descripción:** Vendedores y administradores pueden ver los detalles de una orden específica.
- **Entrada:** ID de la orden
- **Salida:** Información completa de la orden
- **Procesamiento:** Búsqueda de la orden por ID

#### RF-010: Crear Orden
- **Prioridad:** Alta
- **Descripción:** Clientes y administradores pueden crear nuevas órdenes.
- **Entrada:** Datos de la orden (usuario, productos, total)
- **Salida:** Orden creada con ID asignado
- **Procesamiento:** Validación y persistencia en base de datos

#### RF-011: Actualizar Orden
- **Prioridad:** Media
- **Descripción:** Solo los administradores pueden actualizar órdenes (principalmente el estado).
- **Entrada:** ID de la orden y datos actualizados
- **Salida:** Orden actualizada
- **Procesamiento:** Validación y actualización en base de datos

#### RF-012: Eliminar Orden
- **Prioridad:** Baja
- **Descripción:** Solo los administradores pueden eliminar órdenes.
- **Entrada:** ID de la orden
- **Salida:** Confirmación de eliminación
- **Procesamiento:** Eliminación de la orden en base de datos

#### RF-013: Filtrar Órdenes por Usuario
- **Prioridad:** Media
- **Descripción:** El sistema debe permitir ver las órdenes de un usuario específico.
- **Entrada:** ID del usuario
- **Salida:** Lista de órdenes del usuario
- **Procesamiento:** Filtrado por usuario en base de datos

#### RF-014: Filtrar Órdenes por Estado
- **Prioridad:** Media
- **Descripción:** El sistema debe permitir filtrar órdenes por estado (PENDIENTE, COMPLETADA, CANCELADA).
- **Entrada:** Estado de la orden
- **Salida:** Lista de órdenes con el estado especificado
- **Procesamiento:** Filtrado por estado en base de datos

---

### 3.3 Autenticación y Autorización

#### RF-015: Login de Usuario
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir a los usuarios iniciar sesión.
- **Entrada:** Email y contraseña
- **Salida:** Token JWT y información del usuario
- **Procesamiento:** Validación de credenciales y generación de token

#### RF-016: Registro de Usuario
- **Prioridad:** Alta
- **Descripción:** El sistema debe permitir registrar nuevos usuarios.
- **Entrada:** Datos del usuario (email, contraseña, nombre, rol)
- **Salida:** Usuario creado y token JWT
- **Procesamiento:** Validación, hash de contraseña y persistencia

#### RF-017: Control de Acceso por Roles
- **Prioridad:** Alta
- **Descripción:** El sistema debe restringir el acceso a funciones según el rol del usuario.
- **Roles:**
  - **ADMIN:** Acceso total
  - **VENDEDOR:** Ver productos y órdenes
  - **CLIENTE:** Solo tienda
- **Procesamiento:** Validación de roles en cada endpoint

---

### 3.4 Interfaz de Usuario

#### RF-018: Vista de Cliente
- **Prioridad:** Alta
- **Descripción:** Los clientes solo deben ver la tienda de productos.
- **Funcionalidades:**
  - Ver lista de productos
  - Ver detalles de productos
  - Agregar productos al carrito
  - Crear órdenes

#### RF-019: Vista de Vendedor
- **Prioridad:** Alta
- **Descripción:** Los vendedores deben ver productos y órdenes.
- **Funcionalidades:**
  - Ver lista de productos
  - Ver detalles de productos
  - Ver lista de órdenes
  - Ver detalles de órdenes

#### RF-020: Vista de Administrador
- **Prioridad:** Alta
- **Descripción:** Los administradores tienen acceso a todas las funciones.
- **Funcionalidades:**
  - Gestión completa de productos (CRUD)
  - Gestión completa de órdenes (CRUD)
  - Ver todas las órdenes

---

## 4. Requerimientos No Funcionales

### 4.1 Rendimiento

- **RNF-001:** Las consultas a la base de datos deben completarse en menos de 2 segundos.
- **RNF-002:** La interfaz de usuario debe responder a las acciones del usuario en menos de 500ms.

### 4.2 Seguridad

- **RNF-003:** Las contraseñas deben almacenarse con hash (SHA-256 o superior).
- **RNF-004:** Las comunicaciones deben usar JWT para autenticación.
- **RNF-005:** Los endpoints deben validar los roles antes de permitir el acceso.

### 4.3 Usabilidad

- **RNF-006:** La interfaz debe ser intuitiva y fácil de usar.
- **RNF-007:** Los mensajes de error deben ser claros y descriptivos.

### 4.4 Compatibilidad

- **RNF-008:** El sistema debe funcionar en los navegadores modernos (Chrome, Firefox, Edge, Safari).
- **RNF-009:** El backend debe ser compatible con Java 17 o superior.

### 4.5 Mantenibilidad

- **RNF-010:** El código debe seguir buenas prácticas y estar documentado.
- **RNF-011:** Las APIs deben estar versionadas (v1, v2) para facilitar la evolución.

### 4.6 Documentación

- **RNF-012:** El sistema debe incluir documentación de APIs (Swagger).
- **RNF-013:** Debe existir documentación de integración con ejemplos.

---

## 5. Modelo de Datos

### 5.1 Entidad: Producto

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| productoId | Long | Identificador único | PK, Auto-incremento |
| nombre | String | Nombre del producto | Requerido, No nulo |
| descripcion | String | Descripción del producto | Opcional, Max 1000 caracteres |
| precio | BigDecimal | Precio del producto | Requerido, No nulo |
| categoria | String | Categoría del producto | Opcional |
| imagenUrl | String | URL de la imagen | Opcional |
| activo | Boolean | Estado del producto | Requerido, Default: true |

### 5.2 Entidad: Orden

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| ordenId | Long | Identificador único | PK, Auto-incremento |
| usuarioId | Long | ID del usuario | Requerido, No nulo |
| productoIds | List<Long> | Lista de IDs de productos | Requerido |
| fecha | LocalDateTime | Fecha de la orden | Requerido, Auto-generado |
| total | BigDecimal | Total de la orden | Requerido, No nulo |
| estado | String | Estado de la orden | Requerido, Valores: PENDIENTE, COMPLETADA, CANCELADA |

### 5.3 Entidad: Usuario

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | Long | Identificador único | PK, Auto-incremento |
| username | String | Nombre de usuario | Requerido, Único |
| email | String | Correo electrónico | Requerido, Único |
| password | String | Contraseña (hasheada) | Requerido |
| roles | Set<Role> | Roles del usuario | Requerido |

---

## 6. Arquitectura del Sistema

### 6.1 Backend (Spring Boot)

- **Microservicio de Productos:** Puerto 8082
- **Microservicio de Autenticación:** Puerto 8081
- **Base de Datos:** MySQL
- **Seguridad:** Spring Security con JWT
- **Documentación:** Swagger/OpenAPI

### 6.2 Frontend (React)

- **Framework:** React 18
- **Librerías:** React Bootstrap, Axios/Fetch
- **Estado:** Context API
- **Rutas:** React Router (si aplica)

### 6.3 Comunicación

- **Protocolo:** HTTP/HTTPS
- **Formato:** JSON
- **Autenticación:** JWT en header Authorization

---

## 7. Casos de Uso

### 7.1 Caso de Uso: Cliente compra productos

**Actor:** Cliente  
**Precondiciones:** Usuario autenticado con rol CLIENTE  
**Flujo Principal:**
1. Cliente accede a la tienda
2. Cliente visualiza lista de productos
3. Cliente selecciona productos y los agrega al carrito
4. Cliente crea una orden
5. Sistema valida y crea la orden
6. Sistema muestra confirmación

**Flujo Alternativo:**
- Si no hay productos disponibles, se muestra mensaje informativo
- Si hay error al crear la orden, se muestra mensaje de error

**Postcondiciones:** Orden creada en estado PENDIENTE

---

### 7.2 Caso de Uso: Vendedor visualiza órdenes

**Actor:** Vendedor  
**Precondiciones:** Usuario autenticado con rol VENDEDOR  
**Flujo Principal:**
1. Vendedor accede a la sección de órdenes
2. Sistema muestra lista de todas las órdenes
3. Vendedor puede ver detalles de cada orden
4. Vendedor puede filtrar por estado

**Postcondiciones:** Vendedor tiene visibilidad de todas las órdenes

---

### 7.3 Caso de Uso: Administrador gestiona productos

**Actor:** Administrador  
**Precondiciones:** Usuario autenticado con rol ADMIN  
**Flujo Principal:**
1. Administrador accede a gestión de productos
2. Administrador puede crear, editar o eliminar productos
3. Sistema valida los datos
4. Sistema persiste los cambios
5. Sistema muestra confirmación

**Postcondiciones:** Productos actualizados en la base de datos

---

## 8. Herramientas y Tecnologías

### 8.1 Backend

- **Framework:** Spring Boot 3.x
- **Lenguaje:** Java 17+
- **Base de Datos:** MySQL 8.0
- **ORM:** JPA/Hibernate
- **Seguridad:** Spring Security + JWT
- **Documentación:** Swagger/OpenAPI 3
- **Build Tool:** Maven

### 8.2 Frontend

- **Framework:** React 18
- **Lenguaje:** TypeScript
- **UI Library:** React Bootstrap
- **HTTP Client:** Fetch API
- **Build Tool:** Vite

### 8.3 Base de Datos

- **SGBD:** MySQL
- **Puerto:** 3306
- **Nombre BD:** db_Product

---

## 9. Criterios de Aceptación

### 9.1 Funcionalidad

- ✅ Todos los endpoints REST funcionan correctamente
- ✅ La autenticación y autorización funcionan según los roles
- ✅ Las vistas se muestran correctamente según el rol del usuario
- ✅ Los logs en consola muestran los movimientos del sistema

### 9.2 Documentación

- ✅ Documentación de APIs completa
- ✅ Documentación de integración con ejemplos
- ✅ Swagger configurado y accesible
- ✅ Manual de usuario disponible

### 9.3 Calidad

- ✅ Código bien estructurado y documentado
- ✅ Sin errores de compilación
- ✅ Pruebas básicas funcionando

---

**Fin del Documento ERS**
