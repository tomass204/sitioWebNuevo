package com.example.Debate.controller;

import com.example.Debate.model.Debate;
import com.example.Debate.service.DebateService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Tag(name = "Debates", description = "Endpoints para gestionar debates")
@RestController
@RequestMapping("/api/GamingHub/v1/Debates")
public class DebateController {

    @Autowired
    private DebateService service;

    @Operation(summary = "Crear un debate", description = "Crea un nuevo debate")
    @PostMapping
    public ResponseEntity<EntityModel<Debate>> crearDebate(@RequestBody Map<String, Object> debateData) {
        Debate nuevo = service.crearDebate(debateData);

        EntityModel<Debate> recurso = EntityModel.of(nuevo,
                linkTo(methodOn(DebateController.class).crearDebate(debateData)).withSelfRel(),
                linkTo(methodOn(DebateController.class).cerrarDebate(nuevo.getDebateID())).withRel("cerrar"),
                linkTo(methodOn(DebateController.class).listarDebates()).withRel("listar")
        );

        return ResponseEntity.ok(recurso);
    }

    @Operation(summary = "Listar debates activos", description = "Devuelve todos los debates activos")
    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Debate>>> listarDebates() {
        List<Debate> debates = service.listarDebatesActivos();

        List<EntityModel<Debate>> recursos = debates.stream()
                .map(d -> EntityModel.of(d,
                        linkTo(methodOn(DebateController.class).verDebate(d.getDebateID())).withSelfRel(),
                        linkTo(methodOn(DebateController.class).cerrarDebate(d.getDebateID())).withRel("cerrar")
                ))
                .collect(Collectors.toList());

        CollectionModel<EntityModel<Debate>> collection = CollectionModel.of(recursos,
                linkTo(methodOn(DebateController.class).listarDebates()).withSelfRel()
        );

        return ResponseEntity.ok(collection);
    }

    @Operation(summary = "Ver un debate", description = "Devuelve los detalles de un debate por su ID")
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Debate>> verDebate(@PathVariable Long id) {
        Debate debate = service.verDebate(id);

        EntityModel<Debate> recurso = EntityModel.of(debate,
                linkTo(methodOn(DebateController.class).verDebate(id)).withSelfRel(),
                linkTo(methodOn(DebateController.class).cerrarDebate(id)).withRel("cerrar"),
                linkTo(methodOn(DebateController.class).listarDebates()).withRel("listar")
        );

        return ResponseEntity.ok(recurso);
    }

    @Operation(summary = "Cerrar un debate", description = "Cierra un debate específico")
    @PatchMapping("/{id}/cerrar")
    public ResponseEntity<EntityModel<Debate>> cerrarDebate(@PathVariable Long id) {
        Debate debate = service.cerrarDebate(id);

        EntityModel<Debate> recurso = EntityModel.of(debate,
                linkTo(methodOn(DebateController.class).verDebate(id)).withSelfRel(),
                linkTo(methodOn(DebateController.class).listarDebates()).withRel("listar")
        );

        return ResponseEntity.ok(recurso);
    }

    @Operation(summary = "Votar en un debate", description = "Registra un voto en un debate")
    @PostMapping("/{id}/votar")
    public ResponseEntity<EntityModel<String>> votarEnDebate(@PathVariable Long id, @RequestBody Map<String, Object> voto) {
        // Lógica de voto
        String mensaje = "Voto registrado exitosamente";

        EntityModel<String> recurso = EntityModel.of(mensaje,
                linkTo(methodOn(DebateController.class).verDebate(id)).withRel("verDebate"),
                linkTo(methodOn(DebateController.class).listarDebates()).withRel("listar")
        );

        return ResponseEntity.ok(recurso);
    }
}
