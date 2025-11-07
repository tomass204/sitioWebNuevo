package com.example.Noticias.Publicaciones.controller;

import com.example.Noticias.Publicaciones.model.Publicacion;
import com.example.Noticias.Publicaciones.service.PublicacionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Tag(name = "Publicaciones", description = "Endpoints para gestionar publicaciones")
@RestController
@RequestMapping("/api/GamingHub/v1/Publicaciones")
public class PublicacionController {

    @Autowired
    private PublicacionService service;

    // ===== LISTAR TODAS LAS PUBLICACIONES =====
    @Operation(summary = "Listar todas las publicaciones", description = "Devuelve todas las publicaciones registradas")
    @GetMapping
    public ResponseEntity<List<Publicacion>> listarPublicaciones() {
        List<Publicacion> publicaciones = service.listarTodas();
        return ResponseEntity.ok(publicaciones);
    }

    // ===== VER PUBLICACIÓN POR ID =====
    @Operation(summary = "Ver una publicación", description = "Obtiene una publicación específica por su ID")
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Publicacion>> verPublicacion(@PathVariable Long id) {
        Publicacion publicacion = service.verPublicacion(id);

        EntityModel<Publicacion> recurso = EntityModel.of(publicacion,
            linkTo(methodOn(PublicacionController.class).verPublicacion(id)).withSelfRel(),
            linkTo(methodOn(PublicacionController.class).editarPublicacion(null, id)).withRel("editar"),
            linkTo(methodOn(PublicacionController.class).eliminarPublicacion(id)).withRel("eliminar"),
            linkTo(methodOn(PublicacionController.class).destacarPublicacion(id)).withRel("destacar")
        );

        return ResponseEntity.ok(recurso);
    }

    // ===== CREAR PUBLICACIÓN =====
    @Operation(summary = "Crear una publicación", description = "Crea una nueva publicación")
    @PostMapping
    public ResponseEntity<EntityModel<Publicacion>> crearPublicacion(@RequestBody Map<String, Object> publicacionData) {
        try {
            Publicacion nueva = service.crearPublicacion(publicacionData);

            EntityModel<Publicacion> recurso = EntityModel.of(nueva,
                linkTo(methodOn(PublicacionController.class).verPublicacion(nueva.getPublicacionID())).withSelfRel(),
                linkTo(methodOn(PublicacionController.class).editarPublicacion(null, nueva.getPublicacionID())).withRel("editar"),
                linkTo(methodOn(PublicacionController.class).eliminarPublicacion(nueva.getPublicacionID())).withRel("eliminar"),
                linkTo(methodOn(PublicacionController.class).destacarPublicacion(nueva.getPublicacionID())).withRel("destacar")
            );

            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== EDITAR PUBLICACIÓN =====
    @Operation(summary = "Editar una publicación", description = "Actualiza los datos de una publicación existente")
    @PatchMapping("/{id}")
    public ResponseEntity<EntityModel<Publicacion>> editarPublicacion(@RequestBody Map<String, Object> publicacionData,
                                                                       @PathVariable Long id) {
        Publicacion actualizada = service.editarPublicacion(publicacionData, id);

        EntityModel<Publicacion> recurso = EntityModel.of(actualizada,
            linkTo(methodOn(PublicacionController.class).verPublicacion(id)).withSelfRel(),
            linkTo(methodOn(PublicacionController.class).eliminarPublicacion(id)).withRel("eliminar"),
            linkTo(methodOn(PublicacionController.class).destacarPublicacion(id)).withRel("destacar")
        );

        return ResponseEntity.ok(recurso);
    }

    // ===== ELIMINAR PUBLICACIÓN =====
    @Operation(summary = "Eliminar una publicación", description = "Elimina una publicación por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPublicacion(@PathVariable Long id) {
        service.eliminarPublicacion(id);
        return ResponseEntity.noContent().build();
    }

    // ===== DESTACAR PUBLICACIÓN =====
    @Operation(summary = "Destacar una publicación", description = "Marca una publicación como destacada")
    @PatchMapping("/{id}/destacar")
    public ResponseEntity<EntityModel<Publicacion>> destacarPublicacion(@PathVariable Long id) {
        Publicacion publicacion = service.destacarPublicacion(id);

        EntityModel<Publicacion> recurso = EntityModel.of(publicacion,
            linkTo(methodOn(PublicacionController.class).verPublicacion(id)).withSelfRel(),
            linkTo(methodOn(PublicacionController.class).editarPublicacion(null, id)).withRel("editar"),
            linkTo(methodOn(PublicacionController.class).eliminarPublicacion(id)).withRel("eliminar")
        );

        return ResponseEntity.ok(recurso);
    }
}
