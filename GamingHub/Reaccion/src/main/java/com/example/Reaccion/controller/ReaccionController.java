package com.example.Reaccion.controller;

import com.example.Reaccion.model.Reaccion;
import com.example.Reaccion.service.ReaccionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Tag(name = "Reacciones", description = "Endpoints para gestionar reacciones de publicaciones y comentarios")
@RestController
@RequestMapping("/api/GamingHub/v1/Reacciones")
public class ReaccionController {

    @Autowired
    private ReaccionService service;


     @Operation(summary = "Crear o actualizar una reacción", description = "Crea una nueva reacción o actualiza el tipo si ya existe")
    // Crear una reacción
    @PostMapping
    public ResponseEntity<EntityModel<Reaccion>> crear(@RequestBody Map<String, Object> reaccionData) {
        try {
            Reaccion nueva = service.crearReaccion(reaccionData);

            // Determinar IDs según tipo de entidad
            Long publicacionID = "publicacion".equals(nueva.getTipoEntidad()) ? nueva.getEntidadID() : null;
            Long comentarioID = "comentario".equals(nueva.getTipoEntidad()) ? nueva.getEntidadID() : null;

            EntityModel<Reaccion> recurso = EntityModel.of(nueva,
                linkTo(methodOn(ReaccionController.class).crear(reaccionData)).withSelfRel(),
                linkTo(methodOn(ReaccionController.class).eliminar(nueva.getReaccionID())).withRel("eliminar"),
                linkTo(methodOn(ReaccionController.class).contarPorPublicacion(publicacionID)).withRel("contarPorPublicacion"),
                linkTo(methodOn(ReaccionController.class).contarPorComentario(comentarioID)).withRel("contarPorComentario")
            );

            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Eliminar una reacción", description = "Elimina una reacción por su ID")
    // Eliminar una reacción
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarReaccion(id);
        return ResponseEntity.noContent().build();
    }

     @Operation(summary = "Contar reacciones de una publicación", description = "Devuelve el número de reacciones de tipo 'publicacion' para una publicación específica")
    // Contar reacciones de una publicación
    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<EntityModel<Long>> contarPorPublicacion(@PathVariable Long idPublicacion) {
        Long count = service.contarReaccionesPorPublicacion(idPublicacion);

        EntityModel<Long> recurso = EntityModel.of(count,
            linkTo(methodOn(ReaccionController.class).contarPorPublicacion(idPublicacion)).withSelfRel()
        );

        return ResponseEntity.ok(recurso);
    }

    
    // Contar reacciones de un comentario
    @GetMapping("/comentario/{idComentario}")
    public ResponseEntity<EntityModel<Long>> contarPorComentario(@PathVariable Long idComentario) {
        Long count = service.contarReaccionesPorComentario(idComentario);

        EntityModel<Long> recurso = EntityModel.of(count,
            linkTo(methodOn(ReaccionController.class).contarPorComentario(idComentario)).withSelfRel()
        );

        return ResponseEntity.ok(recurso);
    }
}
