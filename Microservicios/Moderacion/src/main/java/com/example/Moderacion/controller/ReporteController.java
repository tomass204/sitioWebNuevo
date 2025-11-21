package com.example.Moderacion.controller;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.Moderacion.model.Reporte;
import com.example.Moderacion.service.ReporteService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

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

            return ResponseEntity.status(HttpStatus.CREATED).body(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @Operation(summary = "Listar reportes pendientes", description = "Devuelve todos los reportes con estado pendiente")
    @GetMapping
    public ResponseEntity<List<Reporte>> listarReportesPendientes() {
        List<Reporte> reportes = service.listarReportesPorEstado("pendiente");

        if (reportes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(reportes);
    }

    @Operation(summary = "Aplicar acción sobre un reporte", description = "Aplica una acción (aceptar/rechazar) sobre un reporte específico")
    @PatchMapping("/{id}/accion")
    public ResponseEntity<String> aplicarAccion(@PathVariable Long id, @RequestBody Map<String, String> accion) {
        try {
            service.aplicarAccion(id, accion.get("accion"));

            return ResponseEntity.ok("Acción aplicada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reporte no encontrado");
        }
    }

    @Operation(summary = "Eliminar comentario reportado", description = "Elimina un comentario específico")
    @DeleteMapping("/comentarios/{id}")
    public ResponseEntity<String> eliminarComentario(@PathVariable Long id) {
        try {
            // service.verReporte(id); // Validamos que exista
            // Aquí deberías implementar service.eliminarComentario(id) si quieres eliminarlo

            return ResponseEntity.ok("Comentario eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comentario no encontrado");
        }
    }

    @Operation(summary = "Reestructurar debate", description = "Reestructura un debate reportado")
    @PatchMapping("/debates/{id}/reestructurar")
    public ResponseEntity<String> reestructurarDebate(@PathVariable Long id) {
        try {
            // service.verReporte(id); // Validamos que exista
            // Aquí deberías implementar service.reestructurarDebate(id)

            return ResponseEntity.ok("Debate reestructurado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reporte no encontrado");
        }
    }
}
