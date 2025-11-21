package com.example.Favoritos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Favoritos.model.Favorito;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuarioID(Long usuarioID);
    Optional<Favorito> findByUsuarioIDAndPublicacionID(Long usuarioID, Long publicacionID);
    boolean existsByUsuarioIDAndPublicacionID(Long usuarioID, Long publicacionID);
}
