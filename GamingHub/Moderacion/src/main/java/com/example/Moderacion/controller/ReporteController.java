package com.example.Moderacion.controller;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Moderacion.model.Reporte;
import com.example.Moderacion.service.ReporteService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Reportes", description = "Endpoints para gestión de reportes de moderación")
@RestController
@RequestMapping("/api/GamingHub/v1/Reportes")
public class ReporteController {

    @Autowired
    private ReporteService service;

    @Operation(summary = "Crear un nuevo reporte", description = "Permite crear un nuevo reporte")
    @PostMapping
    public ResponseEntity<EntityModel<Reporte>> crearReporte(@RequestBody Map<String, Object> reporte) {
        try {
            Reporte nuevo = service.crearReporte(reporte);

            EntityModel<Reporte> recurso = EntityModel.of(nuevo,
                linkTo(methodOn(ReporteController.class).crearReporte(reporte)).withSelfRel(),
                linkTo(methodOn(ReporteController.class).listarReportesPendientes()).withRel("listarPendientes")
            );

            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Listar reportes pendientes", description = "Devuelve todos los reportes con estado pendiente")
    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Reporte>>> listarReportesPendientes() {
        List<Reporte> reportes = service.listarReportesPorEstado("pendiente");

        List<EntityModel<Reporte>> recursos = reportes.stream()
            .map(reporte -> EntityModel.of(reporte,
                linkTo(methodOn(ReporteController.class).listarReportesPendientes()).withRel("listarPendientes"),
                linkTo(methodOn(ReporteController.class).aplicarAccion(reporte.getReporteID(), new HashMap<>())).withRel("aplicarAccion")
            ))
            .toList();

        CollectionModel<EntityModel<Reporte>> collection = CollectionModel.of(recursos,
            linkTo(methodOn(ReporteController.class).listarReportesPendientes()).withSelfRel()
        );

        return ResponseEntity.ok(collection);
    }

    @Operation(summary = "Aplicar acción sobre un reporte", description = "Aplica una acción (aceptar/rechazar) sobre un reporte específico")
    @PatchMapping("/{id}/accion")
    public ResponseEntity<EntityModel<String>> aplicarAccion(@PathVariable Long id, @RequestBody Map<String, String> accion) {
        try {
            service.aplicarAccion(id, accion.get("accion"));

            EntityModel<String> recurso = EntityModel.of("Acción aplicada exitosamente",
                linkTo(methodOn(ReporteController.class).aplicarAccion(id, accion)).withSelfRel(),
                linkTo(methodOn(ReporteController.class).listarReportesPendientes()).withRel("listarPendientes")
            );

            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Eliminar comentario reportado", description = "Elimina un comentario específico")
    @DeleteMapping("/comentarios/{id}")
    public ResponseEntity<EntityModel<String>> eliminarComentario(@PathVariable Long id) {
        EntityModel<String> recurso = EntityModel.of("Comentario eliminado exitosamente",
            linkTo(methodOn(ReporteController.class).eliminarComentario(id)).withSelfRel(),
            linkTo(methodOn(ReporteController.class).listarReportesPendientes()).withRel("listarPendientes")
        );

        return ResponseEntity.ok(recurso);
    }

    @Operation(summary = "Reestructurar debate", description = "Reestructura un debate reportado")
    @PatchMapping("/debates/{id}/reestructurar")
    public ResponseEntity<EntityModel<String>> reestructurarDebate(@PathVariable Long id) {
        EntityModel<String> recurso = EntityModel.of("Debate reestructurado exitosamente",
            linkTo(methodOn(ReporteController.class).reestructurarDebate(id)).withSelfRel(),
            linkTo(methodOn(ReporteController.class).listarReportesPendientes()).withRel("listarPendientes")
        );

        return ResponseEntity.ok(recurso);
    }
}
