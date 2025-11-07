package com.example.Usuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Usuarios.model.Usuario;
import com.example.Usuarios.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;
import java.util.Map;



@RestController
@RequestMapping("/api/GamingHub/v1/Usuario") 
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/iniciar-session")
    public EntityModel<Usuario> iniciarSession(@RequestParam(name = "email", required = true) String email,
                                               @RequestParam(name = "contrasena", required = true) String contrasena) {
        Usuario usuario = service.iniciarSession(email, contrasena);

        EntityModel<Usuario> recurso = EntityModel.of(usuario,
            linkTo(methodOn(UsuarioController.class).ver(usuario.getUsuarioID())).withSelfRel(),
            linkTo(methodOn(UsuarioController.class).editar(null, usuario.getUsuarioID())).withRel("editar")
        );

        return recurso;
    }

    @Operation(summary = "Crear un nuevo usuario", description = "Crea un usuario con los datos proporcionados")
    @PostMapping
    public EntityModel<Usuario> crear(@RequestBody Map<String, Object> usuario) {
        Usuario nuevo = service.crear(usuario);

        EntityModel<Usuario> recurso = EntityModel.of(nuevo,
            linkTo(methodOn(UsuarioController.class).ver(nuevo.getUsuarioID())).withSelfRel(),
            linkTo(methodOn(UsuarioController.class).editar(null, nuevo.getUsuarioID())).withRel("editar"),
            linkTo(methodOn(UsuarioController.class).cambiarEstado(nuevo.getUsuarioID(), false)).withRel("desactivar")
        );

        return recurso;
    }

    @Operation(summary = "Editar usuario", description = "Edita los datos de un usuario existente")
    @PutMapping("/{usuarioID}")
    public EntityModel<Usuario> editar(@RequestBody Map<String, Object> usuario, @PathVariable Long usuarioID) {
        Usuario actualizado = service.editar(usuario, usuarioID);

        EntityModel<Usuario> recurso = EntityModel.of(actualizado,
            linkTo(methodOn(UsuarioController.class).ver(usuarioID)).withSelfRel(),
            linkTo(methodOn(UsuarioController.class).cambiarEstado(usuarioID, !actualizado.getActivo())).withRel(actualizado.getActivo() ? "desactivar" : "activar")
        );

        return recurso;
    }

    @Operation(summary = "Cambiar estado de usuario", description = "Activa o desactiva un usuario")
    @PatchMapping("/cambiar-estado/{usuarioID}")
    public EntityModel<Usuario> cambiarEstado(@PathVariable Long usuarioID, @RequestParam boolean activar) {
        Usuario usuario = activar ? service.activar(usuarioID) : service.desactivar(usuarioID);

        EntityModel<Usuario> recurso = EntityModel.of(usuario,
            linkTo(methodOn(UsuarioController.class).ver(usuarioID)).withSelfRel(),
            linkTo(methodOn(UsuarioController.class).editar(null, usuarioID)).withRel("editar"),
            linkTo(methodOn(UsuarioController.class).cambiarEstado(usuarioID, !activar)).withRel(activar ? "desactivar" : "activar")
        );

        return recurso;
    }

    @Operation(summary = "Ver usuario por ID", description = "Obtiene los datos de un usuario específico")
    @GetMapping("/{usuarioID}")
    public EntityModel<Usuario> ver(@PathVariable Long usuarioID) {
        Usuario usuario = service.ver(usuarioID);

        EntityModel<Usuario> recurso = EntityModel.of(usuario,
            linkTo(methodOn(UsuarioController.class).editar(null, usuarioID)).withRel("editar"),
            linkTo(methodOn(UsuarioController.class).cambiarEstado(usuarioID, !usuario.getActivo())).withRel(usuario.getActivo() ? "desactivar" : "activar"),
            linkTo(methodOn(UsuarioController.class).ver(usuarioID)).withSelfRel()
        );

        return recurso;
    }

    @Operation(summary = "Buscar usuario por rol", description = "Obtiene un usuario según su rol")
    @GetMapping("/buscar-por-rol/{rol}")
    public ResponseEntity<EntityModel<Usuario>> buscarPorRol(@PathVariable String rol) {
        Usuario usuario = service.buscarPorRol(rol);  
        EntityModel<Usuario> recurso = EntityModel.of(usuario,
            linkTo(methodOn(UsuarioController.class).ver(usuario.getUsuarioID())).withRel("ver"),
            linkTo(methodOn(UsuarioController.class).editar(null, usuario.getUsuarioID())).withRel("editar"),
            linkTo(methodOn(UsuarioController.class).cambiarEstado(usuario.getUsuarioID(), true)).withRel("activar"),
            linkTo(methodOn(UsuarioController.class).cambiarEstado(usuario.getUsuarioID(), false)).withRel("desactivar"),
            linkTo(methodOn(UsuarioController.class).buscarPorRol(rol)).withSelfRel()
        );
        return ResponseEntity.ok(recurso);
    }

    @Operation(summary = "Listar usuarios por rol", description = "Obtiene todos los usuarios de un rol específico")
    @GetMapping("/listar-por-rol/{rol}")
    public ResponseEntity<CollectionModel<EntityModel<Usuario>>> listarPorRol(@PathVariable String rol) {
        List<Usuario> usuarios = service.listarPorRol(rol);
        List<EntityModel<Usuario>> recursos = usuarios.stream()
            .map(usuario -> EntityModel.of(usuario,
                linkTo(methodOn(UsuarioController.class).ver(usuario.getUsuarioID())).withRel("ver"),
                linkTo(methodOn(UsuarioController.class).editar(null, usuario.getUsuarioID())).withRel("editar"),
                linkTo(methodOn(UsuarioController.class).cambiarEstado(usuario.getUsuarioID(), true)).withRel("activar"),
                linkTo(methodOn(UsuarioController.class).cambiarEstado(usuario.getUsuarioID(), false)).withRel("desactivar")
            ))
            .toList();

        CollectionModel<EntityModel<Usuario>> collection = CollectionModel.of(recursos,
            linkTo(methodOn(UsuarioController.class).listarPorRol(rol)).withSelfRel()
        );

        return ResponseEntity.ok(collection);
    }
}
