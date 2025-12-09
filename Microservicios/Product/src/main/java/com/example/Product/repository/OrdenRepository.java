package com.example.Product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Product.model.Orden;

import java.util.List;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findByUsuarioId(Long usuarioId);

    List<Orden> findByEstado(String estado);
}
