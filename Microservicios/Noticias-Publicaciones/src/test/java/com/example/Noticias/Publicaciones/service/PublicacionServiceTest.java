package com.example.Noticias.Publicaciones.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Noticias.Publicaciones.model.Publicacion;
import com.example.Noticias.Publicaciones.repository.PublicacionRepository;
import com.example.Noticias.Publicaciones.webclient.PublicacionWebClient;
import org.springframework.web.multipart.MultipartFile;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PublicacionServiceTest {

    @Mock
    private PublicacionRepository repository;

    @Mock
    private PublicacionWebClient webClient;

    @InjectMocks
    private PublicacionService service;

    @Test
    void listarTodas() {
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(false);
        publicacion.setActiva(true);

        List<Publicacion> publicaciones = List.of(publicacion);

        when(repository.findAll()).thenReturn(publicaciones);
        when(webClient.getLikesCount(1L)).thenReturn(5L);
        when(webClient.getComentariosCount(1L)).thenReturn(3L);
        when(webClient.getUsuarioById(1L)).thenReturn(Map.of("nombre", "Test User"));
        when(webClient.getImagenesPorPublicacionId(1L, "Publicacion")).thenReturn(List.of());

        List<Publicacion> result = service.listarTodas();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(publicacion.getPublicacionID(), result.get(0).getPublicacionID());
    }

    @Test
    void verPublicacion() {
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(false);
        publicacion.setActiva(true);

        when(repository.findById(1L)).thenReturn(Optional.of(publicacion));
        when(webClient.getUsuarioById(1L)).thenReturn(Map.of("nombre", "Test User"));
        when(webClient.getImagenesPorPublicacionId(1L, "Publicacion")).thenReturn(List.of());

        Publicacion result = service.verPublicacion(1L);

        assertNotNull(result);
        assertEquals(publicacion.getPublicacionID(), result.getPublicacionID());
    }

    @Test
    void crearPublicacionSinArchivos() {
        Map<String, Object> mapPublicacion = new HashMap<>();
        mapPublicacion.put("titulo", "Test Title");
        mapPublicacion.put("contenido", "Test Content");
        mapPublicacion.put("tipo", "noticia");
        mapPublicacion.put("autorID", 1L);

        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(false);
        publicacion.setActiva(true);

        when(webClient.existeUsuario(1L)).thenReturn(true);
        when(repository.save(ArgumentMatchers.any(Publicacion.class))).thenReturn(publicacion);

        List<MultipartFile> archivos = new ArrayList<>();

        Publicacion result = service.crearPublicacion(mapPublicacion, archivos);

        assertNotNull(result);
        assertEquals(1L, result.getPublicacionID());
        assertEquals("Test Title", result.getTitulo());
    }


    @Test
    void editarPublicacion() {
        Map<String, Object> mapPublicacion = new HashMap<>();
        mapPublicacion.put("titulo", "Updated Title");
        mapPublicacion.put("contenido", "Updated Content");
        mapPublicacion.put("tipo", "noticia");

        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Updated Title");
        publicacion.setContenido("Updated Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(false);
        publicacion.setActiva(true);

        when(repository.findById(1L)).thenReturn(Optional.of(publicacion));
        when(repository.save(ArgumentMatchers.any(Publicacion.class))).thenReturn(publicacion);

        Publicacion result = service.editarPublicacion(mapPublicacion, 1L);

        assertNotNull(result);
        assertEquals(publicacion.getTitulo(), result.getTitulo());
    }

    @Test
    void eliminarPublicacion() {
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(false);
        publicacion.setActiva(true);

        when(repository.findById(1L)).thenReturn(Optional.of(publicacion));

        service.eliminarPublicacion(1L);
        // No exception thrown
    }

    @Test
    void destacarPublicacion() {
        Publicacion publicacion = new Publicacion();
        publicacion.setPublicacionID(1L);
        publicacion.setTitulo("Test Title");
        publicacion.setContenido("Test Content");
        publicacion.setTipo("noticia");
        publicacion.setAutorID(1L);
        publicacion.setDestacada(true);
        publicacion.setActiva(true);

        when(repository.findById(1L)).thenReturn(Optional.of(publicacion));
        when(repository.save(ArgumentMatchers.any(Publicacion.class))).thenReturn(publicacion);

        Publicacion result = service.destacarPublicacion(1L);

        assertNotNull(result);
        assertEquals(true, result.getDestacada());
    }
}
