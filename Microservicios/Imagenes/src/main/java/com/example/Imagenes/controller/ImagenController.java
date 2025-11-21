package com.example.Imagenes.controller;

import com.example.Imagenes.model.Imagen;
import com.example.Imagenes.service.ImagenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/GamingHub/v1/Imagen")
@Tag(name = "Imagen", description = "API para gestión de imágenes")
public class ImagenController {

    @Autowired
    private ImagenService imagenService;

    @PostMapping("/subir")
    @Operation(summary = "Subir imágenes", description = "Sube múltiples imágenes asociadas a una entidad")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imágenes subidas exitosamente",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = Imagen.class))),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos", content = @Content)
    })
    public ResponseEntity<List<EntityModel<Imagen>>> subirImagenes(
            @Parameter(description = "ID de la entidad") @RequestParam("entidadID") @NotNull @Min(1) Long entidadId,
            @Parameter(description = "Tipo de entidad") @RequestParam("tipoEntidad") @NotNull @NotBlank String tipoEntidad,
            @Parameter(description = "Archivos de imagen") @RequestParam("archivos") List<MultipartFile> archivos) {
        List<Imagen> imagenes = imagenService.crear(entidadId, tipoEntidad, archivos);
        List<EntityModel<Imagen>> entityModels = imagenes.stream()
            .map(imagen -> EntityModel.of(imagen,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ImagenController.class).obtenerImagenPorId(imagen.getImagenID())).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ImagenController.class).buscarPorEntidad(imagen.getEntidadID(), imagen.getTipoEntidad())).withRel("buscar-por-entidad")))
            .collect(Collectors.toList());
        return ResponseEntity.ok(entityModels);
    }

    @GetMapping("/buscar-por-entidad")
    @Operation(summary = "Buscar imágenes por entidad", description = "Busca todas las imágenes activas asociadas a una entidad específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imágenes encontradas",
                     content = @Content(mediaType = "application/json", schema = @Schema(implementation = Imagen.class))),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos", content = @Content)
    })
    public ResponseEntity<List<EntityModel<Imagen>>> buscarPorEntidad(
            @Parameter(description = "ID de la entidad") @RequestParam("entidadID") @NotNull @Min(1) Long entidadId,
            @Parameter(description = "Tipo de entidad") @RequestParam("tipoEntidad") @NotNull @NotBlank String tipoEntidad) {
        List<Imagen> imagenes = imagenService.buscarPorEntidad(entidadId, tipoEntidad);
        List<EntityModel<Imagen>> entityModels = imagenes.stream()
            .map(imagen -> EntityModel.of(imagen,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ImagenController.class).obtenerImagenPorId(imagen.getImagenID())).withSelfRel()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(entityModels);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener imagen por ID", description = "Obtiene una imagen específica por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Imagen encontrada", content = @Content(mediaType = "image/*")),
        @ApiResponse(responseCode = "404", description = "Imagen no encontrada", content = @Content)
    })
    public ResponseEntity<Resource> obtenerImagenPorId(@Parameter(description = "ID de la imagen") @PathVariable Long id) {
        return imagenService.obtenerImagenPorId(id)
                .map(recurso -> {
                    MediaType tipo = imagenService.obtenerContentType(recurso);
                    return ResponseEntity.ok()
                            .contentType(tipo)
                            .body(recurso);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
