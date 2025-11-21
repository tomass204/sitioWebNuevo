package com.example.Imagenes.controller;

import com.example.Imagenes.model.Imagen;
import com.example.Imagenes.service.ImagenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ImagenController.class)
public class ImagenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ImagenService imagenService;

    @Test
    void subirImagenes() throws Exception {
        Imagen imagen = new Imagen();
        imagen.setImagenID(1L);
        imagen.setEntidadID(1L);
        imagen.setTipoEntidad("publicacion");
        imagen.setNombre("test.jpg");
        imagen.setActivo(true);
        imagen.setFechaCreacion(LocalDateTime.now());

        List<Imagen> imagenes = List.of(imagen);

        when(imagenService.crear(anyLong(), anyString(), anyList())).thenReturn(imagenes);

        MockMultipartFile archivo = new MockMultipartFile("archivos", "test.jpg", "image/jpeg", "test image content".getBytes());

        mockMvc.perform(multipart("/api/GamingHub/v1/Imagen/subir")
                .file(archivo)
                .param("entidadID", "1")
                .param("tipoEntidad", "publicacion"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].imagenID").value(1L))
                .andExpect(jsonPath("$[0].links[0].rel").value("self"))
                .andExpect(jsonPath("$[0].links[0].href").exists())
                .andExpect(jsonPath("$[0].links[1].rel").value("buscar-por-entidad"))
                .andExpect(jsonPath("$[0].links[1].href").exists());
    }

    @Test
    void buscarPorEntidad() throws Exception {
        Imagen imagen = new Imagen();
        imagen.setImagenID(1L);
        imagen.setEntidadID(1L);
        imagen.setTipoEntidad("publicacion");
        imagen.setNombre("test.jpg");
        imagen.setActivo(true);
        imagen.setFechaCreacion(LocalDateTime.now());

        List<Imagen> imagenes = List.of(imagen);

        when(imagenService.buscarPorEntidad(1L, "publicacion")).thenReturn(imagenes);

        mockMvc.perform(get("/api/GamingHub/v1/Imagen/buscar-por-entidad")
                .param("entidadID", "1")
                .param("tipoEntidad", "publicacion"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].imagenID").value(1L))
                .andExpect(jsonPath("$[0].links[0].rel").value("self"))
                .andExpect(jsonPath("$[0].links[0].href").exists());
    }

    @Test
    void obtenerImagenPorId() throws Exception {
        Path tempFile = Files.createTempFile("test", ".jpg");
        Resource recurso = new UrlResource(tempFile.toUri());

        when(imagenService.obtenerImagenPorId(1L)).thenReturn(Optional.of(recurso));
        when(imagenService.obtenerContentType(recurso)).thenReturn(MediaType.IMAGE_JPEG);

        mockMvc.perform(get("/api/GamingHub/v1/Imagen/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG));

        Files.deleteIfExists(tempFile);
    }

    @Test
    void obtenerImagenPorIdNotFound() throws Exception {
        when(imagenService.obtenerImagenPorId(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/GamingHub/v1/Imagen/1"))
                .andExpect(status().isNotFound());
    }
}
