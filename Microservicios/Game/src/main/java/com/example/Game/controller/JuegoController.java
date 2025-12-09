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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"}, maxAge = 3600)
public class JuegoController {

    @Autowired
    private JuegoService juegoService;

    @GetMapping
    @Operation(summary = "Obtener todos los juegos activos")
    public ResponseEntity<List<Juego>> getAllJuegos() {
        try {
            List<Juego> juegos = juegoService.getAllJuegos();
            return ResponseEntity.ok(juegos);
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener juego por ID")
    public ResponseEntity<?> getJuegoById(@PathVariable Long id) {
        try {
            return juegoService.getJuegoById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error al obtener el juego: " + e.getMessage()));
        }
    }

 @PostMapping
@Operation(summary = "Crear un nuevo juego")
public ResponseEntity<?> createJuego(@RequestBody Juego juego) {
    try {
        if (juego.getTitulo() == null || juego.getTitulo().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "El título es requerido"));
        }
        if (juego.getCategoria() == null || juego.getCategoria().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "La categoría es requerida"));
        }
        if (juego.getAutor() == null || juego.getAutor().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "El autor es requerido"));
        }
        if (juego.getPrecio() == null || juego.getPrecio().compareTo(java.math.BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "El precio debe ser mayor o igual a cero"));
        }
        if (juego.getImagenUrl() == null || juego.getImagenUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "La URL de la imagen es requerida"));
        }

        if (juego.getActivo() == null) {
            juego.setActivo(true);
        }
        if (juego.getFechaCreacion() == null) {
            juego.setFechaCreacion(java.time.LocalDateTime.now());
        }

        Juego createdJuego = juegoService.createJuego(juego);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(createdJuego);

    } catch (Exception e) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
            .body(java.util.Map.of("error", "Error al crear el juego: " + e.getMessage()));
    }
}


    @PutMapping("/{id}")
    @Operation(summary = "Actualizar juego")
    public ResponseEntity<?> updateJuego(@PathVariable Long id, @RequestBody Juego juegoDetails) {
        try {
            Juego updatedJuego = juegoService.updateJuego(id, juegoDetails);
            if (updatedJuego != null) {
                return ResponseEntity.ok(updatedJuego);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error al actualizar el juego: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar juego (marca como inactivo)")
    public ResponseEntity<?> deleteJuego(@PathVariable Long id) {
        try {
            if (juegoService.deleteJuego(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error al eliminar el juego: " + e.getMessage()));
        }
    }

    @GetMapping("/categoria/{categoria}")
    @Operation(summary = "Obtener juegos por categoría")
    public ResponseEntity<List<Juego>> getJuegosByCategoria(@PathVariable String categoria) {
        try {
            List<Juego> juegos = juegoService.getJuegosByCategoria(categoria);
            return ResponseEntity.ok(juegos);
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar juegos por título")
    public ResponseEntity<List<Juego>> searchJuegos(@RequestParam String titulo) {
        try {
            if (titulo == null || titulo.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            List<Juego> juegos = juegoService.searchJuegos(titulo);
            return ResponseEntity.ok(juegos);
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/autor/{autor}")
    @Operation(summary = "Obtener juegos por autor")
    public ResponseEntity<List<Juego>> getJuegosByAutor(@PathVariable String autor) {
        try {
            List<Juego> juegos = juegoService.getJuegosByAutor(autor);
            return ResponseEntity.ok(juegos);
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

