package com.example.Reaccion.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Reaccion.model.Reaccion;
import com.example.Reaccion.repository.ReaccionRepository;
import com.example.Reaccion.webclient.ReaccionWebClient;

@ExtendWith(MockitoExtension.class)
public class ReaccionServiceTest {
    @Mock
    private ReaccionRepository repository;

    @Mock
    private ReaccionWebClient reaccionWebClient;

    @InjectMocks
    private ReaccionService service;

    @Test
    void crearReaccionNueva() {
        Map<String, Object> mapReaccion = new HashMap<>();
        mapReaccion.put("usuarioID", 1L);
        mapReaccion.put("tipoEntidad", "publicacion");
        mapReaccion.put("entidadID", 1L);
        mapReaccion.put("tipoReaccion", "like");

        Reaccion reaccion = new Reaccion();
        reaccion.setReaccionID(1L);
        reaccion.setUsuarioID(1L);
        reaccion.setTipoEntidad("publicacion");
        reaccion.setEntidadID(1L);
        reaccion.setTipoReaccion("like");

        when(repository.findByUsuarioIDAndTipoEntidadAndEntidadID(1L, "publicacion", 1L)).thenReturn(Optional.empty());
        when(repository.save(ArgumentMatchers.any(Reaccion.class))).thenReturn(reaccion);

        Reaccion result = service.crearReaccion(mapReaccion);

        assertNotNull(result);
        assertEquals(reaccion.getReaccionID(), result.getReaccionID());
        assertEquals(reaccion.getTipoReaccion(), result.getTipoReaccion());
    }

    @Test
    void crearReaccionExistente() {
        Map<String, Object> mapReaccion = new HashMap<>();
        mapReaccion.put("usuarioID", 1L);
        mapReaccion.put("tipoEntidad", "publicacion");
        mapReaccion.put("entidadID", 1L);
        mapReaccion.put("tipoReaccion", "dislike");

        Reaccion reaccionExistente = new Reaccion();
        reaccionExistente.setReaccionID(1L);
        reaccionExistente.setUsuarioID(1L);
        reaccionExistente.setTipoEntidad("publicacion");
        reaccionExistente.setEntidadID(1L);
        reaccionExistente.setTipoReaccion("like");

        when(repository.findByUsuarioIDAndTipoEntidadAndEntidadID(1L, "publicacion", 1L)).thenReturn(Optional.of(reaccionExistente));
        when(repository.save(ArgumentMatchers.any(Reaccion.class))).thenReturn(reaccionExistente);

        Reaccion result = service.crearReaccion(mapReaccion);

        assertNotNull(result);
        assertEquals("dislike", result.getTipoReaccion());
    }

    @Test
    void eliminarReaccion() {
        when(repository.existsById(1L)).thenReturn(true);

        service.eliminarReaccion(1L);

        // No exception thrown
    }

    @Test
    void verReaccion() {
        Reaccion reaccion = new Reaccion();
        reaccion.setReaccionID(1L);
        reaccion.setUsuarioID(1L);
        reaccion.setTipoEntidad("publicacion");
        reaccion.setEntidadID(1L);
        reaccion.setTipoReaccion("like");

        when(repository.findById(1L)).thenReturn(Optional.of(reaccion));

        Reaccion result = service.verReaccion(1L);

        assertNotNull(result);
        assertEquals(reaccion.getReaccionID(), result.getReaccionID());
    }

    @Test
    void listarReaccionesPorEntidad() {
        Reaccion reaccion = new Reaccion();
        reaccion.setReaccionID(1L);
        reaccion.setUsuarioID(1L);
        reaccion.setTipoEntidad("publicacion");
        reaccion.setEntidadID(1L);
        reaccion.setTipoReaccion("like");

        List<Reaccion> reacciones = List.of(reaccion);

        when(repository.findByTipoEntidadAndEntidadID("publicacion", 1L)).thenReturn(reacciones);

        List<Reaccion> result = service.listarReaccionesPorEntidad("publicacion", 1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(reaccion.getReaccionID(), result.get(0).getReaccionID());
    }

    @Test
    void contarReaccionesPorPublicacion() {
        when(repository.countByTipoEntidadAndEntidadID("publicacion", 1L)).thenReturn(5L);

        Long result = service.contarReaccionesPorPublicacion(1L);

        assertEquals(5L, result);
    }

    @Test
    void contarReaccionesPorComentario() {
        when(repository.countByTipoEntidadAndEntidadID("comentario", 1L)).thenReturn(3L);

        Long result = service.contarReaccionesPorComentario(1L);

        assertEquals(3L, result);
    }
}
