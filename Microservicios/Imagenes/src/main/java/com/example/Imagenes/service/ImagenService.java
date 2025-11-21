package com.example.Imagenes.service;


import com.example.Imagenes.model.Imagen;
import com.example.Imagenes.repository.ImagenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;


@Service
public class ImagenService {

    @Value("${ruta-base}")
    private String rutaBase;

    @Autowired
    private ImagenRepository repository;



    public List<Imagen> crear(
            Long entidadID,
            String tipoEntidad,
            List<MultipartFile> archivos) {
        List<Imagen> imagenes = new ArrayList<>();

        for (MultipartFile archivo : archivos) {
            try {
                Path directorioDestino = Paths.get(rutaBase, tipoEntidad, entidadID.toString());
                if (!Files.exists(directorioDestino)) {
                    Files.createDirectories(directorioDestino);
                }
                String nombreArchivo = archivo.getOriginalFilename();
                Path rutaArchivo = directorioDestino.resolve(nombreArchivo);
                Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

                Imagen imagen = new Imagen();
                imagen.setImagenID(null);
                imagen.setEntidadID(entidadID);
                imagen.setTipoEntidad(tipoEntidad);
                imagen.setNombre(nombreArchivo);
                imagen.setActivo(true);
                imagen.setFechaCreacion(LocalDateTime.now());

                repository.save(imagen);
                imagenes.add(imagen);

            } catch (IOException e) {
                throw new RuntimeException("Error al guardar archivo: " + archivo.getOriginalFilename(), e);
            }
        }

        return imagenes;
    }


    public List<Imagen> buscarPorEntidad(Long entidadID, String tipoEntidad) {
        return repository.findAllByEntidadIDAndTipoEntidadAndActivoTrue(entidadID, tipoEntidad);
    }

    public Optional<Resource> obtenerImagenPorId(Long id) {
        return repository.findById(id).flatMap(imagen -> {
            try {
                Path rutaArchivo = Paths.get(rutaBase, imagen.getTipoEntidad(), imagen.getEntidadID().toString(), imagen.getNombre());
                Resource recurso = new UrlResource(rutaArchivo.toUri());

                if (recurso.exists() && recurso.isReadable()) {
                    return Optional.of(recurso);
                } else {
                    return Optional.empty();
                }
            } catch (Exception e) {
                return Optional.empty();
            }
        });
    }

    public MediaType obtenerContentType(Resource recurso) {
        try {
            Path path = Paths.get(recurso.getURI());
            String tipo = Files.probeContentType(path);
            if (tipo != null) {
                return MediaType.parseMediaType(tipo);
            }
        } catch (Exception ignored) {}
        return MediaType.APPLICATION_OCTET_STREAM;
    }



}
