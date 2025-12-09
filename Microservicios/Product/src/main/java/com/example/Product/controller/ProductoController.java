package com.example.Product.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.Product.model.Producto;
import com.example.Product.service.ProductoService;

import java.util.List;

@RestController
@RequestMapping("/v1/productos")
@Tag(name = "Producto", description = "API para gestión de productos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"}, maxAge = 3600)
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    @Operation(summary = "Obtener todos los productos")
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo producto")
    public ResponseEntity<?> createProducto(@RequestBody Producto producto) {
        try {
            // Validar campos requeridos
            if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "El nombre es requerido"));
            }
            if (producto.getPrecio() == null || producto.getPrecio().compareTo(java.math.BigDecimal.ZERO) < 0) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "El precio debe ser mayor o igual a cero"));
            }

            // Establecer valores por defecto
            if (producto.getActivo() == null) {
                producto.setActivo(true);
            }

            Producto createdProducto = productoService.createProducto(producto);
            return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(createdProducto);
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error al crear el producto: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto")
    public ResponseEntity<?> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        try {
            Producto updatedProducto = productoService.updateProducto(id, productoDetails);
            if (updatedProducto != null) {
                return ResponseEntity.ok(updatedProducto);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error al actualizar el producto: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        if (productoService.deleteProducto(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/categoria/{categoria}")
    @Operation(summary = "Obtener productos por categoría")
    public ResponseEntity<List<Producto>> getProductosByCategoria(@PathVariable String categoria) {
        List<Producto> productos = productoService.getProductosByCategoria(categoria);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar productos por nombre")
    public ResponseEntity<List<Producto>> searchProductos(@RequestParam String nombre) {
        List<Producto> productos = productoService.searchProductos(nombre);
        return ResponseEntity.ok(productos);
    }
}
