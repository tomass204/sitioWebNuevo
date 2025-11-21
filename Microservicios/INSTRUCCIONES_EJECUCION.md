# Instrucciones de Ejecución de Microservicios

Este documento explica cómo configurar y ejecutar todos los microservicios necesarios para el sistema de e-commerce.

## Microservicios Requeridos

1. **auth-service** (Puerto 8081) - Autenticación y registro
2. **Usuarios** (Puerto 8081) - Gestión de usuarios (alternativo)
3. **Product** (Puerto 8082) - Gestión de productos y órdenes
4. **Game** (Puerto 8090) - Gestión de juegos

## Requisitos Previos

- Java 17 o superior
- Maven 3.6 o superior
- MySQL 8.0 o superior
- Node.js 16+ (para el frontend)

## Configuración de Base de Datos

Ejecuta los siguientes comandos SQL para crear las bases de datos:

```sql
CREATE DATABASE IF NOT EXISTS ecommerce_db;
CREATE DATABASE IF NOT EXISTS db_usuarios;
CREATE DATABASE IF NOT EXISTS db_Product;
CREATE DATABASE IF NOT EXISTS db_Game;
```

## Configuración de Microservicios

### 1. auth-service (Puerto 8081)

**Ubicación:** `Microservicios/auth-service`

**Configuración:** Edita `src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db
    username: root
    password: tu_password
```

**Ejecutar:**
```bash
cd Microservicios/auth-service
mvn spring-boot:run
```

**Verificar:** `http://localhost:8081/actuator/health`

### 2. Usuarios (Puerto 8081) - Alternativo

**Ubicación:** `Microservicios/Usuarios`

**Configuración:** Edita `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/db_usuarios
spring.datasource.username=root
spring.datasource.password=tu_password
```

**Nota:** Si usas este microservicio, cambia el puerto a 8087 para evitar conflicto con auth-service.

**Ejecutar:**
```bash
cd Microservicios/Usuarios
mvn spring-boot:run
```

**Verificar:** `http://localhost:8081/api/GamingHub/v1/Usuario`

### 3. Product (Puerto 8082)

**Ubicación:** `Microservicios/Product`

**Configuración:** Edita `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/db_Product
spring.datasource.username=root
spring.datasource.password=tu_password
```

**Ejecutar:**
```bash
cd Microservicios/Product
./gradlew bootRun
# O si usas Maven (si hay pom.xml):
mvn spring-boot:run
```

**Verificar:** 
- API: `http://localhost:8082/v1/productos`
- Swagger: `http://localhost:8082/swagger-ui/index.html`

### 4. Game (Puerto 8090)

**Ubicación:** `Microservicios/Game`

**Configuración:** Edita `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/db_Game
spring.datasource.username=root
spring.datasource.password=tu_password
```

**Ejecutar:**
```bash
cd Microservicios/Game
mvn spring-boot:run
```

**Verificar:**
- API: `http://localhost:8090/v1/juegos`
- Swagger: `http://localhost:8090/swagger-ui/index.html`

## Orden de Ejecución Recomendado

1. **MySQL** - Asegúrate de que MySQL esté corriendo
2. **auth-service** o **Usuarios** - Para autenticación
3. **Product** - Para productos y órdenes
4. **Game** - Para juegos
5. **Frontend** - React application

## Verificación de Microservicios

### Verificar que todos estén corriendo:

```bash
# Verificar auth-service
curl http://localhost:8081/actuator/health

# Verificar Product
curl http://localhost:8082/v1/productos

# Verificar Game
curl http://localhost:8090/v1/juegos
```

## Configuración del Frontend

El frontend debe estar configurado para apuntar a estos microservicios:

- **Auth Service:** `http://localhost:8081`
- **Product Service:** `http://localhost:8082`
- **Game Service:** `http://localhost:8090`
- **Usuarios Service:** `http://localhost:8081` (si usas el microservicio de Usuarios)

## Solución de Problemas

### Puerto ya en uso

Si un puerto está ocupado, puedes cambiarlo en el archivo de configuración correspondiente:

- `application.properties` o `application.yml`
- Busca `server.port` y cambia el valor

### Error de conexión a base de datos

1. Verifica que MySQL esté corriendo
2. Verifica las credenciales en los archivos de configuración
3. Verifica que las bases de datos existan

### Error de autenticación JWT

1. Verifica que el `jwt.secret` sea el mismo en todos los microservicios
2. Verifica que el token se esté enviando correctamente en los headers

## Script de Inicio Rápido (Windows)

Crea un archivo `start-all.bat`:

```batch
@echo off
echo Iniciando microservicios...

start "Auth Service" cmd /k "cd Microservicios\auth-service && mvn spring-boot:run"
timeout /t 5
start "Product Service" cmd /k "cd Microservicios\Product && gradlew bootRun"
timeout /t 5
start "Game Service" cmd /k "cd Microservicios\Game && mvn spring-boot:run"

echo Todos los microservicios están iniciando...
```

## Script de Inicio Rápido (Linux/Mac)

Crea un archivo `start-all.sh`:

```bash
#!/bin/bash

echo "Iniciando microservicios..."

cd Microservicios/auth-service && mvn spring-boot:run &
sleep 5

cd ../Product && ./gradlew bootRun &
sleep 5

cd ../Game && mvn spring-boot:run &

echo "Todos los microservicios están iniciando..."
```

## Notas Importantes

1. **Puertos:** Asegúrate de que no haya conflictos de puertos
2. **Base de Datos:** Cada microservicio necesita su propia base de datos
3. **JWT Secret:** Debe ser el mismo en todos los microservicios que usan JWT
4. **CORS:** Los microservicios están configurados para aceptar peticiones del frontend

## Endpoints Principales

### Auth Service
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse

### Product Service
- `GET /v1/productos` - Listar productos
- `POST /v1/productos` - Crear producto (Admin)
- `GET /v1/ordenes` - Listar órdenes (Vendedor/Admin)

### Game Service
- `GET /v1/juegos` - Listar juegos
- `POST /v1/juegos` - Crear juego (Admin/Vendedor)

### Usuarios Service
- `POST /api/GamingHub/v1/Usuario/iniciar-session` - Iniciar sesión
- `POST /api/GamingHub/v1/Usuario` - Crear usuario

---

**Última actualización:** 2024

