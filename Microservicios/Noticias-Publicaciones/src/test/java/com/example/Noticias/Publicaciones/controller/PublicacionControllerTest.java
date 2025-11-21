package com.example.Noticias.Publicaciones.controller;

import com.example.Noticias.Publicaciones.model.Publicacion;
import com.example.Noticias.Publicaciones.service.PublicacionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(PublicacionController.class)
class PublicacionControllerTest {

    @MockBean
    private PublicacionService service;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listarPublicaciones() throws Exception {
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(false);
        publicacion.setActiva(true);

        List<Publicacion> publicaciones = List.of(publicacion);

        when(service.listarTodas()).thenReturn(publicaciones);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Publicaciones/listar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.publicacionList[0].publicacionID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void verPublicacion() throws Exception {
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(false);
        publicacion.setActiva(true);

        when(service.verPublicacion(1L)).thenReturn(publicacion);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Publicaciones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.publicacionID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void crearPublicacionConImagenes() throws Exception {
        // 🔹 Mock publicación esperada
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setActiva(true);
        publicacion.setDestacada(false);

        when(service.crearPublicacion(anyMap(), anyList())).thenReturn(publicacion);

        MockMultipartFile archivo1 = new MockMultipartFile(
                "imagenes",
                "imagen1.png",
                "image/png",
                "contenido-ficticio".getBytes()
        );

        MockMultipartFile data = new MockMultipartFile("data", "", "application/json", "{\"titulo\":\"Test Title\",\"contenido\":\"Test Content\",\"tipo\":\"noticia\",\"autorID\":1}".getBytes());

        mockMvc.perform(multipart("/api/GamingHub/v1/Publicaciones/crear")
                        .file(archivo1)
                        .file(data)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.publicacionID").value(1L))
                .andExpect(jsonPath("$.titulo").value("Test Title"))
                .andExpect(jsonPath("$.tipo").value("noticia"));
    }

    @Test
    void editarPublicacion() throws Exception {
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Updated Title");
        publicacion.setContenido("Updated Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(false);
        publicacion.setActiva(true);

        when(service.editarPublicacion(anyMap(), eq(1L))).thenReturn(publicacion);

        String json = "{\n" +
                "  \"titulo\": \"Updated Title\",\n" +
                "  \"contenido\": \"Updated Content\",\n" +
                "  \"tipo\": \"noticia\"\n" +
                "}" ;

        try {
            mockMvc.perform(patch("/api/GamingHub/v1/Publicaciones/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Updated Title"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void eliminarPublicacion() throws Exception {
        try {
            mockMvc.perform(delete("/api/GamingHub/v1/Publicaciones/1"))
                .andExpect(status().isNoContent());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void destacarPublicacion() throws Exception {
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(true);
        publicacion.setActiva(true);

        when(service.destacarPublicacion(1L)).thenReturn(publicacion);

        try {
            mockMvc.perform(patch("/api/GamingHub/v1/Publicaciones/1/destacar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.destacada").value(true));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
