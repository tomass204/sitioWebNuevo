package com.example.Solicitudes.service;

import com.example.Solicitudes.model.Solicitud;
import com.example.Solicitudes.repository.SolicitudRepository;
import com.example.Solicitudes.webclient.SolicitudWebClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SolicitudServiceTest {

    @Mock
    private SolicitudRepository solicitudRepository;

    @Mock
    private SolicitudWebClient webClient;

    @InjectMocks
    private SolicitudService solicitudService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListar() {
        Solicitud solicitud1 = new Solicitud(1L, 1L, "Test Nombre1", "test1@gmail.com", "Test Motivo1", Solicitud.Estado.PENDIENTE, LocalDateTime.now(), null);
        Solicitud solicitud2 = new Solicitud(2L, 2L, "Test Nombre2", "test2@gmail.com", "Test Motivo2", Solicitud.Estado.APROBADA, LocalDateTime.now(), LocalDateTime.now());
        when(solicitudRepository.findAll()).thenReturn(Arrays.asList(solicitud1, solicitud2));

        List<Solicitud> result = solicitudService.listar();

        assertEquals(2, result.size());
        verify(solicitudRepository, times(1)).findAll();
    }

    @Test
    void testCrear() {
        Map<String, Object> mapSolicitud = Map.of(
            "usuarioId", "1",
            "nombre", "Test Nombre",
            "email", "test@gmail.com",
            "motivo", "Test Motivo"
        );
        Solicitud solicitud = new Solicitud(1L, 1L, "Test Nombre", "test@gmail.com", "Test Motivo", Solicitud.Estado.PENDIENTE, LocalDateTime.now(), null);
        when(webClient.usuarioExiste(1L)).thenReturn(true);
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        Solicitud result = solicitudService.crear(mapSolicitud);

        assertNotNull(result);
        assertEquals(1L, result.getUsuarioId());
        assertEquals("Test Nombre", result.getNombre());
        assertEquals("test@gmail.com", result.getEmail());
        assertEquals("Test Motivo", result.getMotivo());
        assertEquals(Solicitud.Estado.PENDIENTE, result.getEstado());
        verify(webClient, times(1)).usuarioExiste(1L);
        verify(solicitudRepository, times(1)).save(any(Solicitud.class));
    }

    @Test
    void testCrearUsuarioNoExiste() {
        Map<String, Object> mapSolicitud = Map.of(
            "usuarioId", "1",
            "nombre", "Test Nombre",
            "email", "test@gmail.com",
            "motivo", "Test Motivo"
        );
        when(webClient.usuarioExiste(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> solicitudService.crear(mapSolicitud));
        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(webClient, times(1)).usuarioExiste(1L);
        verify(solicitudRepository, never()).save(any(Solicitud.class));
    }

    @Test
    void testAprobar() {
        Solicitud solicitud = new Solicitud(1L, 1L, "Test Nombre", "test@gmail.com", "Test Motivo", Solicitud.Estado.PENDIENTE, LocalDateTime.now(), null);
        when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        Solicitud result = solicitudService.aprobar(1L);

        assertEquals(Solicitud.Estado.APROBADA, result.getEstado());
        assertNotNull(result.getFechaGestion());
        verify(solicitudRepository, times(1)).findById(1L);
        verify(solicitudRepository, times(1)).save(any(Solicitud.class));
        verify(webClient, times(1)).cambiarRolUsuario(1L, "MODERADOR");
    }

    @Test
    void testAprobarSolicitudNoEncontrada() {
        when(solicitudRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> solicitudService.aprobar(1L));
        assertEquals("Solicitud no encontrada con ID: 1", exception.getMessage());
    }

    @Test
    void testAprobarSolicitudYaGestionada() {
        Solicitud solicitud = new Solicitud(1L, 1L, "Test Nombre", "test@gmail.com", "Test Motivo", Solicitud.Estado.APROBADA, LocalDateTime.now(), LocalDateTime.now());
        when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitud));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> solicitudService.aprobar(1L));
        assertEquals("La solicitud ya fue gestionada", exception.getMessage());
    }

    @Test
    void testRechazar() {
        Solicitud solicitud = new Solicitud(1L, 1L, "Test Nombre", "test@gmail.com", "Test Motivo", Solicitud.Estado.PENDIENTE, LocalDateTime.now(), null);
        when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        Solicitud result = solicitudService.rechazar(1L);

        assertEquals(Solicitud.Estado.RECHAZADA, result.getEstado());
        assertNotNull(result.getFechaGestion());
        verify(solicitudRepository, times(1)).findById(1L);
        verify(solicitudRepository, times(1)).save(any(Solicitud.class));
    }

    @Test
    void testVer() {
        Solicitud solicitud = new Solicitud(1L, 1L, "Test Nombre", "test@gmail.com", "Test Motivo", Solicitud.Estado.PENDIENTE, LocalDateTime.now(), null);
        when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitud));

        Solicitud result = solicitudService.ver(1L);

        assertEquals(solicitud, result);
        verify(solicitudRepository, times(1)).findById(1L);
    }

    @Test
    void testVerSolicitudNoEncontrada() {
        when(solicitudRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> solicitudService.ver(1L));
        assertEquals("Solicitud no encontrada con ID: 1", exception.getMessage());
    }
}
