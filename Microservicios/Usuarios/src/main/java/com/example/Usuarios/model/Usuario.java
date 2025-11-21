package com.example.Usuarios.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity 
@Table(name = "Usuarios") 
@Data 
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_id")
    private Long usuarioID; 

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String contrasena;

    @Column(nullable = false)
    private String rol;

    @Column(nullable = false)
    private Boolean activo;

    @Column(name = "contrasena_temporal")
    private String contrasenaTemporal;

    @Column(name = "expiracion_contrasena_temporal")
    private LocalDateTime expiracionContrasenaTemporal;

    @Column(name = "contrasena_temporal_usada")
    private Boolean contrasenaTemporalUsada;







}
