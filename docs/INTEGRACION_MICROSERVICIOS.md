# Integración de Microservicios con Frontend

## ✅ Configuración Completada

### Microservicios Conectados

1. **Product Service** (Puerto 8082)
   - ✅ Productos: `/v1/productos`
   - ✅ Órdenes: `/v1/ordenes`
   - ✅ Conectado en `ProductService.ts` y `OrdenService.ts`

2. **Game Service** (Puerto 8090)
   - ✅ Juegos: `/v1/juegos`
   - ✅ Conectado en `GameServiceBackend.ts`

3. **Auth Service** (Puerto 8081)
   - ✅ Login: `/api/auth/login`
   - ✅ Register: `/api/auth/register`
   - ✅ Conectado en `AuthServiceBackend.ts`

4. **Usuarios Service** (Puerto 8081)
   - ✅ Login: `/api/GamingHub/v1/Usuario/iniciar-session`
   - ✅ Register: `/api/GamingHub/v1/Usuario`
   - ✅ Conectado en `AuthServiceBackend.ts` (fallback)

## 🔄 Flujo de Compra de Productos

### 1. Agregar Producto al Carrito

**Componente:** `ProductosTab.tsx`

```typescript
// Cuando el usuario hace clic en "Agregar al Carrito"
handleAddToCart(productoId)
  ↓
// Logs en consola:
POST /cart - Agregando producto al carrito
Producto ID: X, Nombre: Y, Precio: Z
POST /cart - Status: 200 - Producto agregado exitosamente
  ↓
// Guarda en localStorage y actualiza estado
```

### 2. Ver Carrito

**Componente:** `CartTab.tsx`

```typescript
// Al cargar el componente
loadCart()
  ↓
// Logs en consola:
GET /cart - Obteniendo carrito del usuario
GET /v1/productos - Obteniendo todos los productos (para actualizar datos)
GET /cart - Status: 200 - Éxito
Productos en carrito: X
  ↓
// Muestra productos con datos actualizados del backend
```

### 3. Crear Orden (Comprar)

**Componente:** `CartTab.tsx` - `handlePaymentSubmit`

```typescript
// Cuando el usuario completa el pago
handlePaymentSubmit()
  ↓
// Logs en consola:
POST /v1/ordenes - Creando orden de compra
Parámetros: {
  usuarioId: X,
  productoIds: [1, 2, 3],
  total: Y,
  estado: "PENDIENTE",
  paymentDetails: {...}
}
  ↓
// Llama al microservicio
OrdenService.createOrden(ordenRequest)
  ↓
// Logs en consola:
POST /v1/ordenes - Status: 200 - Orden creada exitosamente
Orden creada: {ordenId: X, ...}
  ↓
// Muestra confirmación y limpia carrito
```

## 📊 Logs en Consola

Todos los movimientos se registran en la consola con el siguiente formato:

### Ejemplo de Compra Completa:

```
POST /cart - Agregando producto al carrito
Producto ID: 1, Nombre: Laptop Gaming, Precio: 999.99
POST /cart - Status: 200 - Producto agregado exitosamente

GET /cart - Obteniendo carrito del usuario
GET /v1/productos - Obteniendo todos los productos
GET /v1/productos - Status: 200 - Éxito
Productos obtenidos: 5
GET /cart - Status: 200 - Éxito
Productos en carrito: 1

POST /v1/ordenes - Creando orden de compra
Parámetros: {
  usuarioId: 123,
  productoIds: [1],
  total: 999.99,
  estado: "PENDIENTE"
}
POST /v1/ordenes - Status: 200 - Orden creada exitosamente
Orden creada: {
  ordenId: 1,
  usuarioId: 123,
  productoIds: [1],
  total: 999.99,
  fecha: "2024-01-15T10:30:00",
  estado: "PENDIENTE"
}
```

## 🔧 Configuración de URLs

Todas las URLs están centralizadas en `src/services/config.ts`:

```typescript
export const API_CONFIG = {
  PRODUCT_SERVICE: 'http://localhost:8082',
  GAME_SERVICE: 'http://localhost:8090',
  AUTH_SERVICE: 'http://localhost:8081',
  USUARIOS_SERVICE: 'http://localhost:8081',
};
```

## 🔐 Autenticación

El sistema intenta usar los microservicios en este orden:

1. **Auth Service** (`/api/auth/login`)
2. **Usuarios Service** (`/api/GamingHub/v1/Usuario/iniciar-session`) - Fallback
3. **AuthService local** (localStorage) - Fallback final

## 📦 Estructura de Datos

### Producto (del Backend)
```typescript
{
  productoId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenUrl: string;
  activo: boolean;
}
```

### Orden (del Backend)
```typescript
{
  ordenId: number;
  usuarioId: number;
  productoIds: number[];
  fecha: string;
  total: number;
  estado: string; // "PENDIENTE", "COMPLETADA", "CANCELADA"
}
```

### Carrito (Frontend)
```typescript
{
  productoId: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  descripcion: string;
  cantidad: number;
}
```

## ✅ Verificación de Funcionamiento

### 1. Verificar que los microservicios estén corriendo:

```bash
# Product Service
curl http://localhost:8082/v1/productos

# Game Service
curl http://localhost:8090/v1/juegos

# Auth Service
curl http://localhost:8081/actuator/health
```

### 2. Verificar en el navegador:

1. Abre la consola del navegador (F12)
2. Agrega un producto al carrito
3. Verifica los logs en consola
4. Completa una compra
5. Verifica que se cree la orden en el backend

### 3. Verificar en Swagger:

- Product: `http://localhost:8082/swagger-ui/index.html`
- Game: `http://localhost:8090/swagger-ui/index.html`

## 🐛 Solución de Problemas

### Error: "Failed to fetch"

**Causa:** El microservicio no está corriendo o hay un problema de CORS.

**Solución:**
1. Verifica que el microservicio esté corriendo
2. Verifica que el puerto sea correcto
3. Verifica la configuración de CORS en el backend

### Error: "401 Unauthorized"

**Causa:** El token JWT no es válido o falta.

**Solución:**
1. Inicia sesión nuevamente
2. Verifica que el token se esté guardando en localStorage
3. Verifica que el token se esté enviando en los headers

### Error: "404 Not Found"

**Causa:** La URL del endpoint es incorrecta.

**Solución:**
1. Verifica la URL en `config.ts`
2. Verifica que el endpoint exista en el backend
3. Verifica Swagger para ver los endpoints disponibles

## 📝 Notas Importantes

1. **Fallback Automático:** Si un microservicio no está disponible, el sistema intenta usar el siguiente o localStorage
2. **Logs Detallados:** Todos los movimientos se registran en consola con formato estándar
3. **Datos Actualizados:** El carrito siempre obtiene los datos más recientes del backend
4. **Usuario ID:** Se obtiene del usuario autenticado o se usa un fallback temporal

---

**Última actualización:** Después de integración completa

