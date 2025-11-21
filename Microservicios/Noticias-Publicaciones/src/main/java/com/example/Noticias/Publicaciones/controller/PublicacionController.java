package com.example.Noticias.Publicaciones.controller;

import com.example.Noticias.Publicaciones.model.Publicacion;
import com.example.Noticias.Publicaciones.service.PublicacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.*;
import java.util.stream.Collectors;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Tag(name = "Publicaciones", description = "Endpoints para gestionar publicaciones")
@RestController
@RequestMapping("/api/GamingHub/v1/Publicaciones")
public class PublicacionController {

    @Autowired
    private PublicacionService service;

    // ===== LISTAR TODAS =====
    @Operation(summary = "Listar todas las publicaciones")
    @GetMapping("/listar")
    public ResponseEntity<CollectionModel<EntityModel<Publicacion>>> listarPublicaciones() {
        List<Publicacion> publicaciones = service.listarTodas();
        if (publicaciones.isEmpty()) return ResponseEntity.noContent().build();

        List<EntityModel<Publicacion>> recursos = publicaciones.stream()
                .map(pub -> EntityModel.of(pub,
                        linkTo(methodOn(PublicacionController.class).verPublicacion(pub.getPublicacionID())).withSelfRel(),
                        linkTo(methodOn(PublicacionController.class).editarPublicacion(null, pub.getPublicacionID())).withRel("editar"),
                        linkTo(methodOn(PublicacionController.class).eliminarPublicacion(pub.getPublicacionID())).withRel("eliminar"),
                        linkTo(methodOn(PublicacionController.class).destacarPublicacion(pub.getPublicacionID())).withRel("destacar")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(CollectionModel.of(recursos));
    }

    // ===== VER POR ID =====
    @Operation(summary = "Ver publicación por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Publicacion> verPublicacion(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.verPublicacion(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // ===== CREAR =====
    @Operation(summary = "Crear publicación")
    @PostMapping(
            value = "/crear",
            consumes = { MediaType.MULTIPART_FORM_DATA_VALUE }
    )
    public ResponseEntity<Publicacion> crearPublicacion(
            @RequestPart("data") Map<String, Object> data,
            @RequestPart(value = "imagenes", required = false) List<MultipartFile> archivos) {
        Publicacion nueva = service.crearPublicacion(data, archivos);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }


    // ===== EDITAR =====
    @Operation(summary = "Editar publicación")
    @PatchMapping("/{id}")
    public ResponseEntity<Publicacion> editarPublicacion(@RequestBody Map<String, Object> data, @PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.editarPublicacion(data, id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // ===== ELIMINAR =====
    @Operation(summary = "Eliminar publicación")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPublicacion(@PathVariable Long id) {
        try {
            service.eliminarPublicacion(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // ===== DESTACAR =====
    @Operation(summary = "Destacar publicación")
    @PatchMapping("/{id}/destacar")
    public ResponseEntity<Publicacion> destacarPublicacion(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.destacarPublicacion(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
