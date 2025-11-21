# Game Microservice

Microservicio para la gestión de juegos en Gaming Hub.

## Características

- CRUD completo de juegos
- Búsqueda por categoría, título y autor
- Autenticación JWT
- Control de acceso basado en roles
- Documentación Swagger

## Tecnologías

- Spring Boot 3.5.5
- Spring Data JPA
- Spring Security
- JWT
- MySQL
- Swagger/OpenAPI

## Configuración

1. Crear base de datos:
```sql
CREATE DATABASE db_Game;
```

2. Configurar `application.properties` con tus credenciales de MySQL

3. Ejecutar:
```bash
mvn spring-boot:run
```

## Endpoints

- `GET /v1/juegos` - Listar todos los juegos (público)
- `GET /v1/juegos/{id}` - Obtener juego por ID (público)
- `POST /v1/juegos` - Crear juego (Admin/Vendedor)
- `PUT /v1/juegos/{id}` - Actualizar juego (Admin/Vendedor)
- `DELETE /v1/juegos/{id}` - Eliminar juego (Admin)
- `GET /v1/juegos/categoria/{categoria}` - Filtrar por categoría (público)
- `GET /v1/juegos/search?titulo={titulo}` - Buscar por título (público)
- `GET /v1/juegos/autor/{autor}` - Filtrar por autor (público)

## Swagger

Accede a la documentación en: `http://localhost:8090/swagger-ui/index.html`

## Puerto

El microservicio corre en el puerto **8090**

