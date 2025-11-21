package com.example.Reaccion.controller;

import com.example.Reaccion.model.Reaccion;
import com.example.Reaccion.service.ReaccionService;
import com.example.Reaccion.webclient.ReaccionWebClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(ReaccionController.class)
class ReaccionControllerTest {

    @MockBean
    private ReaccionService service;

    @MockBean
    private ReaccionWebClient reaccionWebClient;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        // Mock ReaccionWebClient to avoid null pointer exceptions in service
        when(reaccionWebClient.getUsuarioById(anyLong())).thenReturn(Map.of("id", 1L, "nombre", "Test User"));
    }

    @Test
    void crearReaccion() throws Exception {
        Reaccion reaccion = new Reaccion();
        reaccion.setReaccionID(1L);
        reaccion.setUsuarioID(1L);
        reaccion.setTipoEntidad("publicacion");
        reaccion.setEntidadID(1L);
        reaccion.setTipoReaccion("like");

        when(service.crearReaccion(anyMap())).thenReturn(reaccion);

        String json = "{\n" +
                "  \"usuarioID\": 1,\n" +
                "  \"tipoEntidad\": \"publicacion\",\n" +
                "  \"entidadID\": 1,\n" +
                "  \"tipoReaccion\": \"like\"\n" +
                "}";

        mockMvc.perform(post("/api/GamingHub/v1/Reacciones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.reaccionID").value(1L))
            .andExpect(jsonPath("$.tipoReaccion").value("like"))
            .andExpect(jsonPath("$._links.self.href").exists());
    }

    @Test
    void eliminarReaccion() throws Exception {
        Mockito.doNothing().when(service).eliminarReaccion(1L);

        mockMvc.perform(delete("/api/GamingHub/v1/Reacciones/1"))
            .andExpect(status().isNoContent());
    }

    @Test
    void contarPorPublicacion() throws Exception {
        when(service.contarReaccionesPorPublicacion(1L)).thenReturn(5L);

        mockMvc.perform(get("/api/GamingHub/v1/Reacciones/publicacion/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value(5L));
    }

    @Test
    void contarPorComentario() throws Exception {
        when(service.contarReaccionesPorComentario(1L)).thenReturn(3L);

        mockMvc.perform(get("/api/GamingHub/v1/Reacciones/comentario/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").value(3L));
    }

    @Test
    void verReaccion() throws Exception {
        Reaccion reaccion = new Reaccion();
        reaccion.setReaccionID(1L);
        reaccion.setUsuarioID(1L);
        reaccion.setTipoEntidad("publicacion");
        reaccion.setEntidadID(1L);
        reaccion.setTipoReaccion("like");

        when(service.verReaccion(1L)).thenReturn(reaccion);

        mockMvc.perform(get("/api/GamingHub/v1/Reacciones/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.reaccionID").value(1L))
            .andExpect(jsonPath("$._links.self.href").exists());
    }

    @Test
    void listarReaccionesPorEntidad() throws Exception {
        Reaccion reaccion = new Reaccion();
        reaccion.setReaccionID(1L);
        reaccion.setUsuarioID(1L);
        reaccion.setTipoEntidad("publicacion");
        reaccion.setEntidadID(1L);
        reaccion.setTipoReaccion("like");

        when(service.listarReaccionesPorEntidad("publicacion", 1L)).thenReturn(java.util.List.of(reaccion));

        mockMvc.perform(get("/api/GamingHub/v1/Reacciones/listar/publicacion/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$._embedded.reaccionList").isArray())
            .andExpect(jsonPath("$._links.self.href").exists());
    }
}
