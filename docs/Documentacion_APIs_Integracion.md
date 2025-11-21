# Documentación APIs e Integración
## Sistema de E-commerce

---

**Título:** Documentación de API para Gestión de Productos y Órdenes  
**Versión del Documento:** 1.0  
**Fecha de Creación:** 2024

---

## Descripción General

Este documento proporciona una descripción detallada de los endpoints de la API diseñados para gestionar productos y órdenes dentro de la aplicación de e-commerce. Está dirigido a desarrolladores y administradores de sistemas que interactúan con nuestra base de datos.

## Información General

- **URL de la API Base:** `http://localhost:8082`
- **URL Swagger:** `http://localhost:8082/swagger-ui/index.html`
- **Base de Datos:** MySQL (db_Product)

---

## Documentación de Endpoints

### Endpoint de Productos v1

#### GET /v1/productos

- **Descripción:** Lista todos los productos activos disponibles en la tienda.
- **Método:** GET
- **Autenticación:** No requerida (acceso público)
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 500 (Error del servidor)
- **Observaciones:** Solo retorna productos con estado activo.

**Ejemplo de Respuesta:**
```json
[
  {
    "productoId": 1,
    "nombre": "Laptop Gaming",
    "descripcion": "Laptop de alto rendimiento para gaming",
    "precio": 999.99,
    "categoria": "Electrónica",
    "imagenUrl": "https://example.com/laptop.jpg",
    "activo": true
  }
]
```

#### GET /v1/productos/{id}

- **Descripción:** Obtiene un producto específico por su ID.
- **Método:** GET
- **Parámetros:** 
  - `id` (Path): ID del producto
- **Autenticación:** No requerida
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 404 (No encontrado)

#### POST /v1/productos

- **Descripción:** Crea un nuevo producto en el sistema.
- **Método:** POST
- **Autenticación:** Sí (Admin)
- **Datos de Entrada:**
```json
{
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del producto",
  "precio": 99.99,
  "categoria": "Categoría",
  "imagenUrl": "https://example.com/image.jpg",
  "activo": true
}
```
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 400 (Datos inválidos), 401 (No autorizado)

#### PUT /v1/productos/{id}

- **Descripción:** Actualiza información de un producto existente.
- **Método:** PUT
- **Parámetros:**
  - `id` (Path): ID del producto
- **Autenticación:** Sí (Admin)
- **Datos de Entrada:** Mismo formato que POST
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 400 (Datos inválidos), 404 (No encontrado), 401 (No autorizado)

#### DELETE /v1/productos/{id}

- **Descripción:** Elimina (desactiva) un producto del sistema.
- **Método:** DELETE
- **Parámetros:**
  - `id` (Path): ID del producto
- **Autenticación:** Sí (Admin)
- **Respuesta Exitosa:** 204 (Sin contenido)
- **Respuesta de Error:** 404 (No encontrado), 401 (No autorizado)

#### GET /v1/productos/categoria/{categoria}

- **Descripción:** Obtiene productos filtrados por categoría.
- **Método:** GET
- **Parámetros:**
  - `categoria` (Path): Nombre de la categoría
- **Autenticación:** No requerida
- **Respuesta Exitosa:** 200 (Éxito)

#### GET /v1/productos/search?nombre={nombre}

- **Descripción:** Busca productos por nombre (búsqueda parcial).
- **Método:** GET
- **Parámetros:**
  - `nombre` (Query): Texto a buscar
- **Autenticación:** No requerida
- **Respuesta Exitosa:** 200 (Éxito)

---

### Endpoint de Productos v2

#### GET /v2/productos

- **Descripción:** Lista todos los productos con estadísticas detalladas.
- **Método:** GET
- **Autenticación:** No requerida
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 500 (Error del servidor)
- **Observaciones:** Versión mejorada con información adicional.

#### PUT /v2/productos/{id}

- **Descripción:** Actualiza información de un producto con validaciones mejoradas.
- **Método:** PUT
- **Parámetros:**
  - `id` (Path): ID del producto
- **Autenticación:** Sí (Admin)
- **Datos de Entrada:** Mismo formato que v1
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 400 (Datos inválidos), 404 (No encontrado), 401 (No autorizado)

---

### Endpoint de Órdenes v1

#### GET /v1/ordenes

