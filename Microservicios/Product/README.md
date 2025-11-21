# Product Microservice

This microservice manages products and orders for the Gaming Hub application.

## Features

- CRUD operations for products
- CRUD operations for orders
- JWT-based authentication and authorization
- Role-based access control (Admin, Vendedor, Cliente)
- Swagger API documentation
- MySQL database integration

## Technologies

- Spring Boot 3.5.7
- Spring Data JPA
- Spring Security
- JWT
- Spring WebFlux
- MySQL
- Swagger/OpenAPI

## API Endpoints

### Products
- GET /v1/productos - List all products (public)
- GET /v1/productos/{id} - Get product by ID (public)
- POST /v1/productos - Create product (Admin only)
- PUT /v1/productos/{id} - Update product (Admin only)
- DELETE /v1/productos/{id} - Delete product (Admin only)
- GET /v1/productos/categoria/{categoria} - Get products by category (public)
- GET /v1/productos/search - Search products by name (public)

### Orders
- GET /v1/ordenes - List all orders (Vendedor/Admin)
- GET /v1/ordenes/{id} - Get order by ID (Vendedor/Admin)
- POST /v1/ordenes - Create order (Cliente/Admin)
- PUT /v1/ordenes/{id} - Update order (Admin only)
- DELETE /v1/ordenes/{id} - Delete order (Admin only)
- GET /v1/ordenes/usuario/{usuarioId} - Get orders by user (Vendedor/Admin or own)
- GET /v1/ordenes/estado/{estado} - Get orders by status (Vendedor/Admin)

## Database Schema

### Productos
- producto_id (PK)
- nombre
- descripcion
- precio
- categoria
- imagen_url
- activo

### Ordenes
- orden_id (PK)
- usuario_id
- producto_ids (JSON array)
- fecha
- total
- estado

## Running the Application

1. Ensure MySQL is running
2. Update application.properties with correct DB credentials
3. Run `./gradlew bootRun`
4. Access Swagger UI at http://localhost:8083/swagger-ui.html

## Integration

This microservice integrates with the Usuarios microservice for authentication and user role validation.
