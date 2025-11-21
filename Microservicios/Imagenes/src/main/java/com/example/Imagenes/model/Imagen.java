package com.example.Imagenes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Entity
@Table(name = "Imagenes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Imagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imagen_id")
    private Long imagenID;

    @Column(name = "entidad_id", nullable = false)
    private Long entidadID ;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "tipo_entidad", nullable = false)
    private String tipoEntidad ;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion ;

    @Column(nullable = false)
    private Boolean activo;


}
