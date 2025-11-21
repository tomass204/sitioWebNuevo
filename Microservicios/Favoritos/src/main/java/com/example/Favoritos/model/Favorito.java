package com.example.Favoritos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Favoritos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorito_id")
    private Long favoritoID;

    @Column(nullable = false)
    private Long usuarioID;

    @Column(nullable = false)
    private Long publicacionID;

    @Column(nullable = false)
    private Boolean activo = true;
}
