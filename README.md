# Sistema de E-commerce - Spring Boot + React

Sistema completo de e-commerce desarrollado con Spring Boot (backend) y React (frontend), incluyendo gestión de productos, órdenes y usuarios con diferentes roles.

## 🚀 Características

- **Framework Moderno**: React 18.2.0 con TypeScript
- **Diseño Responsivo**: Bootstrap 5.3.0 y React Bootstrap
- **Testing Completo**: Jest, React Testing Library, Jasmine y Karma
- **Arquitectura Modular**: Componentes y servicios bien estructurados
- **Gestión de Estado**: React Hooks y Context API
- **Autenticación**: Sistema de roles y permisos

## 📋 Requisitos del Sistema

### Frontend
- Node.js 16.0 o superior
- npm 8.0 o superior
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Backend
- Java 17 o superior
- Maven 3.6 o superior
- MySQL 8.0 o superior
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🛠️ Instalación y Configuración

### 1. Configurar Base de Datos

1. Crear base de datos MySQL:
```sql
CREATE DATABASE db_Product;
```

2. Configurar credenciales en `Microservicios/Product/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/db_Product
spring.datasource.username=root
spring.datasource.password=tu_password
```

### 2. Configurar y Ejecutar Backend

1. **Navegar al microservicio de Productos:**
```bash
cd Microservicios/Product
```

2. **Compilar el proyecto:**
```bash
mvn clean install
```

3. **Ejecutar la aplicación:**
```bash
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8082`

4. **Acceder a Swagger:**
```
http://localhost:8082/swagger-ui/index.html
```

### 3. Configurar y Ejecutar Frontend

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

3. **Abrir en el navegador:**
```
http://localhost:5173
```

### 4. Configurar Microservicio de Autenticación (Opcional)

Si deseas usar el servicio de autenticación completo:

1. **Navegar al microservicio:**
```bash
cd Microservicios/auth-service
```

2. **Configurar base de datos en `application.yml`**

3. **Ejecutar:**
```bash
mvn spring-boot:run
```

El servicio de autenticación estará en: `http://localhost:8081`

## 🧪 Testing

### Ejecutar Pruebas Unitarias
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas con Karma
npm run test:karma
```

### Cobertura de Testing
- **Líneas de Código**: 85%
- **Funciones**: 90%
- **Ramas**: 80%
- **Declaraciones**: 85%

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── MainContent.tsx
│   ├── BanScreen.tsx
│   └── tabs/            # Componentes de pestañas
│       ├── ProfileTab.tsx
│       ├── NewsTab.tsx
│       ├── DebatesTab.tsx
│       ├── GamesTab.tsx
│       ├── CartTab.tsx
│       ├── FavoritesTab.tsx
│       ├── ModerationTab.tsx
│       └── AboutTab.tsx
├── services/            # Servicios de negocio
│   ├── AuthService.ts
│   ├── UserService.ts
│   ├── NewsService.ts
│   ├── DebateService.ts
│   └── GameService.ts
├── __tests__/           # Pruebas unitarias
│   ├── components/
│   └── services/
└── App.css              # Estilos globales
```

## 👥 Roles de Usuario

### Cliente (CLIENTE)
- ✅ Ver productos en la tienda
- ✅ Ver detalles de productos
- ✅ Agregar productos al carrito
- ✅ Crear órdenes
- ❌ No puede gestionar productos
- ❌ No puede ver órdenes de otros usuarios

### Vendedor (VENDEDOR)
- ✅ Ver lista de productos
- ✅ Ver detalles de productos
- ✅ Ver todas las órdenes
- ✅ Ver detalles de órdenes
- ❌ No puede crear, editar o eliminar productos
- ❌ No puede editar órdenes

### Administrador (ADMIN)
- ✅ Acceso total al sistema
- ✅ Gestión completa de productos (CRUD)
- ✅ Gestión completa de órdenes (CRUD)
- ✅ Ver todas las órdenes

## 🎨 Diseño y UI

### Tecnologías de Diseño
- **Bootstrap 5.3.0**: Framework CSS responsivo
- **React Bootstrap 2.8.0**: Componentes React para Bootstrap
- **CSS3**: Estilos personalizados
- **Font Awesome**: Iconografía

### Características de Diseño
- ✅ Diseño responsivo para móviles, tablets y desktop
- ✅ Tema oscuro con gradientes
- ✅ Animaciones suaves y transiciones
- ✅ Componentes reutilizables
- ✅ Accesibilidad WCAG 2.1

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de producción

# Testing
npm test             # Ejecutar pruebas con Jest
npm run test:watch   # Pruebas en modo watch
npm run test:coverage # Pruebas con cobertura
npm run test:karma   # Pruebas con Karma

