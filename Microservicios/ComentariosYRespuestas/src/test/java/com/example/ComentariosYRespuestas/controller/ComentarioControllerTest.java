package com.example.ComentariosYRespuestas.controller;

import com.example.ComentariosYRespuestas.model.Comentario;
import com.example.ComentariosYRespuestas.service.ComentarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(ComentarioController.class)
class ComentarioControllerTest {

    @MockBean
    private ComentarioService service;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listarComentariosPorPublicacion() throws Exception {
        Comentario comentario = new Comentario();
        comentario.setComentarioID(1L);
        comentario.setContenido("Test Comment");
        comentario.setAutorID(1L);
        comentario.setPublicacionID(1L);
        comentario.setActivo(true);

        List<Comentario> comentarios = List.of(comentario);

        when(service.listarComentariosPorPublicacion(1L)).thenReturn(comentarios);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Comentarios/publicacion/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.comentarioList[0].comentarioID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void crearComentario() throws Exception {
        Comentario comentario = new Comentario();
        comentario.setComentarioID(1L);
        comentario.setContenido("Test Comment");
        comentario.setAutorID(1L);
        comentario.setPublicacionID(1L);
        comentario.setActivo(true);

        when(service.crearComentario(anyMap())).thenReturn(comentario);

        String json = "{\n" +
                "  \"texto\": \"Test Comment\",\n" +
                "  \"autor\": \"user@example.com\",\n" +
                "  \"publicacionId\": 1\n" +
                "}";

        try {
            mockMvc.perform(post("/api/GamingHub/v1/Comentarios")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.comentarioID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void editarComentario() throws Exception {
        Comentario comentario = new Comentario();
        comentario.setComentarioID(1L);
        comentario.setContenido("Updated Comment");
        comentario.setAutorID(1L);
        comentario.setPublicacionID(1L);
        comentario.setActivo(true);

        when(service.editarComentario(anyMap(), eq(1L))).thenReturn(comentario);

        String json = "{\n" +
                "  \"texto\": \"Updated Comment\"\n" +
                "}";

        try {
            mockMvc.perform(put("/api/GamingHub/v1/Comentarios/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido").value("Updated Comment"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void eliminarComentario() throws Exception {
        try {
            mockMvc.perform(delete("/api/GamingHub/v1/Comentarios/1"))
                .andExpect(status().isNoContent());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void verComentario() throws Exception {
        Comentario comentario = new Comentario();
        comentario.setComentarioID(1L);
        comentario.setContenido("Test Comment");
        comentario.setAutorID(1L);
        comentario.setPublicacionID(1L);
        comentario.setActivo(true);

        when(service.verComentario(1L)).thenReturn(comentario);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Comentarios/ver/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comentarioID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
