package com.example.Debate.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Debates")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Debate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "debate_id")
    private Long debateID;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Long creadorID;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean cerrado = false;

    @Column
    private String opciones; 
}
