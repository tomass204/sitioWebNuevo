package com.example.ComentariosYRespuestas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.ComentariosYRespuestas.model.Comentario;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByPublicacionID(Long publicacionID);
}
