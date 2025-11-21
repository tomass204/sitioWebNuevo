package com.example.Imagenes.repository;

import com.example.Imagenes.model.Imagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository 
public interface ImagenRepository extends JpaRepository<Imagen,Long> {

    List<Imagen> findAllByEntidadIDAndTipoEntidad(Long entidadID, String tipoEntidad);

    List<Imagen> findAllByEntidadIDAndTipoEntidadAndActivoTrue(Long entidadID, String tipoEntidad);


}
