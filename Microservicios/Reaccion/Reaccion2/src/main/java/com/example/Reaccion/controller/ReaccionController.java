package com.example.Reaccion.controller;

import com.example.Reaccion.model.Reaccion;
import com.example.Reaccion.service.ReaccionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
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
    @PostMapping
    public ResponseEntity<EntityModel<Reaccion>> crear(@RequestBody Map<String, Object> reaccionData) {
        try {
            Reaccion nueva = service.crearReaccion(reaccionData);

            Long publicacionID = "publicacion".equals(nueva.getTipoEntidad()) ? nueva.getEntidadID() : null;
            Long comentarioID = "comentario".equals(nueva.getTipoEntidad()) ? nueva.getEntidadID() : null;

            EntityModel<Reaccion> recurso = EntityModel.of(nueva,
                linkTo(methodOn(ReaccionController.class).crear(reaccionData)).withSelfRel(),
                linkTo(methodOn(ReaccionController.class).eliminar(nueva.getReaccionID())).withRel("eliminar"),
                linkTo(methodOn(ReaccionController.class).contarPorPublicacion(publicacionID)).withRel("contarPorPublicacion"),
                linkTo(methodOn(ReaccionController.class).contarPorComentario(comentarioID)).withRel("contarPorComentario")
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Eliminar una reacción", description = "Elimina una reacción por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarReaccion(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Contar reacciones de una publicación", description = "Devuelve el número de reacciones de tipo 'publicacion' para una publicación específica")
    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<Long> contarPorPublicacion(@PathVariable Long idPublicacion) {
        Long count = service.contarReaccionesPorPublicacion(idPublicacion);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "Contar reacciones de un comentario", description = "Devuelve el número de reacciones de tipo 'comentario' para un comentario específico")
    @GetMapping("/comentario/{idComentario}")
    public ResponseEntity<Long> contarPorComentario(@PathVariable Long idComentario) {
        Long count = service.contarReaccionesPorComentario(idComentario);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "Ver una reacción", description = "Devuelve una reacción específica por su ID")
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Reaccion>> ver(@PathVariable Long id) {
        Reaccion reaccion = service.verReaccion(id);

        EntityModel<Reaccion> recurso = EntityModel.of(reaccion,
            linkTo(methodOn(ReaccionController.class).ver(id)).withSelfRel(),
            linkTo(methodOn(ReaccionController.class).eliminar(id)).withRel("eliminar")
        );

        return ResponseEntity.ok(recurso);
    }

    @Operation(summary = "Listar reacciones por entidad", description = "Devuelve todas las reacciones de una entidad específica")
    @GetMapping("/listar/{tipoEntidad}/{entidadID}")
    public ResponseEntity<CollectionModel<EntityModel<Reaccion>>> listarPorEntidad(@PathVariable String tipoEntidad, @PathVariable Long entidadID) {
        java.util.List<Reaccion> reacciones = service.listarReaccionesPorEntidad(tipoEntidad, entidadID);

        java.util.List<EntityModel<Reaccion>> recursos = reacciones.stream()
            .map(reaccion -> EntityModel.of(reaccion,
                linkTo(methodOn(ReaccionController.class).ver(reaccion.getReaccionID())).withRel("ver"),
                linkTo(methodOn(ReaccionController.class).eliminar(reaccion.getReaccionID())).withRel("eliminar")
            ))
            .toList();

        CollectionModel<EntityModel<Reaccion>> collection = CollectionModel.of(recursos,
            linkTo(methodOn(ReaccionController.class).listarPorEntidad(tipoEntidad, entidadID)).withSelfRel()
        );

        return ResponseEntity.ok(collection);
    }

    @Operation(summary = "Listar likes por usuario", description = "Devuelve todas las reacciones (likes) de un usuario específico")
    @GetMapping("/usuario/{usuarioID}")
    public ResponseEntity<CollectionModel<EntityModel<Reaccion>>> listarLikesPorUsuario(@PathVariable Long usuarioID) {
        java.util.List<Reaccion> reacciones = service.listarLikesPorUsuario(usuarioID);

        java.util.List<EntityModel<Reaccion>> recursos = reacciones.stream()
            .map(reaccion -> EntityModel.of(reaccion,
                linkTo(methodOn(ReaccionController.class).ver(reaccion.getReaccionID())).withRel("ver"),
                linkTo(methodOn(ReaccionController.class).eliminar(reaccion.getReaccionID())).withRel("eliminar")
            ))
            .toList();

        CollectionModel<EntityModel<Reaccion>> collection = CollectionModel.of(recursos,
            linkTo(methodOn(ReaccionController.class).listarLikesPorUsuario(usuarioID)).withSelfRel()
        );

        return ResponseEntity.ok(collection);
    }
}
