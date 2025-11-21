package com.example.Product.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Ordenes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orden_id")
    private Long ordenId;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @ElementCollection
    @CollectionTable(name = "orden_productos", joinColumns = @JoinColumn(name = "orden_id"))
    @Column(name = "producto_id")
    private List<Long> productoIds;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(nullable = false)
    private String estado; // e.g., PENDIENTE, COMPLETADA, CANCELADA
}
