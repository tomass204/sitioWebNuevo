package com.example.Game.repository;

import com.example.Game.model.Juego;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JuegoRepository extends JpaRepository<Juego, Long> {
    List<Juego> findByActivoTrue();
    List<Juego> findByCategoria(String categoria);
    List<Juego> findByTituloContainingIgnoreCase(String titulo);
    List<Juego> findByAutor(String autor);
}

