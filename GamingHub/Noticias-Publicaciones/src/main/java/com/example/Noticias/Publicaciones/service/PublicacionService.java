package com.example.Noticias.Publicaciones.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Noticias.Publicaciones.model.Publicacion;
import com.example.Noticias.Publicaciones.repository.PublicacionRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PublicacionService {

    @Autowired
    private PublicacionRepository repository;

    public List<Publicacion> listarTodas() {
        return repository.findAll();
    }

    public Publicacion verPublicacion(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Publicación no encontrada."));
    }

    public Publicacion crearPublicacion(Map<String, Object> publicacionData) {
        Publicacion publicacion = new Publicacion();
        publicacion.setTitulo((String) publicacionData.get("titulo"));
        publicacion.setContenido((String) publicacionData.get("contenido"));
        publicacion.setTipo((String) publicacionData.get("tipo"));
        publicacion.setAutorID((Long) publicacionData.get("autorID"));
        return repository.save(publicacion);
    }

    public Publicacion editarPublicacion(Map<String, Object> publicacionData, Long id) {
        Publicacion publicacion = verPublicacion(id);
        publicacion.setTitulo((String) publicacionData.get("titulo"));
        publicacion.setContenido((String) publicacionData.get("contenido"));
        publicacion.setTipo((String) publicacionData.get("tipo"));
        return repository.save(publicacion);
    }

    public void eliminarPublicacion(Long id) {
        repository.deleteById(id);
    }

    public Publicacion destacarPublicacion(Long id) {
        Publicacion publicacion = verPublicacion(id);
        publicacion.setDestacada(true);
        return repository.save(publicacion);
    }
}
