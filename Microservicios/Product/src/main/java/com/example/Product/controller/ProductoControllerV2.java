package main.java.com.example.Product.controller;

import main.java.com.example.Product.model.Producto;
import main.java.com.example.Product.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v2/productos")
@Tag(name = "Producto V2", description = "API v2 para gestión de productos con estadísticas detalladas")
public class ProductoControllerV2 {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    @Operation(summary = "Obtener todos los productos con estadísticas detalladas")
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.getAllProductos();
        return ResponseEntity.ok(productos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PROPIETARIO') or hasRole('ROLE_MODERADOR')")
    @Operation(summary = "Actualizar producto con validaciones mejoradas")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        Producto updatedProducto = productoService.updateProducto(id, productoDetails);
        if (updatedProducto != null) {
            return ResponseEntity.ok(updatedProducto);
        }
        return ResponseEntity.notFound().build();
    }
}