- **Descripción:** Obtiene todas las órdenes del sistema.
- **Método:** GET
- **Autenticación:** Sí (Vendedor o Admin)
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 500 (Error del servidor), 401 (No autorizado)

**Ejemplo de Respuesta:**
```json
[
  {
    "ordenId": 1,
    "usuarioId": 123,
    "productoIds": [1, 2, 3],
    "fecha": "2024-01-15T10:30:00",
    "total": 1299.97,
    "estado": "PENDIENTE"
  }
]
```

#### GET /v1/ordenes/{id}

- **Descripción:** Obtiene una orden específica por su ID.
- **Método:** GET
- **Parámetros:**
  - `id` (Path): ID de la orden
- **Autenticación:** Sí (Vendedor o Admin)
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 404 (No encontrado), 401 (No autorizado)

#### POST /v1/ordenes

- **Descripción:** Crea una nueva orden.
- **Método:** POST
- **Autenticación:** Sí (Cliente o Admin)
- **Datos de Entrada:**
```json
{
  "usuarioId": 123,
  "productoIds": [1, 2, 3],
  "total": 1299.97,
  "estado": "PENDIENTE"
}
```
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 400 (Datos inválidos), 401 (No autorizado)

#### PUT /v1/ordenes/{id}

- **Descripción:** Actualiza una orden existente (principalmente el estado).
- **Método:** PUT
- **Parámetros:**
  - `id` (Path): ID de la orden
- **Autenticación:** Sí (Admin)
- **Datos de Entrada:** Mismo formato que POST
- **Respuesta Exitosa:** 200 (Éxito)
- **Respuesta de Error:** 400 (Datos inválidos), 404 (No encontrado), 401 (No autorizado)

#### DELETE /v1/ordenes/{id}

- **Descripción:** Elimina una orden del sistema.
- **Método:** DELETE
- **Parámetros:**
  - `id` (Path): ID de la orden
- **Autenticación:** Sí (Admin)
- **Respuesta Exitosa:** 204 (Sin contenido)
- **Respuesta de Error:** 404 (No encontrado), 401 (No autorizado)

#### GET /v1/ordenes/usuario/{usuarioId}

- **Descripción:** Obtiene todas las órdenes de un usuario específico.
- **Método:** GET
- **Parámetros:**
  - `usuarioId` (Path): ID del usuario
- **Autenticación:** Sí (Vendedor, Admin, o el mismo usuario)
- **Respuesta Exitosa:** 200 (Éxito)

#### GET /v1/ordenes/estado/{estado}

- **Descripción:** Obtiene órdenes filtradas por estado (PENDIENTE, COMPLETADA, CANCELADA).
- **Método:** GET
- **Parámetros:**
  - `estado` (Path): Estado de la orden
- **Autenticación:** Sí (Vendedor o Admin)
- **Respuesta Exitosa:** 200 (Éxito)

---

## Integración con el Frontend

### Verificación de Entrega

El frontend React interactúa con estos endpoints utilizando el servicio `fetch` de JavaScript. A continuación se describen las interacciones principales:

#### 1. Visualización de Productos (Cliente)

**Pantallazo 1: Lista de Productos**

Cuando el usuario (rol Cliente) accede a la tienda, se realiza una petición GET a `/v1/productos`:

```javascript
// Código del frontend
const productos = await ProductService.getAllProductos();
```

**Descripción:** La interfaz muestra una cuadrícula de productos con sus imágenes, nombres, precios y categorías. Cada producto tiene botones para "Ver Detalles" y "Agregar al Carrito".

**Respuesta Exitosa:** Se muestra la lista de productos en tarjetas visuales.

**Respuesta de Error:** Se muestra un mensaje de error indicando que no se pudieron cargar los productos.

---

#### 2. Visualización de Órdenes (Vendedor)

**Pantallazo 2: Lista de Órdenes**

Cuando el usuario (rol Vendedor) accede a la sección de órdenes, se realiza una petición GET a `/v1/ordenes`:

```javascript
// Código del frontend
const ordenes = await OrdenService.getAllOrdenes();
```

**Descripción:** La interfaz muestra una tabla con todas las órdenes, incluyendo ID, Usuario ID, Productos, Total, Fecha y Estado. El vendedor puede ver detalles de cada orden haciendo clic en "Ver".

