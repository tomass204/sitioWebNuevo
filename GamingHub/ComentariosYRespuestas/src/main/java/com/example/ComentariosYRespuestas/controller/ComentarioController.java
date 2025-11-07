package com.example.ComentariosYRespuestas.controller;

import com.example.ComentariosYRespuestas.model.Comentario;
import com.example.ComentariosYRespuestas.service.ComentarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Tag(name = "Comentarios", description = "Endpoints para gestionar comentarios de publicaciones")
@RestController
@RequestMapping("/api/GamingHub/v1/Comentarios")
public class ComentarioController {

    @Autowired
    private ComentarioService service;

    // ===== Listar comentarios por publicación =====
    @Operation(summary = "Listar comentarios por publicación", description = "Devuelve todos los comentarios de una publicación específica")
    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<CollectionModel<EntityModel<Comentario>>> listarComentariosPorPublicacion(@PathVariable Long idPublicacion) {
        List<Comentario> comentarios = service.listarComentariosPorPublicacion(idPublicacion);

        List<EntityModel<Comentario>> recursos = comentarios.stream()
                .map(c -> EntityModel.of(c,
                        linkTo(methodOn(ComentarioController.class).verComentario(c.getComentarioID())).withSelfRel(),
                        linkTo(methodOn(ComentarioController.class).editarComentario(null, c.getComentarioID())).withRel("editar"),
                        linkTo(methodOn(ComentarioController.class).eliminarComentario(c.getComentarioID())).withRel("eliminar")
                ))
                .collect(Collectors.toList());

        CollectionModel<EntityModel<Comentario>> collection = CollectionModel.of(recursos,
                linkTo(methodOn(ComentarioController.class).listarComentariosPorPublicacion(idPublicacion)).withSelfRel()
        );

        return ResponseEntity.ok(collection);
    }

    // ===== Crear comentario =====
    @Operation(summary = "Crear un comentario", description = "Crea un nuevo comentario para una publicación")
    @PostMapping
    public ResponseEntity<EntityModel<Comentario>> crearComentario(@RequestBody Map<String, Object> comentarioData) {
        Comentario nuevo = service.crearComentario(comentarioData);

        EntityModel<Comentario> recurso = EntityModel.of(nuevo,
                linkTo(methodOn(ComentarioController.class).verComentario(nuevo.getComentarioID())).withSelfRel(),
                linkTo(methodOn(ComentarioController.class).editarComentario(null, nuevo.getComentarioID())).withRel("editar"),
                linkTo(methodOn(ComentarioController.class).eliminarComentario(nuevo.getComentarioID())).withRel("eliminar")
        );

        return ResponseEntity.ok(recurso);
    }

    // ===== Editar comentario =====
    @Operation(summary = "Editar un comentario", description = "Actualiza un comentario existente por su ID")
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Comentario>> editarComentario(@RequestBody Map<String, Object> comentarioData, @PathVariable Long id) {
        Comentario actualizado = service.editarComentario(comentarioData, id);

        EntityModel<Comentario> recurso = EntityModel.of(actualizado,
                linkTo(methodOn(ComentarioController.class).verComentario(id)).withSelfRel(),
                linkTo(methodOn(ComentarioController.class).eliminarComentario(id)).withRel("eliminar")
        );

        return ResponseEntity.ok(recurso);
    }

    // ===== Eliminar comentario =====
    @Operation(summary = "Eliminar un comentario", description = "Elimina un comentario por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<EntityModel<String>> eliminarComentario(@PathVariable Long id) {
        service.eliminarComentario(id);

        EntityModel<String> recurso = EntityModel.of("Comentario eliminado exitosamente",
                linkTo(methodOn(ComentarioController.class).listarComentariosPorPublicacion(null)).withRel("listar")
        );

        return ResponseEntity.ok(recurso);
    }

    // ===== Ver un comentario =====
    @Operation(summary = "Ver un comentario", description = "Devuelve un comentario específico por su ID")
    @GetMapping("/ver/{id}")
    public ResponseEntity<EntityModel<Comentario>> verComentario(@PathVariable Long id) {
        Comentario comentario = service.verComentario(id);

        EntityModel<Comentario> recurso = EntityModel.of(comentario,
                linkTo(methodOn(ComentarioController.class).editarComentario(null, id)).withRel("editar"),
                linkTo(methodOn(ComentarioController.class).eliminarComentario(id)).withRel("eliminar"),
                linkTo(methodOn(ComentarioController.class).verComentario(id)).withSelfRel()
        );

        return ResponseEntity.ok(recurso);
    }
}
