# Sistema de Roles - Gaming Hub

## 📋 Roles del Sistema

El sistema utiliza los siguientes roles según el contexto del sitio web:

### 1. UsuarioBasico
**Permisos:**
- ✅ Ver productos en la tienda
- ✅ Ver detalles de productos
- ✅ Agregar productos al carrito
- ✅ Crear órdenes
- ✅ Ver sus propias órdenes

**Restricciones:**
- ❌ No puede gestionar productos
- ❌ No puede ver órdenes de otros usuarios
- ❌ No puede editar o eliminar productos

**Vista en el Frontend:**
- Tienda
- Carrito
- Mis Órdenes

---

### 2. Influencer
**Permisos:**
- ✅ Ver lista de productos (solo lectura)
- ✅ Ver detalles de productos
- ✅ Ver todas las órdenes (solo lectura)
- ✅ Ver detalles de órdenes
- ✅ Crear juegos

**Restricciones:**
- ❌ No puede crear, editar o eliminar productos
- ❌ No puede editar órdenes
- ❌ No puede comprar productos (solo visualización)

**Vista en el Frontend:**
- Productos (solo lectura)
- Órdenes (solo lectura)

---

### 3. Moderador
**Permisos:**
- ✅ **Acceso total al sistema**
- ✅ Gestión completa de productos (CRUD)
- ✅ Gestión completa de órdenes (CRUD)
- ✅ Ver todas las órdenes
- ✅ Crear, editar, eliminar productos
- ✅ Editar estados de órdenes
- ✅ Herramientas de moderación

**Vista en el Frontend:**
- Productos (gestión completa)
- Órdenes (gestión completa)
- Moderación

---

### 4. Propietario
**Permisos:**
- ✅ **Acceso total al sistema**
- ✅ Gestión completa de productos (CRUD)
- ✅ Gestión completa de órdenes (CRUD)
- ✅ Ver todas las órdenes
- ✅ Crear, editar, eliminar productos
- ✅ Editar estados de órdenes
- ✅ Herramientas de moderación
- ✅ Gestión de solicitudes de moderador
- ✅ Administración completa

**Vista en el Frontend:**
- Productos (gestión completa)
- Órdenes (gestión completa)
- Moderación
- Todas las funciones administrativas

---

## 🔄 Mapeo de Roles

### Frontend → Backend

| Rol Frontend | Rol Backend (JWT) | Descripción |
|-------------|-------------------|-------------|
| UsuarioBasico | ROLE_USUARIO_BASICO | Usuario básico |
| Influencer | ROLE_INFLUENCER | Influencer |
| Moderador | ROLE_MODERADOR | Moderador |
| Propietario | ROLE_PROPIETARIO | Propietario |

---

## 🔐 Autorización en Backend

### Productos

**Crear/Editar/Eliminar:**
- ✅ ROLE_PROPIETARIO
- ✅ ROLE_MODERADOR

**Ver:**
- ✅ Todos (público)

### Órdenes

**Ver todas las órdenes:**
- ✅ ROLE_INFLUENCER
- ✅ ROLE_MODERADOR
- ✅ ROLE_PROPIETARIO

**Crear orden:**
- ✅ Todos los usuarios autenticados

**Editar/Eliminar orden:**
- ✅ ROLE_PROPIETARIO
- ✅ ROLE_MODERADOR

**Ver mis órdenes:**
- ✅ Todos los usuarios autenticados

### Juegos

**Crear/Editar:**
- ✅ ROLE_INFLUENCER
- ✅ ROLE_MODERADOR
- ✅ ROLE_PROPIETARIO

**Eliminar:**
- ✅ ROLE_PROPIETARIO
- ✅ ROLE_MODERADOR

**Ver:**
- ✅ Todos (público)

---

## 📊 Resumen de Permisos

| Funcionalidad | UsuarioBasico | Influencer | Moderador | Propietario |
|---------------|---------------|------------|-----------|-------------|
| Ver productos | ✅ | ✅ | ✅ | ✅ |
| Comprar productos | ✅ | ❌ | ❌ | ❌ |
| Ver órdenes (todas) | ❌ | ✅ | ✅ | ✅ |
| Ver mis órdenes | ✅ | ✅ | ✅ | ✅ |
| Crear productos | ❌ | ❌ | ✅ | ✅ |
| Editar productos | ❌ | ❌ | ✅ | ✅ |
| Eliminar productos | ❌ | ❌ | ✅ | ✅ |
| Editar órdenes | ❌ | ❌ | ✅ | ✅ |
| Eliminar órdenes | ❌ | ❌ | ✅ | ✅ |
| Crear juegos | ❌ | ✅ | ✅ | ✅ |
| Moderación | ❌ | ❌ | ✅ | ✅ |
| Administración | ❌ | ❌ | ❌ | ✅ |

---

**Última actualización:** Ajustado a roles del sitio web

