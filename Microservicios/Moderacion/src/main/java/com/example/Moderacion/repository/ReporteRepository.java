package com.example.Moderacion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Moderacion.model.Reporte;

import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    List<Reporte> findByEstado(String estado);
    List<Reporte> findByTipoEntidadAndEntidadID(String tipoEntidad, Long entidadID);
}
