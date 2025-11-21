package com.example.Solicitudes.controller;

import com.example.Solicitudes.model.Solicitud;
import com.example.Solicitudes.model.SolicitudRequest;
import com.example.Solicitudes.service.SolicitudService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SolicitudController.class)
class SolicitudControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SolicitudService solicitudService;

    @Autowired
    private ObjectMapper objectMapper;

    private Solicitud solicitud;

    @BeforeEach
    void setUp() {
        solicitud = new Solicitud(1L, 1L, "Test Nombre", "test@gmail.com", "Test Motivo", Solicitud.Estado.PENDIENTE, LocalDateTime.now(), null);
    }

    @Test
    void testListar() throws Exception {
        List<Solicitud> solicitudes = Arrays.asList(solicitud);
        when(solicitudService.listar()).thenReturn(solicitudes);

        mockMvc.perform(get("/api/GamingHub/v1/Solicitud/listar"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/hal+json"))
                .andExpect(jsonPath("$._embedded.solicitudList").isArray());
    }

    @Test
    void testCrear() throws Exception {
        SolicitudRequest request = new SolicitudRequest(1L, "Test Nombre", "test@gmail.com", "Test Motivo");
        when(solicitudService.crear(any(Map.class))).thenReturn(solicitud);

        mockMvc.perform(post("/api/GamingHub/v1/Solicitud/crear")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solicitudId").value(1L))
                .andExpect(jsonPath("$._links.self.href").exists());
    }

    @Test
    void testAprobar() throws Exception {
        when(solicitudService.aprobar(1L)).thenReturn(solicitud);

        mockMvc.perform(put("/api/GamingHub/v1/Solicitud/aprobar/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solicitudId").value(1L))
                .andExpect(jsonPath("$._links.self.href").exists());
    }

    @Test
    void testRechazar() throws Exception {
        when(solicitudService.rechazar(1L)).thenReturn(solicitud);

        mockMvc.perform(put("/api/GamingHub/v1/Solicitud/rechazar/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solicitudId").value(1L))
                .andExpect(jsonPath("$._links.self.href").exists());
    }

    @Test
    void testVer() throws Exception {
        when(solicitudService.ver(1L)).thenReturn(solicitud);

        mockMvc.perform(get("/api/GamingHub/v1/Solicitud/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solicitudId").value(1L))
                .andExpect(jsonPath("$._links.self.href").exists());
    }
}
