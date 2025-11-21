package com.example.ComentariosYRespuestas.controller;

import com.example.ComentariosYRespuestas.model.Comentario;
import com.example.ComentariosYRespuestas.service.ComentarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
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

        if (comentarios.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

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
    try {
        Comentario nuevo = service.crearComentario(comentarioData);
        EntityModel<Comentario> recurso = EntityModel.of(nuevo,
                linkTo(methodOn(ComentarioController.class).verComentario(nuevo.getComentarioID())).withSelfRel(),
                linkTo(methodOn(ComentarioController.class).editarComentario(null, nuevo.getComentarioID())).withRel("editar"),
                linkTo(methodOn(ComentarioController.class).eliminarComentario(nuevo.getComentarioID())).withRel("eliminar")
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(recurso);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    } catch (NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}


    // ===== Editar comentario =====
    @Operation(summary = "Editar un comentario", description = "Actualiza un comentario existente por su ID")
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Comentario>> editarComentario(@RequestBody Map<String, Object> comentarioData, @PathVariable Long id) {
        try {
            Comentario actualizado = service.editarComentario(comentarioData, id);

            EntityModel<Comentario> recurso = EntityModel.of(actualizado,
                    linkTo(methodOn(ComentarioController.class).verComentario(id)).withSelfRel(),
                    linkTo(methodOn(ComentarioController.class).eliminarComentario(id)).withRel("eliminar")
            );

            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ===== Eliminar comentario =====
    @Operation(summary = "Eliminar un comentario", description = "Elimina un comentario por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarComentario(@PathVariable Long id) {
        try {
            service.eliminarComentario(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ===== Ver un comentario =====
    @Operation(summary = "Ver un comentario", description = "Devuelve un comentario específico por su ID")
    @GetMapping("/ver/{id}")
    public ResponseEntity<EntityModel<Comentario>> verComentario(@PathVariable Long id) {
        try {
            Comentario comentario = service.verComentario(id);

            EntityModel<Comentario> recurso = EntityModel.of(comentario,
                    linkTo(methodOn(ComentarioController.class).editarComentario(null, id)).withRel("editar"),
                    linkTo(methodOn(ComentarioController.class).eliminarComentario(id)).withRel("eliminar"),
                    linkTo(methodOn(ComentarioController.class).verComentario(id)).withSelfRel()
            );

            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ===== Contar comentarios por publicación =====
    @Operation(summary = "Contar comentarios por publicación", description = "Devuelve el número de comentarios de una publicación específica")
    @GetMapping("/publicacion/{idPublicacion}/count")
    public ResponseEntity<Long> contarComentariosPorPublicacion(@PathVariable Long idPublicacion) {
        Long count = service.contarComentariosPorPublicacion(idPublicacion);
        return ResponseEntity.ok(count);
    }
}
