# Pruebas de Integración - Sistema E-commerce

## 🧪 Guía de Pruebas Completas

Este documento describe cómo probar la integración completa entre el frontend y los microservicios.

---

## 📋 Pre-requisitos

1. **MySQL corriendo** con las bases de datos creadas:
   - `db_Product`
   - `db_Game`
   - `ecommerce_db` (para auth-service)
   - `db_usuarios` (para Usuarios service)

2. **Microservicios corriendo:**
   - Product Service (puerto 8082)
   - Game Service (puerto 8090)
   - Auth Service (puerto 8081) o Usuarios Service (puerto 8081)

3. **Frontend corriendo:**
   - React app en `http://localhost:5173`

---

## ✅ Prueba 1: Autenticación y Registro

### 1.1 Registro de Usuario

**Pasos:**
1. Abre el navegador en `http://localhost:5173`
2. Abre la consola del navegador (F12)
3. Haz clic en "Registrarse"
4. Completa el formulario:
   - Email: `cliente@test.com`
   - Contraseña: `password123`
   - Nombre: `Cliente Test`
   - Rol: `CLIENTE`
5. Haz clic en "Registrarse"

**Resultado Esperado en Consola:**
```
POST /api/auth/register - Registrando usuario
Parámetros: Nombre de usuario: Cliente Test, Correo electrónico: cliente@test.com, Contraseña: ********, Rol: CLIENTE
POST /api/auth/register - Status: 201 - Éxito
ID: X, Nombre de usuario: Cliente Test, Correo electrónico: cliente@test.com, Contraseña: ********, Rol: CLIENTE
```

**Verificación:**
- ✅ Usuario creado en la base de datos
- ✅ Token guardado en localStorage
- ✅ Redirección a la vista principal

### 1.2 Login de Usuario

**Pasos:**
1. Cierra sesión si estás logueado
2. Ingresa:
   - Email: `cliente@test.com`
   - Contraseña: `password123`
3. Haz clic en "Iniciar Sesión"

**Resultado Esperado en Consola:**
```
POST /api/auth/login - Iniciando sesión
Parámetros: Correo electrónico: cliente@test.com, Contraseña: ********
POST /api/auth/login - Status: 200 - Éxito
Token recibido: eyJhbGciOiJIUzI1NiIs...
```

**Verificación:**
- ✅ Token guardado en localStorage
- ✅ Usuario autenticado
- ✅ Vista según rol mostrada

---

## ✅ Prueba 2: Visualización de Productos (Cliente)

### 2.1 Ver Lista de Productos

**Pasos:**
1. Inicia sesión como CLIENTE
2. Haz clic en "Tienda"
3. Observa la consola

**Resultado Esperado en Consola:**
```
GET /v1/productos - Obteniendo todos los productos
GET /v1/productos - Status: 200 - Éxito
Productos obtenidos: X
```

**Verificación:**
- ✅ Lista de productos mostrada
- ✅ Imágenes cargadas
- ✅ Precios y categorías visibles

### 2.2 Ver Detalle de Producto

**Pasos:**
1. En la vista de Tienda, haz clic en "Ver Detalles" de cualquier producto
2. Observa el modal

**Resultado Esperado:**
- ✅ Modal muestra:
  - Imagen del producto
  - Nombre completo
  - Descripción completa
  - Categoría
  - Precio
  - Estado (Disponible/No disponible)

---

## ✅ Prueba 3: Compra de Productos (Flujo Completo)

### 3.1 Agregar Producto al Carrito

**Pasos:**
1. En la vista de Tienda, haz clic en "Agregar al Carrito" de un producto
2. Observa la consola

**Resultado Esperado en Consola:**
```
POST /cart - Agregando producto al carrito
Producto ID: 1, Nombre: Laptop Gaming, Precio: 999.99
POST /cart - Status: 200 - Producto agregado exitosamente
```

**Verificación:**
- ✅ Producto agregado al carrito
- ✅ Botón cambia a "En Carrito"
- ✅ Contador de carrito actualizado

### 3.2 Ver Carrito

**Pasos:**
1. Haz clic en "Carrito" en el menú
2. Observa la consola

**Resultado Esperado en Consola:**
```
GET /cart - Obteniendo carrito del usuario
GET /v1/productos - Obteniendo todos los productos
GET /v1/productos - Status: 200 - Éxito
Productos obtenidos: X
GET /cart - Status: 200 - Éxito
Productos en carrito: 1
```

