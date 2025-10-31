# GamingHub - React Application

Una plataforma web moderna desarrollada con React, TypeScript y Bootstrap para la comunidad gaming.

## 🚀 Características

- **Framework Moderno**: React 18.2.0 con TypeScript
- **Diseño Responsivo**: Bootstrap 5.3.0 y React Bootstrap
- **Testing Completo**: Jest, React Testing Library, Jasmine y Karma
- **Arquitectura Modular**: Componentes y servicios bien estructurados
- **Gestión de Estado**: React Hooks y Context API
- **Autenticación**: Sistema de roles y permisos

## 📋 Requisitos del Sistema

- Node.js 16.0 o superior
- npm 8.0 o superior
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Tomas_Original
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

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

### Usuario Básico
- Navegación y lectura de contenido
- Comentarios en noticias y debates
- Sistema de favoritos
- Carrito de compras

### Influencer
- Todas las funciones de Usuario Básico
- Publicación de noticias
- Creación de debates
- Publicación de juegos

### Moderador
- Todas las funciones de Influencer
- Moderación de contenido
- Gestión de advertencias
- Herramientas de moderación

### Propietario
- Todas las funciones de Moderador
- Gestión de solicitudes de moderador
- Administración completa del sistema

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

- [Especificación de Requisitos del Software](./docs/ERS.md)
- [Cobertura de Testing](./docs/TestingCoverage.md)
- [Guía de Contribución](./docs/CONTRIBUTING.md)

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
