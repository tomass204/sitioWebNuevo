# Manual de Usuario
## Sistema de E-commerce

---

**Versión:** 1.0  
**Fecha:** 2024  
**Sistema:** E-commerce con Spring Boot y React

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Roles y Permisos](#roles-y-permisos)
4. [Guía para Cliente](#guía-para-cliente)
5. [Guía para Vendedor](#guía-para-vendedor)
6. [Guía para Administrador](#guía-para-administrador)
7. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

Este manual describe cómo utilizar el sistema de e-commerce desarrollado con Spring Boot y React. El sistema permite gestionar productos y órdenes según el rol del usuario.

### Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet
- Backend ejecutándose en `http://localhost:8082`
- Base de datos MySQL configurada

---

## Acceso al Sistema

### 1. Iniciar Sesión

1. Abra el navegador y acceda a la aplicación
2. Se mostrará la pantalla de inicio de sesión
3. Ingrese su correo electrónico y contraseña
4. Haga clic en "Iniciar Sesión"

**Pantallazo: Pantalla de Login**
```
┌─────────────────────────────────────┐
│         GAMING HUB                  │
│                                     │
│  Correo electrónico: [___________]  │
│  Contraseña:        [___________]  │
│                                     │
│  [Iniciar Sesión]                   │
│                                     │
│  ¿No tienes cuenta? Registrarse     │
└─────────────────────────────────────┘
```

### 2. Registro de Usuario

1. En la pantalla de login, haga clic en "Registrarse"
2. Complete el formulario con:
   - Correo electrónico
   - Contraseña
   - Nombre de usuario
   - Rol (Cliente, Vendedor, o Administrador)
3. Haga clic en "Registrarse"

**Nota:** El rol de Administrador generalmente se asigna manualmente por seguridad.

---

## Roles y Permisos

### Cliente (CLIENTE)

**Permisos:**
- ✅ Ver productos en la tienda
- ✅ Ver detalles de productos
- ✅ Agregar productos al carrito
- ✅ Crear órdenes

**Restricciones:**
- ❌ No puede gestionar productos
- ❌ No puede ver órdenes de otros usuarios
- ❌ No puede editar o eliminar productos

### Vendedor (VENDEDOR)

**Permisos:**
- ✅ Ver lista de productos
- ✅ Ver detalles de productos
- ✅ Ver todas las órdenes
- ✅ Ver detalles de órdenes

**Restricciones:**
- ❌ No puede crear, editar o eliminar productos
- ❌ No puede editar órdenes

### Administrador (ADMIN)

**Permisos:**
- ✅ Acceso total al sistema
- ✅ Gestión completa de productos (CRUD)
- ✅ Gestión completa de órdenes (CRUD)
- ✅ Ver todas las órdenes

---

## Guía para Cliente

### Acceder a la Tienda

1. Después de iniciar sesión como Cliente, verá la barra de navegación
2. Haga clic en "Tienda" para ver los productos disponibles

**Pantallazo: Vista de Tienda (Cliente)**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] GAMING HUB    [Tienda] [Carrito] [Perfil] [Salir]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Tienda de Productos                                    │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ [Imagen] │  │ [Imagen] │  │ [Imagen] │           │
│  │ Producto1│  │ Producto2│  │ Producto3│           │
│  │ $99.99   │  │ $149.99  │  │ $79.99   │           │
│  │[Ver] [+] │  │[Ver] [+] │  │[Ver] [+] │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Ver Detalles de un Producto

1. En la vista de tienda, haga clic en "Ver Detalles" de cualquier producto
2. Se abrirá un modal con:
   - Imagen del producto
   - Descripción completa
   - Categoría
   - Precio
   - Estado (Disponible/No disponible)

**Pantallazo: Modal de Detalles de Producto**
```
┌─────────────────────────────────────┐
│ Detalles de Producto          [X]  │
├─────────────────────────────────────┤
│                                     │
│  [Imagen del Producto]              │
│                                     │
│  Nombre: Laptop Gaming              │
│  Descripción: Laptop de alto...    │
│  Categoría: [Electrónica]          │
│  Precio: $999.99                    │
│  Estado: Disponible                 │
│                                     │
│  [Cerrar] [Agregar al Carrito]      │
└─────────────────────────────────────┘
```

### Agregar Productos al Carrito

1. En la vista de tienda, haga clic en "Agregar al Carrito" de un producto
2. El botón cambiará a "En Carrito"
3. Puede agregar múltiples productos

### Crear una Orden

1. Agregue productos al carrito
2. Haga clic en "Crear Orden (X productos)" en la parte superior
3. Se creará la orden y se mostrará un mensaje de confirmación
4. El carrito se limpiará automáticamente

**Pantallazo: Confirmación de Orden**
```
┌─────────────────────────────────────┐
│  ✓ Orden creada exitosamente      │
│                                     │
│  Se ha creado la orden #123        │
│  Estado: PENDIENTE                  │
└─────────────────────────────────────┘
```

---

## Guía para Vendedor

### Ver Lista de Productos

1. Después de iniciar sesión como Vendedor, verá la barra de navegación
2. Haga clic en "Productos" para ver todos los productos disponibles

**Pantallazo: Vista de Productos (Vendedor)**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] GAMING HUB  [Productos] [Órdenes] [Perfil] [Salir]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Tienda de Productos                                    │
│                                                         │
│  [Misma vista que Cliente, solo lectura]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Ver Lista de Órdenes

1. Haga clic en "Órdenes" en la barra de navegación
2. Se mostrará una tabla con todas las órdenes del sistema

**Pantallazo: Vista de Órdenes (Vendedor)**
```
┌─────────────────────────────────────────────────────────┐
│ Gestión de Órdenes                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ID │ Usuario │ Productos      │ Total │ Fecha │ Estado│
├─────┼─────────┼────────────────┼───────┼───────┼───────┤
│  1  │   123   │ Prod1, Prod2   │$199.98│15/01  │[PEND] │
│  2  │   456   │ Prod3          │$99.99 │15/01  │[COMP] │
│                                                         │
│  [Ver] para cada orden                                  │
└─────────────────────────────────────────────────────────┘
```

### Ver Detalles de una Orden

1. En la tabla de órdenes, haga clic en "Ver" de la orden deseada
2. Se abrirá un modal con:
   - ID de la orden
   - ID del usuario
   - Lista de productos con precios
   - Total
   - Fecha
   - Estado

**Pantallazo: Modal de Detalles de Orden**
```
┌─────────────────────────────────────┐
│ Detalles de Orden #1          [X]  │
├─────────────────────────────────────┤
│                                     │
│  Usuario ID: 123                    │
│  Fecha: 15/01/2024 10:30:00        │
│  Total: $199.98                     │
│  Estado: [PENDIENTE]                │
│                                     │
│  Productos:                         │
│  • Producto 1 - $99.99              │
│  • Producto 2 - $99.99              │
│                                     │
│  [Cerrar]                           │
└─────────────────────────────────────┘
```

---

## Guía para Administrador

### Gestión de Productos

1. Después de iniciar sesión como Administrador, haga clic en "Productos"
2. Verá una tabla con todos los productos y opciones de gestión

**Pantallazo: Vista de Gestión de Productos (Admin)**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] GAMING HUB  [Productos] [Órdenes] [Perfil] [Salir]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Gestión de Productos (Administrador)  [Crear Producto]│
├─────────────────────────────────────────────────────────┤
│  ID │ Nombre      │ Descripción │ Precio │ Cat │ Estado│
├─────┼─────────────┼─────────────┼────────┼─────┼───────┤
│  1  │ Laptop      │ Desc...     │$999.99 │Elec │[Activo]│
│  2  │ Mouse       │ Desc...     │$29.99  │Elec │[Activo]│
│                                                         │
│  [Editar] [Eliminar] para cada producto                │
└─────────────────────────────────────────────────────────┘
```

### Crear un Producto

1. Haga clic en "Crear Producto"
2. Complete el formulario:
   - Nombre (requerido)
   - Descripción
   - Precio (requerido)
   - Categoría
   - URL de Imagen
   - Activo (checkbox)
3. Haga clic en "Crear"

**Pantallazo: Modal de Crear Producto**
```
┌─────────────────────────────────────┐
│ Crear Producto                [X]  │
├─────────────────────────────────────┤
│                                     │
│  Nombre: [___________________]     │
│  Descripción: [_______________]     │
│              [_______________]      │
│  Precio: [___________________]    │
│  Categoría: [_______________]      │
│  URL de Imagen: [____________]    │
│  ☑ Activo                          │
│                                     │
│  [Cancelar] [Crear]                 │
└─────────────────────────────────────┘
```

### Editar un Producto

1. En la tabla de productos, haga clic en "Editar" del producto deseado
2. Se abrirá un modal con el formulario prellenado
3. Modifique los campos necesarios
4. Haga clic en "Guardar"

### Eliminar un Producto

1. En la tabla de productos, haga clic en "Eliminar"
2. Se mostrará un diálogo de confirmación
3. Confirme la eliminación
4. El producto se desactivará (no se elimina físicamente)

### Gestión de Órdenes

1. Haga clic en "Órdenes" en la barra de navegación
2. Verá la misma vista que el Vendedor, pero con opción adicional de "Editar"

**Pantallazo: Vista de Órdenes (Admin)**
```
┌─────────────────────────────────────────────────────────┐
│ Gestión de Órdenes                                       │
├─────────────────────────────────────────────────────────┤
│  ID │ Usuario │ Productos      │ Total │ Fecha │ Estado│
├─────┼─────────┼────────────────┼───────┼───────┼───────┤
│  1  │   123   │ Prod1, Prod2   │$199.98│15/01  │[PEND] │
│                                                         │
│  [Ver] [Editar] para cada orden                         │
└─────────────────────────────────────────────────────────┘
```

### Editar una Orden

1. En la tabla de órdenes, haga clic en "Editar"
2. Se abrirá un modal para cambiar el estado de la orden
3. Seleccione el nuevo estado:
   - PENDIENTE
   - COMPLETADA
   - CANCELADA
4. Haga clic en "Guardar"

**Pantallazo: Modal de Editar Orden**
```
┌─────────────────────────────────────┐
│ Editar Orden #1               [X]  │
├─────────────────────────────────────┤
│                                     │
│  Estado: [PENDIENTE ▼]              │
│    • PENDIENTE                      │
│    • COMPLETADA                     │
│    • CANCELADA                      │
│                                     │
│  [Cancelar] [Guardar]               │
└─────────────────────────────────────┘
```

---

## Logs en Consola

El sistema registra todos los movimientos en la consola del navegador. Para verlos:

1. Abra las herramientas de desarrollador (F12)
2. Vaya a la pestaña "Console"
3. Verá mensajes como:

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

## Solución de Problemas

### Problema: No se cargan los productos

**Solución:**
1. Verifique que el backend esté ejecutándose en `http://localhost:8082`
2. Verifique la conexión a la base de datos
3. Revise la consola del navegador para ver errores
4. Verifique que la URL de la API sea correcta

### Problema: Error 401 (No autorizado)

**Solución:**
1. Verifique que haya iniciado sesión correctamente
2. Verifique que el token JWT sea válido
3. Cierre sesión y vuelva a iniciar sesión

### Problema: Error 403 (Prohibido)

**Solución:**
1. Verifique que su rol tenga los permisos necesarios
2. Contacte al administrador si necesita permisos adicionales

### Problema: No se pueden crear órdenes

**Solución:**
1. Verifique que haya productos en el carrito
2. Verifique que esté autenticado como Cliente o Admin
3. Revise la consola para ver errores específicos

### Problema: La interfaz no se muestra correctamente

**Solución:**
1. Limpie la caché del navegador
2. Recargue la página (Ctrl+F5 o Cmd+Shift+R)
3. Verifique que JavaScript esté habilitado
4. Pruebe en otro navegador

---

## Contacto y Soporte

Para problemas técnicos o preguntas sobre el sistema, contacte al equipo de desarrollo.

---

**Fin del Manual de Usuario**

