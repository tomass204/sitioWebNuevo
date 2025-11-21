package com.example.Solicitudes.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudRequest {
    private Long usuarioId;
    private String nombre;
    private String email;
    private String motivo;
}
