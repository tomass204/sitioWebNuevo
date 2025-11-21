package com.example.Favoritos.controller;

import com.example.Favoritos.model.Favorito;
import com.example.Favoritos.service.FavoritoService;

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
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Tag(name = "Favoritos", description = "Endpoints para gestionar favoritos de usuarios")
@RestController
@RequestMapping("/api/GamingHub/v1/Favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService service;

    @Operation(summary = "Guardar un favorito", description = "Crea un nuevo favorito para un usuario")
    @PostMapping("/guardar")
    public ResponseEntity<EntityModel<Favorito>> guardarFavorito(@RequestBody Map<String, Object> favoritoData) {
        System.out.println("guardar");
        try {
            Favorito nuevo = service.guardarFavorito(favoritoData);

            EntityModel<Favorito> recurso = EntityModel.of(nuevo,
                    linkTo(methodOn(FavoritoController.class).guardarFavorito(favoritoData)).withSelfRel(),
                    linkTo(methodOn(FavoritoController.class).eliminarFavorito(nuevo.getFavoritoID())).withRel("eliminar"),
                    linkTo(methodOn(FavoritoController.class).obtenerFavoritosPorUsuario(nuevo.getUsuarioID())).withRel("listarPorUsuario")
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Operation(summary = "Eliminar un favorito", description = "Elimina un favorito por su ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Long id) {
        try {
            service.verFavorito(id);
            service.eliminarFavorito(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Obtener favoritos por usuario", description = "Lista todos los favoritos de un usuario")
    @GetMapping("/{usuarioID}")
    public ResponseEntity<CollectionModel<EntityModel<Favorito>>> obtenerFavoritosPorUsuario(@PathVariable Long usuarioID) {
        List<Favorito> favoritos = service.obtenerFavoritosPorUsuario(usuarioID);

        if (favoritos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<EntityModel<Favorito>> recursos = favoritos.stream()
                .map(fav -> EntityModel.of(fav,
                        linkTo(methodOn(FavoritoController.class).obtenerFavoritosPorUsuario(usuarioID)).withSelfRel(),
                        linkTo(methodOn(FavoritoController.class).eliminarFavorito(fav.getFavoritoID())).withRel("eliminar")
                ))
                .collect(Collectors.toList());

        CollectionModel<EntityModel<Favorito>> collection = CollectionModel.of(recursos,
                linkTo(methodOn(FavoritoController.class).obtenerFavoritosPorUsuario(usuarioID)).withSelfRel()
        );

        return ResponseEntity.ok(collection);
    }
}