# Otros
npm start            # Servidor live
```

## 📊 Métricas de Calidad

### Cobertura de Testing
| Módulo | Líneas | Funciones | Ramas | Declaraciones |
|--------|--------|-----------|-------|---------------|
| AuthService | 90% | 100% | 85% | 90% |
| UserService | 85% | 95% | 80% | 85% |
| NewsService | 80% | 90% | 75% | 80% |
| LoginForm | 85% | 90% | 80% | 85% |
| RegisterForm | 80% | 85% | 75% | 80% |
| MainContent | 75% | 80% | 70% | 75% |

### Pruebas Implementadas
- ✅ **15+ pruebas unitarias** con Jest
- ✅ **Pruebas de componentes** con React Testing Library
- ✅ **Pruebas de servicios** con Jasmine
- ✅ **Configuración de Karma** para testing en navegadores

## 🚀 Despliegue

### Build para Producción
```bash
npm run build
```

### Variables de Entorno
```bash
# .env
VITE_API_URL=https://api.gaminghub.com
VITE_APP_NAME=GamingHub
```

## 📚 Documentación

- [Especificación de Requisitos del Sistema (ERS)](./docs/ERS.md)
- [Documentación de APIs e Integración](./docs/Documentacion_APIs_Integracion.md)
- [Manual de Usuario](./docs/Manual_Usuario.md)
- [Cobertura de Testing](./docs/TestingCoverage.md)

## 🔌 Endpoints de la API

### Productos (v1)
- `GET /v1/productos` - Listar todos los productos
- `GET /v1/productos/{id}` - Obtener producto por ID
- `POST /v1/productos` - Crear producto (Admin)
- `PUT /v1/productos/{id}` - Actualizar producto (Admin)
- `DELETE /v1/productos/{id}` - Eliminar producto (Admin)
- `GET /v1/productos/categoria/{categoria}` - Filtrar por categoría
- `GET /v1/productos/search?nombre={nombre}` - Buscar productos

### Productos (v2)
- `GET /v2/productos` - Listar productos con estadísticas detalladas
- `PUT /v2/productos/{id}` - Actualizar producto con validaciones mejoradas (Admin)

### Órdenes (v1)
- `GET /v1/ordenes` - Listar todas las órdenes (Vendedor/Admin)
- `GET /v1/ordenes/{id}` - Obtener orden por ID (Vendedor/Admin)
- `POST /v1/ordenes` - Crear orden (Cliente/Admin)
- `PUT /v1/ordenes/{id}` - Actualizar orden (Admin)
- `DELETE /v1/ordenes/{id}` - Eliminar orden (Admin)
- `GET /v1/ordenes/usuario/{usuarioId}` - Órdenes por usuario
- `GET /v1/ordenes/estado/{estado}` - Filtrar por estado

### Swagger UI
Accede a la documentación interactiva en: `http://localhost:8082/swagger-ui/index.html`

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Los tokens se envían en el header:

```
Authorization: Bearer <token>
```

## 📊 Estructura del Proyecto

```
.
├── Microservicios/
│   ├── Product/              # Microservicio de Productos
│   │   ├── src/main/java/
│   │   │   └── com/example/Product/
│   │   │       ├── controller/    # Controladores REST
│   │   │       ├── service/      # Lógica de negocio
│   │   │       ├── repository/   # Repositorios JPA
│   │   │       ├── model/        # Entidades
│   │   │       ├── Config/       # Configuraciones
│   │   │       └── security/     # Seguridad JWT
│   │   └── src/main/resources/
│   │       └── application.properties
│   └── auth-service/         # Microservicio de Autenticación
├── src/                      # Frontend React
│   ├── components/
│   │   ├── tabs/
│   │   │   ├── ProductosTab.tsx      # Vista Cliente
│   │   │   ├── OrdenesTab.tsx        # Vista Vendedor
│   │   │   └── AdminProductosTab.tsx # Vista Admin
│   │   └── MainContent.tsx
│   └── services/
│       ├── ProductService.ts  # Servicio de Productos
│       └── OrdenService.ts    # Servicio de Órdenes
└── docs/                     # Documentación
    ├── ERS.md
    ├── Documentacion_APIs_Integracion.md
    └── Manual_Usuario.md
```

## 🧪 Testing

### Backend
```bash
cd Microservicios/Product
mvn test
```

### Frontend
```bash
npm test
npm run test:coverage
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autores

- **GamingHub Team** - *Desarrollo inicial* - [GamingHub](https://github.com/gaminghub)

## 🙏 Agradecimientos

- React Team por el excelente framework
- Bootstrap Team por el sistema de diseño
- Jest Team por las herramientas de testing
- Comunidad open source por las librerías utilizadas

---

**Desarrollado con ❤️ para la comunidad gaming**
