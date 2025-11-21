package com.example.ComentariosYRespuestas.service;

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

import com.example.ComentariosYRespuestas.model.Comentario;
import com.example.ComentariosYRespuestas.repository.ComentarioRepository;
import com.example.ComentariosYRespuestas.webclient.ComentarioWebClient;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ComentarioServiceTest {

    @Mock
    private ComentarioRepository repository;

    @Mock
    private ComentarioWebClient comentarioWebClient;

    @InjectMocks
    private ComentarioService service;

    @Test
    void listarComentariosPorPublicacion() {
        Comentario comentario = new Comentario();
        comentario.setComentarioID(1L);
        comentario.setContenido("Test Comment");
        comentario.setAutorID(1L);
        comentario.setPublicacionID(1L);
        comentario.setActivo(true);

        List<Comentario> comentarios = List.of(comentario);

        when(repository.findByPublicacionID(1L)).thenReturn(comentarios);
        when(comentarioWebClient.contarReaccionesPorComentario(1L)).thenReturn(5L);
        when(comentarioWebClient.getUsuarioById(1L)).thenReturn(Map.of("nombre", "Test User"));

        List<Comentario> result = service.listarComentariosPorPublicacion(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(comentario.getComentarioID(), result.get(0).getComentarioID());
    }

    @Test
    void crearComentario() {
        Map<String, Object> mapComentario = new HashMap<>();
        mapComentario.put("contenido", "Test Comment");
        mapComentario.put("autorID", "1");
        mapComentario.put("publicacionID", "1");

        Comentario comentario = new Comentario();
        comentario.setComentarioID(1L);
        comentario.setContenido("Test Comment");
        comentario.setAutorID(1L);
        comentario.setPublicacionID(1L);
        comentario.setActivo(true);

        when(comentarioWebClient.existePublicacion(1L)).thenReturn(true);
        when(repository.save(ArgumentMatchers.any(Comentario.class))).thenReturn(comentario);

        Comentario result = service.crearComentario(mapComentario);

        assertNotNull(result);
        assertEquals(comentario.getComentarioID(), result.getComentarioID());
    }

    @Test
    void editarComentario() {
        Map<String, Object> mapComentario = new HashMap<>();
        mapComentario.put("contenido", "Updated Comment");

        Comentario comentario = new Comentario();
        comentario.setComentarioID(1L);
        comentario.setContenido("Updated Comment");
        comentario.setAutorID(1L);
        comentario.setPublicacionID(1L);
        comentario.setActivo(true);

        when(repository.findById(1L)).thenReturn(Optional.of(comentario));
        when(repository.save(ArgumentMatchers.any(Comentario.class))).thenReturn(comentario);
        when(comentarioWebClient.contarReaccionesPorComentario(1L)).thenReturn(5L);
        when(comentarioWebClient.getUsuarioById(1L)).thenReturn(Map.of("nombre", "Test User"));

        Comentario result = service.editarComentario(mapComentario, 1L);

        assertNotNull(result);
        assertEquals("Updated Comment", result.getContenido());
    }

    @Test
    void verComentario() {
        Comentario comentario = new Comentario();
        comentario.setComentarioID(1L);
        comentario.setContenido("Test Comment");
        comentario.setAutorID(1L);
        comentario.setPublicacionID(1L);
        comentario.setActivo(true);

        when(repository.findById(1L)).thenReturn(Optional.of(comentario));
        when(comentarioWebClient.contarReaccionesPorComentario(1L)).thenReturn(5L);
        when(comentarioWebClient.getUsuarioById(1L)).thenReturn(Map.of("nombre", "Test User"));

        Comentario result = service.verComentario(1L);

        assertNotNull(result);
        assertEquals(comentario.getComentarioID(), result.getComentarioID());
    }

    @Test
    void eliminarComentario() {
        service.eliminarComentario(1L);
        // No exception thrown
    }
}
