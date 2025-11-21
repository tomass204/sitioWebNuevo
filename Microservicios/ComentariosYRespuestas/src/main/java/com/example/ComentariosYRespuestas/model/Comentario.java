package com.example.ComentariosYRespuestas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Comentarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comentario_id")
    private Long comentarioID;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false)
    private Long autorID;

    @Column(nullable = false)
    private Long publicacionID;

    @Column(nullable = false)
    private Boolean activo = true;

    @Transient
    private Long likesCount;

    @Transient
    private String autorNombre;
}
