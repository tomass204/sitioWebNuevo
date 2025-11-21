# Documento ERS - Gaming Hub Product Microservice

## 1. Introducción
Este documento ERS (Especificación de Requisitos del Software) describe los requisitos para el microservicio de productos de Gaming Hub.

## 2. Descripción General
El microservicio Product gestiona el catálogo de productos (juegos) y las órdenes de compra en la plataforma Gaming Hub.

## 3. Requisitos Funcionales

### 3.1 Gestión de Productos
- **RF1**: El sistema debe permitir crear, leer, actualizar y eliminar productos (CRUD).
- **RF2**: Los productos deben tener nombre, descripción, precio, categoría e imagen.
- **RF3**: Solo administradores pueden modificar productos.
- **RF4**: Cualquier usuario puede ver productos.

### 3.2 Gestión de Órdenes
- **RF5**: El sistema debe permitir crear y gestionar órdenes de compra.
- **RF6**: Las órdenes deben incluir productos, usuario, fecha y total.
- **RF7**: Clientes pueden crear órdenes, vendedores pueden ver todas las órdenes.

### 3.3 Seguridad
- **RF8**: Implementar autenticación JWT.
- **RF9**: Control de acceso basado en roles (Admin, Vendedor, Cliente).
- **RF10**: Endpoints públicos para ver productos.

## 4. Requisitos No Funcionales

### 4.1 Rendimiento
- **RNF1**: Respuesta de API en menos de 2 segundos.
- **RNF2**: Soporte para hasta 1000 usuarios concurrentes.

### 4.2 Seguridad
- **RNF3**: Encriptación de datos sensibles.
- **RNF4**: Validación de entrada de datos.

### 4.3 Usabilidad
- **RNF5**: API documentada con Swagger.
- **RNF6**: Mensajes de error claros.

## 5. Arquitectura del Sistema

### 5.1 Tecnologías
- Backend: Spring Boot 3.x
- Base de datos: MySQL
- Seguridad: Spring Security + JWT
- Documentación: Swagger/OpenAPI

### 5.2 Arquitectura
- Patrón: Microservicios
- Comunicación: REST API
- Persistencia: JPA/Hibernate

## 6. Casos de Uso

### 6.1 Caso de Uso 1: Ver Productos
- Actor: Usuario anónimo
- Descripción: Usuario ve lista de productos disponibles

### 6.2 Caso de Uso 2: Crear Producto
- Actor: Administrador
- Descripción: Admin crea nuevo producto en el catálogo

### 6.3 Caso de Uso 3: Realizar Compra
- Actor: Cliente
- Descripción: Cliente selecciona productos y crea orden

### 6.4 Caso de Uso 4: Gestionar Órdenes
- Actor: Vendedor
- Descripción: Vendedor ve y gestiona órdenes de clientes

## 7. Interfaz de Usuario
- API REST documentada
- Integración con frontend React
- Pantallas: Lista productos, Detalle producto, Carrito, Órdenes

## 8. Pruebas
- Pruebas unitarias para servicios
- Pruebas de integración para API
- Pruebas de aceptación con frontend

## 9. Riesgos y Mitigaciones
- Riesgo: Fallos de conectividad DB → Mitigación: Connection pooling
- Riesgo: Ataques de seguridad → Mitigación: Validación y sanitización

## 10. Cronograma
- Semana 1: Configuración proyecto y DB
- Semana 2: Desarrollo entidades y repositorios
- Semana 3: Implementación servicios y controladores
- Semana 4: Seguridad y testing
- Semana 5: Integración y documentación
