package com.example.Reaccion.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Reaccion.model.Reaccion;
import com.example.Reaccion.repository.ReaccionRepository;
import com.example.Reaccion.webclient.ReaccionWebClient;

@Service
public class ReaccionService {

    @Autowired
    private ReaccionRepository repository;

    @Autowired
    private ReaccionWebClient reaccionWebClient;

    // ===== CREAR O ACTUALIZAR REACCIÓN =====
    public Reaccion crearReaccion(Map<String, Object> reaccionData) {
        Long usuarioID = (Long) reaccionData.get("usuarioID");
        String tipoEntidad = (String) reaccionData.get("tipoEntidad");
        Long entidadID = (Long) reaccionData.get("entidadID");
        String tipoReaccion = (String) reaccionData.get("tipoReaccion");

        // Validate user exists
        Map<String, Object> usuario = reaccionWebClient.getUsuarioById(usuarioID);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado.");
        }

        // Verificar si ya existe una reacción del mismo usuario para la misma entidad
        Optional<Reaccion> reaccionExistente = repository
                .findByUsuarioIDAndTipoEntidadAndEntidadID(usuarioID, tipoEntidad, entidadID);

        if (reaccionExistente.isPresent()) {
            Reaccion reaccion = reaccionExistente.get();
            reaccion.setTipoReaccion(tipoReaccion);
            return repository.save(reaccion);
        } else {
            Reaccion reaccion = new Reaccion();
            reaccion.setUsuarioID(usuarioID);
            reaccion.setTipoEntidad(tipoEntidad);
            reaccion.setEntidadID(entidadID);
            reaccion.setTipoReaccion(tipoReaccion);
            return repository.save(reaccion);
        }
    }

    // ===== ELIMINAR REACCIÓN =====
    public void eliminarReaccion(Long reaccionID) {
        if (!repository.existsById(reaccionID)) {
            throw new RuntimeException("No existe la reacción con ID: " + reaccionID);
        }
        repository.deleteById(reaccionID);
    }

    // ===== VER REACCIÓN =====
    public Reaccion verReaccion(Long reaccionID) {
        return repository.findById(reaccionID)
                .orElseThrow(() -> new RuntimeException("Reacción no encontrada."));
    }

    // ===== LISTAR REACCIONES POR ENTIDAD =====
    public List<Reaccion> listarReaccionesPorEntidad(String tipoEntidad, Long entidadID) {
        return repository.findByTipoEntidadAndEntidadID(tipoEntidad, entidadID);
    }

    // ===== CONTAR REACCIONES =====
    public Long contarReaccionesPorPublicacion(Long publicacionID) {
        return repository.countByTipoEntidadAndEntidadID("publicacion", publicacionID);
    }

    public Long contarReaccionesPorComentario(Long comentarioID) {
        return repository.countByTipoEntidadAndEntidadID("comentario", comentarioID);
    }
}