**Respuesta Exitosa:** Se muestra la tabla con todas las órdenes.

**Respuesta de Error:** Se muestra un mensaje de error indicando que no se pudieron cargar las órdenes.

---

#### 3. Creación de Orden (Cliente)

**Pantallazo 3: Crear Orden desde Carrito**

Cuando el cliente tiene productos en el carrito y hace clic en "Crear Orden", se realiza una petición POST a `/v1/ordenes`:

```javascript
// Código del frontend
const ordenRequest = {
  usuarioId: currentUser.id,
  productoIds: cart.map(item => item.productoId),
  total: total,
  estado: 'PENDIENTE'
};
const orden = await OrdenService.createOrden(ordenRequest);
```

**Descripción:** Se muestra un modal de confirmación y luego se envía la orden al backend. Si es exitoso, se muestra un mensaje de éxito y se limpia el carrito.

**Respuesta Exitosa (201):** Se muestra mensaje "Orden creada exitosamente" y se limpia el carrito.

**Respuesta de Error (400/401):** Se muestra un mensaje de error indicando el problema.

---

#### 4. Gestión de Productos (Administrador)

**Pantallazo 4: Panel de Administración de Productos**

Cuando el administrador accede a la gestión de productos, puede:

- **Ver productos:** GET `/v1/productos`
- **Crear producto:** POST `/v1/productos`
- **Editar producto:** PUT `/v1/productos/{id}`
- **Eliminar producto:** DELETE `/v1/productos/{id}`

**Descripción:** La interfaz muestra una tabla con todos los productos y botones para crear, editar y eliminar. Al hacer clic en "Crear Producto", se abre un modal con un formulario.

**Ejemplo de creación:**
```javascript
const nuevoProducto = await ProductService.createProducto({
  nombre: "Nuevo Producto",
  descripcion: "Descripción",
  precio: 99.99,
  categoria: "Categoría",
  imagenUrl: "https://example.com/image.jpg",
  activo: true
});
```

**Respuesta Exitosa:** El producto se agrega a la tabla y se muestra un mensaje de éxito.

**Respuesta de Error:** Se muestra un mensaje de error con los detalles.

---

## Logs en Consola

Todos los movimientos del sistema se registran en la consola del navegador con el siguiente formato:

```
GET /v1/productos - Obteniendo todos los productos
GET /v1/productos - Status: 200 - Éxito
Productos obtenidos: 5

POST /v1/ordenes - Creando nueva orden
Parámetros: {usuarioId: 123, productoIds: [1,2], total: 199.98, estado: "PENDIENTE"}
POST /v1/ordenes - Status: 200 - Éxito
Orden creada: {ordenId: 1, ...}
```

---

## Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Los tokens se envían en el header `Authorization`:

```
Authorization: Bearer <token>
```

### Roles del Sistema

- **ADMIN:** Acceso total al sistema (gestión de productos y órdenes)
- **VENDEDOR:** Puede visualizar productos y órdenes, ver detalles
- **CLIENTE:** Solo puede acceder a la tienda y crear órdenes

---

## Notas Técnicas

1. **Versionado:** Las APIs están versionadas (v1, v2) para permitir evolución sin romper compatibilidad.
2. **Swagger:** La documentación interactiva está disponible en `/swagger-ui/index.html`
3. **CORS:** El backend está configurado para aceptar peticiones desde el frontend React.
4. **Base de Datos:** MySQL con JPA/Hibernate para el mapeo objeto-relacional.

---

## Ejemplos de Uso

### Ejemplo 1: Obtener todos los productos

```bash
curl -X GET http://localhost:8082/v1/productos
```

### Ejemplo 2: Crear un producto (requiere autenticación)

```bash
curl -X POST http://localhost:8082/v1/productos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Nuevo",
    "descripcion": "Descripción",
    "precio": 99.99,
    "categoria": "Categoría",
    "imagenUrl": "https://example.com/image.jpg",
    "activo": true
  }'
```

### Ejemplo 3: Crear una orden (requiere autenticación)

```bash
curl -X POST http://localhost:8082/v1/ordenes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": 123,
    "productoIds": [1, 2, 3],
    "total": 299.97,
    "estado": "PENDIENTE"
  }'
```

---

**Fin del Documento**

