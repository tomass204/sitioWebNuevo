package com.example.Moderacion.controller;

import com.example.Moderacion.model.Reporte;
import com.example.Moderacion.service.ReporteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(ReporteController.class)
class ReporteControllerTest {

    @MockBean
    private ReporteService service;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void crearReporte() throws Exception {
        Reporte reporte = new Reporte();
        reporte.setReporteID(1L);
        reporte.setTipoEntidad("comentario");
        reporte.setEntidadID(1L);
        reporte.setUsuarioReportadorID(1L);
        reporte.setMotivo("Spam");
        reporte.setEstado("pendiente");

        when(service.crearReporte(anyMap())).thenReturn(reporte);

        String json = "{\n" +
                "  \"tipoEntidad\": \"comentario\",\n" +
                "  \"entidadID\": 1,\n" +
                "  \"usuarioReportadorID\": 1,\n" +
                "  \"motivo\": \"Spam\"\n" +
                "}";

        try {
            mockMvc.perform(post("/api/GamingHub/v1/Reportes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reporteID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void listarReportesPendientes() throws Exception {
        Reporte reporte = new Reporte();
        reporte.setReporteID(1L);
        reporte.setTipoEntidad("comentario");
        reporte.setEntidadID(1L);
        reporte.setUsuarioReportadorID(1L);
        reporte.setMotivo("Spam");
        reporte.setEstado("pendiente");

        List<Reporte> reportes = List.of(reporte);

        when(service.listarReportesPorEstado("pendiente")).thenReturn(reportes);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Reportes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reporteID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void aplicarAccion() throws Exception {
        doNothing().when(service).aplicarAccion(eq(1L), eq("aceptar"));

        try {
            mockMvc.perform(patch("/api/GamingHub/v1/Reportes/1/accion")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"accion\":\"aceptar\"}"))
                .andExpect(status().isOk());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void eliminarComentario() throws Exception {
        Reporte reporte = new Reporte();
        reporte.setReporteID(1L);

        when(service.verReporte(1L)).thenReturn(reporte);

        try {
            mockMvc.perform(delete("/api/GamingHub/v1/Reportes/comentarios/1"))
                .andExpect(status().isOk());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void reestructurarDebate() throws Exception {
        Reporte reporte = new Reporte();
        reporte.setReporteID(1L);

        when(service.verReporte(1L)).thenReturn(reporte);

        try {
            mockMvc.perform(patch("/api/GamingHub/v1/Reportes/debates/1/reestructurar"))
                .andExpect(status().isOk());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
