package com.example.Solicitudes.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Solicitudes.model.Solicitud;
import com.example.Solicitudes.model.SolicitudRequest;
import com.example.Solicitudes.service.SolicitudService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/GamingHub/v1/Solicitud")
@Tag(name = "Solicitudes", description = "API para gestión de solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudService service;

    @Operation(summary = "Listar todas las solicitudes")
    @GetMapping("/listar")
    public ResponseEntity<CollectionModel<EntityModel<Solicitud>>> listar() {
        List<Solicitud> solicitudes = service.listar();
        List<EntityModel<Solicitud>> recursos = solicitudes.stream()
                .map(solicitud -> EntityModel.of(solicitud,
                        linkTo(methodOn(SolicitudController.class).ver(solicitud.getSolicitudId())).withSelfRel(),
                        linkTo(methodOn(SolicitudController.class).aprobar(solicitud.getSolicitudId())).withRel("aprobar"),
                        linkTo(methodOn(SolicitudController.class).rechazar(solicitud.getSolicitudId())).withRel("rechazar")
                ))
                .toList();

        CollectionModel<EntityModel<Solicitud>> collection = CollectionModel.of(recursos,
                linkTo(methodOn(SolicitudController.class).listar()).withSelfRel());

        return ResponseEntity.ok(collection);
    }

   @Operation(summary = "Crear una nueva solicitud")
@PostMapping("/crear")
public EntityModel<Solicitud> crear(@RequestBody SolicitudRequest solicitudRequest) {
    // Validación rápida para evitar null
    if(solicitudRequest.getUsuarioId() == null ||
       solicitudRequest.getNombre() == null ||
       solicitudRequest.getEmail() == null ||
       solicitudRequest.getMotivo() == null) {
        throw new IllegalArgumentException("Faltan campos obligatorios: usuarioId, nombre, email o motivo");
    }

    Solicitud nueva = service.crear(Map.of(
        "usuarioId", solicitudRequest.getUsuarioId(),
        "nombre", solicitudRequest.getNombre(),
        "email", solicitudRequest.getEmail(),
        "motivo", solicitudRequest.getMotivo()
    ));

    return EntityModel.of(nueva,
            linkTo(methodOn(SolicitudController.class).ver(nueva.getSolicitudId())).withSelfRel(),
            linkTo(methodOn(SolicitudController.class).aprobar(nueva.getSolicitudId())).withRel("aprobar"),
            linkTo(methodOn(SolicitudController.class).rechazar(nueva.getSolicitudId())).withRel("rechazar")
    );
}


    @Operation(summary = "Aprobar una solicitud")
    @PutMapping("/aprobar/{solicitudId}")
    public EntityModel<Solicitud> aprobar(@PathVariable Long solicitudId) {
        Solicitud aprobada = service.aprobar(solicitudId);

        return EntityModel.of(aprobada,
                linkTo(methodOn(SolicitudController.class).ver(solicitudId)).withSelfRel()
        );
    }

    @Operation(summary = "Rechazar una solicitud")
    @PutMapping("/rechazar/{solicitudId}")
    public EntityModel<Solicitud> rechazar(@PathVariable Long solicitudId) {
        Solicitud rechazada = service.rechazar(solicitudId);

        return EntityModel.of(rechazada,
                linkTo(methodOn(SolicitudController.class).ver(solicitudId)).withSelfRel()
        );
    }

    @Operation(summary = "Ver una solicitud por ID")
    @GetMapping("/{solicitudId}")
    public EntityModel<Solicitud> ver(@PathVariable Long solicitudId) {
        Solicitud solicitud = service.ver(solicitudId);

        return EntityModel.of(solicitud,
                linkTo(methodOn(SolicitudController.class).aprobar(solicitudId)).withRel("aprobar"),
                linkTo(methodOn(SolicitudController.class).rechazar(solicitudId)).withRel("rechazar"),
                linkTo(methodOn(SolicitudController.class).ver(solicitudId)).withSelfRel()
        );
    }

    

    @Operation(summary = "Crear una solicitud y actualizar el rol del usuario")
@PostMapping("/crear-y-actualizar")
public EntityModel<Solicitud> crearYActualizar(@RequestBody SolicitudRequest solicitudRequest) {
    // Validación rápida para evitar null
    if(solicitudRequest.getUsuarioId() == null ||
       solicitudRequest.getNombre() == null ||
       solicitudRequest.getEmail() == null ||
       solicitudRequest.getMotivo() == null) {
        throw new IllegalArgumentException("Faltan campos obligatorios: usuarioId, nombre, email o motivo");
    }

    Solicitud nueva = service.crearSolicitudYActualizarUsuario(Map.of(
        "usuarioId", solicitudRequest.getUsuarioId(),
        "nombre", solicitudRequest.getNombre(),
        "email", solicitudRequest.getEmail(),
        "motivo", solicitudRequest.getMotivo()
    ));

    return EntityModel.of(nueva,
            linkTo(methodOn(SolicitudController.class).ver(nueva.getSolicitudId())).withSelfRel(),
            linkTo(methodOn(SolicitudController.class).aprobar(nueva.getSolicitudId())).withRel("aprobar"),
            linkTo(methodOn(SolicitudController.class).rechazar(nueva.getSolicitudId())).withRel("rechazar")
    );
}

}
