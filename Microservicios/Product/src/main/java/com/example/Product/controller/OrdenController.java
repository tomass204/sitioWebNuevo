package com.example.Product.controller;

import com.example.Product.model.Orden;
import com.example.Product.service.OrdenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/ordenes")
@Tag(name = "Orden", description = "API para gestión de órdenes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "*"}, maxAge = 3600)
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @GetMapping
    @Operation(summary = "Obtener todas las órdenes")
    public ResponseEntity<List<Orden>> getAllOrdenes() {
        List<Orden> ordenes = ordenService.getAllOrdenes();
        return ResponseEntity.ok(ordenes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll()")
    @Operation(summary = "Obtener orden por ID")
    public ResponseEntity<Orden> getOrdenById(@PathVariable Long id) {
        return ordenService.getOrdenById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear una nueva orden")
    public ResponseEntity<Orden> createOrden(@RequestBody Orden orden) {
        // Cualquier usuario autenticado puede crear órdenes
        System.out.println("═══════════════════════════════════════════");
        System.out.println("📥 RECIBIENDO SOLICITUD DE CREAR ORDEN");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Usuario ID recibido: " + orden.getUsuarioId());
        System.out.println("Productos recibidos: " + orden.getProductoIds());
        System.out.println("Total recibido: " + orden.getTotal());
        System.out.println("Estado recibido: " + orden.getEstado());
        System.out.println("═══════════════════════════════════════════");
        
        Orden createdOrden = ordenService.createOrden(orden);
        
        System.out.println("═══════════════════════════════════════════");
        System.out.println("✅ ORDEN CREADA Y GUARDADA EN BASE DE DATOS");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Orden ID generado: " + createdOrden.getOrdenId());
        System.out.println("Usuario ID: " + createdOrden.getUsuarioId());
        System.out.println("Productos: " + createdOrden.getProductoIds());
        System.out.println("Total: " + createdOrden.getTotal());
        System.out.println("Estado: " + createdOrden.getEstado());
        System.out.println("Fecha: " + createdOrden.getFecha());
        System.out.println("═══════════════════════════════════════════");
        
        return ResponseEntity.ok(createdOrden);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PROPIETARIO') or hasRole('ROLE_MODERADOR')")
    @Operation(summary = "Actualizar orden")
    public ResponseEntity<Orden> updateOrden(@PathVariable Long id, @RequestBody Orden ordenDetails) {
        Orden updatedOrden = ordenService.updateOrden(id, ordenDetails);
        if (updatedOrden != null) {
            return ResponseEntity.ok(updatedOrden);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PROPIETARIO') or hasRole('ROLE_MODERADOR')")
    @Operation(summary = "Eliminar orden")
    public ResponseEntity<Void> deleteOrden(@PathVariable Long id) {
        if (ordenService.deleteOrden(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("permitAll()")
    @Operation(summary = "Obtener órdenes por usuario")
    public ResponseEntity<List<Orden>> getOrdenesByUsuario(@PathVariable Long usuarioId) {
        // Permitir que cualquier usuario autenticado vea sus propias órdenes
        // Vendedores y Admins pueden ver todas las órdenes
        List<Orden> ordenes = ordenService.getOrdenesByUsuario(usuarioId);
        return ResponseEntity.ok(ordenes);
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasRole('ROLE_INFLUENCER') or hasRole('ROLE_MODERADOR') or hasRole('ROLE_PROPIETARIO')")
    @Operation(summary = "Obtener órdenes por estado")
    public ResponseEntity<List<Orden>> getOrdenesByEstado(@PathVariable String estado) {
        List<Orden> ordenes = ordenService.getOrdenesByEstado(estado);
        return ResponseEntity.ok(ordenes);
    }
}
