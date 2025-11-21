package com.example.Reaccion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Reaccion.model.Reaccion;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReaccionRepository extends JpaRepository<Reaccion, Long> {
    List<Reaccion> findByTipoEntidadAndEntidadID(String tipoEntidad, Long entidadID);
    Optional<Reaccion> findByUsuarioIDAndTipoEntidadAndEntidadID(Long usuarioID, String tipoEntidad, Long entidadID);
    Long countByTipoEntidadAndEntidadID(String tipoEntidad, Long entidadID);
    List<Reaccion> findByUsuarioID(Long usuarioID);
}
