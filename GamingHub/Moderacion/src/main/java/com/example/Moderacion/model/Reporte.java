package com.example.Moderacion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Reportes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reporte_id")
    private Long reporteID;

    @Column(nullable = false)
    private String tipoEntidad; 

    @Column(nullable = false)
    private Long entidadID;

    @Column(nullable = false)
    private Long usuarioReportadorID;

    @Column(nullable = false)
    private String motivo;

    @Column(nullable = false)
    private String estado = "pendiente"; 

    @Column
    private String accionTomada; 

    @Column
    private String comentariosModerador;
}
