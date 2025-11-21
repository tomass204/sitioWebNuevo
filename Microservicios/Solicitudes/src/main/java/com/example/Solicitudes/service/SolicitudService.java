package com.example.Solicitudes.service;

import com.example.Solicitudes.model.Solicitud;
import com.example.Solicitudes.repository.SolicitudRepository;
import com.example.Solicitudes.webclient.SolicitudWebClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository repository;

    @Autowired
    private SolicitudWebClient webClient;

    // 🔹 Listar todas las solicitudes
    public List<Solicitud> listar() {
        return repository.findAll();
    }

    // 🔹 Ver solicitud por ID
    public Solicitud ver(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Solicitud no encontrada con ID: " + id));
    }

    // 🔹 Crear solicitud (el usuario básico la envía)
    public Solicitud crear(Map<String, Object> datos) {
        Long usuarioId = Long.parseLong(datos.get("usuarioId").toString());

        // Verificar que el usuario existe
        if (!webClient.usuarioExiste(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado");
        }

        Solicitud solicitud = new Solicitud();

        solicitud.setUsuarioId(usuarioId);
        solicitud.setNombre(datos.get("nombre").toString());
        solicitud.setEmail(datos.get("email").toString()); // debe coincidir con el JSON
        solicitud.setMotivo(datos.get("motivo").toString());
        solicitud.setEstado(Solicitud.Estado.PENDIENTE); // valor por defecto
        solicitud.setFechaCreacion(LocalDateTime.now());

        return repository.save(solicitud);
    }

    // 🔹 Aprobar solicitud (solo propietario)
    public Solicitud aprobar(Long id) {
        Solicitud solicitud = ver(id);
        if (solicitud.getEstado() != Solicitud.Estado.PENDIENTE) {
            throw new RuntimeException("La solicitud ya fue gestionada");
        }
        solicitud.setEstado(Solicitud.Estado.APROBADA);
        solicitud.setFechaGestion(LocalDateTime.now());
        Solicitud aprobada = repository.save(solicitud);
        // Cambiar rol del usuario a MODERADOR
        webClient.cambiarRolUsuario(solicitud.getUsuarioId(), "MODERADOR");
        return aprobada;
    }

    // 🔹 Rechazar solicitud (solo propietario)
    public Solicitud rechazar(Long id) {
        Solicitud solicitud = ver(id);
        solicitud.setEstado(Solicitud.Estado.RECHAZADA);
        solicitud.setFechaGestion(LocalDateTime.now());
        return repository.save(solicitud);
    }

    // 🔹 Si tienes el método especial que además actualiza el usuario (opcional)
    public Solicitud crearSolicitudYActualizarUsuario(Map<String, Object> datos) {
        Solicitud nueva = crear(datos);
        // Aquí podrías llamar a otro microservicio para cambiar el rol, por ejemplo con Retrofit o RestTemplate
        return nueva;
}
}