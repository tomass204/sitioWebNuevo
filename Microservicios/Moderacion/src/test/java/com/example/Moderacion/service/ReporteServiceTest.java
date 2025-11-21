package com.example.Moderacion.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Moderacion.model.Reporte;
import com.example.Moderacion.repository.ReporteRepository;
import com.example.Moderacion.webclient.ModeracionWebClient;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReporteServiceTest {

    @Mock
    private ReporteRepository repository;

    @Mock
    private ModeracionWebClient moderacionWebClient;

    @InjectMocks
    private ReporteService service;

    @Test
    void crearReporte() {
        Map<String, Object> mapReporte = new HashMap<>();
        mapReporte.put("tipoEntidad", "comentario");
        mapReporte.put("entidadID", 1L);
        mapReporte.put("usuarioReportadorID", 1L);
        mapReporte.put("motivo", "Spam");

        Map<String, Object> usuario = Map.of("usuarioID", 1L);

        Reporte reporte = new Reporte();
        reporte.setReporteID(1L);
        reporte.setTipoEntidad("comentario");
        reporte.setEntidadID(1L);
        reporte.setUsuarioReportadorID(1L);
        reporte.setMotivo("Spam");
        reporte.setEstado("pendiente");

        when(moderacionWebClient.getUsuario(1L)).thenReturn(usuario);
        when(repository.save(ArgumentMatchers.any(Reporte.class))).thenReturn(reporte);

        Reporte result = service.crearReporte(mapReporte);

        assertNotNull(result);
        assertEquals(reporte.getReporteID(), result.getReporteID());
    }

    @Test
    void listarReportesPorEstado() {
        Reporte reporte = new Reporte();
        reporte.setReporteID(1L);
        reporte.setTipoEntidad("comentario");
        reporte.setEntidadID(1L);
        reporte.setUsuarioReportadorID(1L);
        reporte.setMotivo("Spam");
        reporte.setEstado("pendiente");

        List<Reporte> reportes = List.of(reporte);

        when(repository.findByEstado("pendiente")).thenReturn(reportes);

        List<Reporte> result = service.listarReportesPorEstado("pendiente");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(reporte.getReporteID(), result.get(0).getReporteID());
    }

    @Test
    void verReporte() {
        Reporte reporte = new Reporte();
        reporte.setReporteID(1L);
        reporte.setTipoEntidad("comentario");
        reporte.setEntidadID(1L);
        reporte.setUsuarioReportadorID(1L);
        reporte.setMotivo("Spam");
        reporte.setEstado("pendiente");

        when(repository.findById(1L)).thenReturn(Optional.of(reporte));

        Reporte result = service.verReporte(1L);

        assertNotNull(result);
        assertEquals(reporte.getReporteID(), result.getReporteID());
    }

    @Test
    void aplicarAccion() {
        Reporte reporte = new Reporte();
        reporte.setReporteID(1L);
        reporte.setTipoEntidad("comentario");
        reporte.setEntidadID(1L);
        reporte.setUsuarioReportadorID(1L);
        reporte.setMotivo("Spam");
        reporte.setEstado("pendiente");

        when(repository.findById(1L)).thenReturn(Optional.of(reporte));
        when(repository.save(ArgumentMatchers.any(Reporte.class))).thenReturn(reporte);

        service.aplicarAccion(1L, "aceptar");

        // Verify the action was applied
        assertEquals("aceptar", reporte.getAccionTomada());
        assertEquals("revisado", reporte.getEstado());
    }
}
