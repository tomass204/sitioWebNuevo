# Manual de Usuario - Gaming Hub Product Microservice

## Introducción
Este manual describe cómo interactuar con el microservicio de productos de Gaming Hub, que permite gestionar productos y órdenes de compra.

## Roles de Usuario

### Administrador
- Acceso completo a todas las funciones
- Puede crear, editar y eliminar productos
- Puede gestionar todas las órdenes

### Vendedor
- Puede ver la lista de productos y detalles
- Puede ver la lista de órdenes y detalles
- No puede modificar productos u órdenes

### Cliente
- Puede ver productos disponibles
- Puede crear órdenes de compra
- Solo acceso a la "tienda"

## Uso de la API

### Autenticación
Para acceder a funciones protegidas, incluya el token JWT en el header Authorization:
```
Authorization: Bearer <token>
```

### Endpoints Principales

#### Ver Productos
- **URL**: GET /v1/productos
- **Descripción**: Muestra todos los productos disponibles
- **Acceso**: Público

#### Crear Orden
- **URL**: POST /v1/ordenes
- **Descripción**: Crea una nueva orden de compra
- **Cuerpo de la petición**:
```json
{
  "usuarioId": 1,
  "productoIds": [1, 2, 3],
  "total": 59.99,
  "estado": "PENDIENTE"
}
```
- **Acceso**: Cliente/Administrador

#### Ver Órdenes (Vendedor)
- **URL**: GET /v1/ordenes
- **Descripción**: Lista todas las órdenes
- **Acceso**: Vendedor/Administrador

## Pantallazos

### 1. Lista de Productos
[Insertar imagen mostrando la lista de productos en el frontend]

### 2. Detalle de Producto
[Insertar imagen mostrando el detalle de un producto]

### 3. Creación de Orden
[Insertar imagen mostrando el proceso de compra]

### 4. Lista de Órdenes (Vendedor)
[Insertar imagen mostrando las órdenes para el vendedor]

## Solución de Problemas

### Error 401 Unauthorized
- Verifique que su token JWT sea válido y no haya expirado
- Asegúrese de tener los permisos necesarios para la acción

### Error 404 Not Found
- Verifique que el ID del producto/orden sea correcto
- Asegúrese de que el recurso exista

### Error 500 Internal Server Error
- Contacte al administrador del sistema
- Verifique la conectividad con la base de datos

## Contacto
Para soporte técnico, contacte al equipo de desarrollo.
