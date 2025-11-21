package com.example.Game.controller;

import com.example.Game.model.Juego;
import com.example.Game.service.JuegoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/juegos")
@Tag(name = "Juego", description = "API para gestión de juegos")
public class JuegoController {

    @Autowired
    private JuegoService juegoService;

    @GetMapping
    @Operation(summary = "Obtener todos los juegos")
    public ResponseEntity<List<Juego>> getAllJuegos() {
        List<Juego> juegos = juegoService.getAllJuegos();
        return ResponseEntity.ok(juegos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener juego por ID")
    public ResponseEntity<Juego> getJuegoById(@PathVariable Long id) {
        return juegoService.getJuegoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_MODERADOR') or hasRole('ROLE_PROPIETARIO')")
    @Operation(summary = "Crear un nuevo juego")
    public ResponseEntity<Juego> createJuego(@RequestBody Juego juego) {
        System.out.println("═══════════════════════════════════════════");
        System.out.println("📥 RECIBIENDO SOLICITUD DE CREAR JUEGO");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Título recibido: " + juego.getTitulo());
        System.out.println("Categoría recibida: " + juego.getCategoria());
        System.out.println("Descripción recibida: " + juego.getDescripcion());
        System.out.println("Autor recibido: " + juego.getAutor());
        System.out.println("Precio recibido: " + juego.getPrecio());
        System.out.println("Imagen URL recibida: " + juego.getImagenUrl());
        System.out.println("═══════════════════════════════════════════");
        
        Juego createdJuego = juegoService.createJuego(juego);
        
        System.out.println("═══════════════════════════════════════════");
        System.out.println("✅ JUEGO CREADO Y RETORNADO");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Juego ID: " + createdJuego.getJuegoId());
        System.out.println("═══════════════════════════════════════════");
        
        return ResponseEntity.ok(createdJuego);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_INFLUENCER') or hasRole('ROLE_MODERADOR') or hasRole('ROLE_PROPIETARIO')")
    @Operation(summary = "Actualizar juego")
    public ResponseEntity<Juego> updateJuego(@PathVariable Long id, @RequestBody Juego juegoDetails) {
        Juego updatedJuego = juegoService.updateJuego(id, juegoDetails);
        if (updatedJuego != null) {
            return ResponseEntity.ok(updatedJuego);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_PROPIETARIO') or hasRole('ROLE_MODERADOR')")
    @Operation(summary = "Eliminar juego")
    public ResponseEntity<Void> deleteJuego(@PathVariable Long id) {
        if (juegoService.deleteJuego(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/categoria/{categoria}")
    @Operation(summary = "Obtener juegos por categoría")
    public ResponseEntity<List<Juego>> getJuegosByCategoria(@PathVariable String categoria) {
        List<Juego> juegos = juegoService.getJuegosByCategoria(categoria);
        return ResponseEntity.ok(juegos);
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar juegos por título")
    public ResponseEntity<List<Juego>> searchJuegos(@RequestParam String titulo) {
        List<Juego> juegos = juegoService.searchJuegos(titulo);
        return ResponseEntity.ok(juegos);
    }

    @GetMapping("/autor/{autor}")
    @Operation(summary = "Obtener juegos por autor")
    public ResponseEntity<List<Juego>> getJuegosByAutor(@PathVariable String autor) {
        List<Juego> juegos = juegoService.getJuegosByAutor(autor);
        return ResponseEntity.ok(juegos);
    }
}

