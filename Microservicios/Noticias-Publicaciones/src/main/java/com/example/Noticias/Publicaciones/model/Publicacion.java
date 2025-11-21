package com.example.Noticias.Publicaciones.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "Publicaciones")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "publicacion_id")
    private Long publicacionID;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false)
    private String tipo; 
    @Column(nullable = false)
    private Long autorID;

    @Column(nullable = false)
    private Boolean destacada = false;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(nullable = false, name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Transient
    private Long likesCount;

    @Transient
    private Long comentariosCount;

    @Transient
    private String autor;

    @Transient
    private List<Map<String,Object>> imagenes;
}
