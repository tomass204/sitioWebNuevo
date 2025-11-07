package com.example.Reaccion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Reacciones")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reaccion_id")
    private Long reaccionID;

    @Column(nullable = false)
    private Long usuarioID;

    @Column(nullable = false)
    private String tipoEntidad; // "publicacion" o "comentario"

    @Column(nullable = false)
    private Long entidadID; // ID de la publicación o comentario

    @Column(nullable = false)
    private String tipoReaccion; // "like", "dislike", etc.
}