**Verificación:**
- ✅ Productos del carrito mostrados
- ✅ Precios correctos
- ✅ Cantidades visibles
- ✅ Total calculado correctamente

### 3.3 Modificar Cantidad

**Pasos:**
1. En el carrito, haz clic en "+" para aumentar cantidad
2. Observa la consola

**Resultado Esperado en Consola:**
```
PUT /cart/1/quantity - Aumentando cantidad
PUT /cart - Status: 200 - Cantidad actualizada: 2
```

**Verificación:**
- ✅ Cantidad actualizada
- ✅ Total recalculado

### 3.4 Completar Compra

**Pasos:**
1. En el carrito, haz clic en "Proceder al Pago"
2. Completa el formulario de pago:
   - Número de tarjeta: `1234567890123456`
   - Fecha: `12/25`
   - CVV: `123`
   - Nombre: `Test User`
3. Haz clic en "Confirmar Pago"
4. Observa la consola

**Resultado Esperado en Consola:**
```
POST /v1/ordenes - Creando orden de compra
Parámetros: {
  usuarioId: 123,
  productoIds: [1, 2],
  total: 1999.98,
  estado: "PENDIENTE",
  paymentDetails: {
    cardNumber: "1234****",
    expiryDate: "12/25",
    cardholderName: "Test User"
  }
}
POST /v1/ordenes - Status: 200 - Orden creada exitosamente
Orden creada: {
  ordenId: 1,
  usuarioId: 123,
  productoIds: [1, 2],
  total: 1999.98,
  fecha: "2024-01-15T10:30:00",
  estado: "PENDIENTE"
}
```

**Verificación:**
- ✅ Orden creada en el backend
- ✅ Mensaje de confirmación mostrado
- ✅ Carrito limpiado
- ✅ Orden visible en "Mis Órdenes"

---

## ✅ Prueba 4: Vista de Vendedor

### 4.1 Ver Productos (Vendedor)

**Pasos:**
1. Inicia sesión como VENDEDOR
2. Haz clic en "Productos"
3. Observa la consola

**Resultado Esperado:**
- ✅ Lista de productos visible (solo lectura)
- ✅ No hay botones de crear/editar/eliminar

### 4.2 Ver Órdenes (Vendedor)

**Pasos:**
1. Como VENDEDOR, haz clic en "Órdenes"
2. Observa la consola

**Resultado Esperado en Consola:**
```
GET /v1/ordenes - Obteniendo todas las órdenes
GET /v1/ordenes - Status: 200 - Éxito
Órdenes obtenidas: X
```

**Verificación:**
- ✅ Tabla de órdenes mostrada
- ✅ Todas las órdenes visibles
- ✅ Detalles de cada orden accesibles
- ✅ No hay botón de editar (solo Admin puede editar)

---

## ✅ Prueba 5: Vista de Administrador

### 5.1 Gestión de Productos (Admin)

**Pasos:**
1. Inicia sesión como ADMIN
2. Haz clic en "Productos"
3. Observa la consola

**Resultado Esperado:**
- ✅ Tabla de productos con opciones de gestión
- ✅ Botón "Crear Producto" visible
- ✅ Botones "Editar" y "Eliminar" en cada producto

### 5.2 Crear Producto (Admin)

**Pasos:**
1. Como ADMIN, haz clic en "Crear Producto"
2. Completa el formulario:
   - Nombre: `Producto Test`
   - Descripción: `Descripción del producto test`
   - Precio: `99.99`
   - Categoría: `Test`
   - URL Imagen: `https://example.com/image.jpg`
3. Haz clic en "Crear"
4. Observa la consola

**Resultado Esperado en Consola:**
```
POST /v1/productos - Creando nuevo producto
Parámetros: {
  nombre: "Producto Test",
  descripcion: "Descripción del producto test",
  precio: 99.99,
  categoria: "Test",
  imagenUrl: "https://example.com/image.jpg",
  activo: true
}
POST /v1/productos - Status: 200 - Éxito
Producto creado: {productoId: X, ...}
```

**Verificación:**
- ✅ Producto creado en el backend
- ✅ Producto visible en la lista
- ✅ Producto aparece en la tienda para clientes

### 5.3 Editar Orden (Admin)

**Pasos:**
1. Como ADMIN, ve a "Órdenes"
2. Haz clic en "Editar" de una orden
3. Cambia el estado a "COMPLETADA"
4. Haz clic en "Guardar"
5. Observa la consola

