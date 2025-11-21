    package com.example.Solicitudes.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Solicitudes.model.Solicitud;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findByEstado(Solicitud.Estado estado);

    Optional<Solicitud> findBySolicitudId(Long solicitudId);

    List<Solicitud> findByUsuarioId(Long usuarioId);
}
