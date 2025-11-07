package com.example.Noticias.Publicaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Noticias.Publicaciones.model.Publicacion;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    
}
