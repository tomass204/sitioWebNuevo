package com.example.Game.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Juegos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Juego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "juego_id")
    private Long juegoId;

    @Column(nullable = false)
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private String imagenUrl;

    @Column(nullable = false)
    private String autor;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column
    private String downloadUrl;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}