**Resultado Esperado en Consola:**
```
PUT /v1/ordenes/1 - Actualizando orden
Parámetros: {estado: "COMPLETADA", ...}
PUT /v1/ordenes/1 - Status: 200 - Éxito
Orden actualizada: {ordenId: 1, estado: "COMPLETADA", ...}
```

**Verificación:**
- ✅ Estado de orden actualizado
- ✅ Cambio visible en la tabla

---

## ✅ Prueba 6: Ver Mis Órdenes (Cliente)

**Pasos:**
1. Inicia sesión como CLIENTE
2. Haz clic en "Mis Órdenes"
3. Observa la consola

**Resultado Esperado en Consola:**
```
GET /v1/ordenes/usuario/123 - Obteniendo órdenes por usuario
GET /v1/ordenes/usuario/123 - Status: 200 - Éxito
Órdenes obtenidas: X
```

**Verificación:**
- ✅ Solo las órdenes del usuario actual mostradas
- ✅ Detalles de cada orden accesibles
- ✅ Estados visibles con badges de colores

---

## ✅ Prueba 7: Búsqueda y Filtros

### 7.1 Buscar Productos

**Pasos:**
1. En la vista de Tienda, usa la búsqueda (si existe)
2. O prueba directamente: `ProductService.searchProductos("Laptop")`
3. Observa la consola

**Resultado Esperado en Consola:**
```
GET /v1/productos/search?nombre=Laptop - Buscando productos
GET /v1/productos/search?nombre=Laptop - Status: 200 - Éxito
Productos encontrados: X
```

### 7.2 Filtrar por Categoría

**Pasos:**
1. Prueba: `ProductService.getProductosByCategoria("Electrónica")`
2. Observa la consola

**Resultado Esperado en Consola:**
```
GET /v1/productos/categoria/Electrónica - Obteniendo productos por categoría
GET /v1/productos/categoria/Electrónica - Status: 200 - Éxito
Productos obtenidos: X
```

---

## ✅ Prueba 8: Manejo de Errores

### 8.1 Backend No Disponible

**Pasos:**
1. Detén el microservicio de Product
2. Intenta cargar productos
3. Observa la consola

**Resultado Esperado:**
- ✅ Mensaje de error amigable
- ✅ Fallback a localStorage si está disponible
- ✅ No crashea la aplicación

### 8.2 Credenciales Incorrectas

**Pasos:**
1. Intenta iniciar sesión con credenciales incorrectas
2. Observa la consola

**Resultado Esperado en Consola:**
```
POST /api/auth/login - Status: 401 - Error
Error: Credenciales incorrectas
```

**Verificación:**
- ✅ Mensaje de error mostrado
- ✅ No se crea sesión

---

## 📊 Checklist de Pruebas

### Autenticación
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Token se guarda correctamente
- [ ] Roles se asignan correctamente

### Productos
- [ ] Listar productos funciona
- [ ] Ver detalle de producto funciona
- [ ] Crear producto (Admin) funciona
- [ ] Editar producto (Admin) funciona
- [ ] Eliminar producto (Admin) funciona
- [ ] Buscar productos funciona
- [ ] Filtrar por categoría funciona

### Órdenes
- [ ] Crear orden funciona
- [ ] Ver órdenes (Vendedor/Admin) funciona
- [ ] Ver mis órdenes (Cliente) funciona
- [ ] Editar orden (Admin) funciona
- [ ] Ver detalle de orden funciona

### Carrito
- [ ] Agregar producto al carrito funciona
- [ ] Ver carrito funciona
- [ ] Modificar cantidad funciona
- [ ] Eliminar del carrito funciona
- [ ] Completar compra funciona

### Roles
- [ ] Cliente solo ve Tienda y Mis Órdenes
- [ ] Vendedor ve Productos y Órdenes (solo lectura)
- [ ] Admin ve todo y puede gestionar

### Logs
- [ ] Todos los movimientos se registran en consola
- [ ] Formato de logs es consistente
- [ ] Parámetros se muestran correctamente
- [ ] Status codes se muestran

---

## 🐛 Problemas Comunes y Soluciones

### Problema: "Failed to fetch"
**Solución:** Verifica que el microservicio esté corriendo y el puerto sea correcto

### Problema: "401 Unauthorized"
**Solución:** Inicia sesión nuevamente o verifica el token

### Problema: "usuarioId is null"
**Solución:** Verifica que el usuario tenga usuarioID después del login

### Problema: "Productos no se cargan"
**Solución:** Verifica la conexión a la base de datos y que haya productos creados

---

**Última actualización:** Después de integración completa

