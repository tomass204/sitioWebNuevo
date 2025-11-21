package com.example.Game.service;

import com.example.Game.model.Juego;
import com.example.Game.repository.JuegoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JuegoService {

    @Autowired
    private JuegoRepository juegoRepository;

    public List<Juego> getAllJuegos() {
        return juegoRepository.findByActivoTrue();
    }

    public Optional<Juego> getJuegoById(Long id) {
        return juegoRepository.findById(id);
    }

    public Juego createJuego(Juego juego) {
        // Establecer fecha de creación automáticamente si no viene
        if (juego.getFechaCreacion() == null) {
            juego.setFechaCreacion(java.time.LocalDateTime.now());
        }
        // Asegurar que el juego esté activo por defecto
        if (juego.getActivo() == null) {
            juego.setActivo(true);
        }
        
        System.out.println("═══════════════════════════════════════════");
        System.out.println("📥 CREANDO NUEVO JUEGO");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Título: " + juego.getTitulo());
        System.out.println("Categoría: " + juego.getCategoria());
        System.out.println("Descripción: " + juego.getDescripcion());
        System.out.println("Autor: " + juego.getAutor());
        System.out.println("Precio: " + juego.getPrecio());
        System.out.println("Imagen URL: " + juego.getImagenUrl());
        System.out.println("Activo: " + juego.getActivo());
        System.out.println("Fecha Creación: " + juego.getFechaCreacion());
        System.out.println("═══════════════════════════════════════════");
        
        Juego savedJuego = juegoRepository.save(juego);
        
        System.out.println("═══════════════════════════════════════════");
        System.out.println("✅ JUEGO CREADO Y GUARDADO EN BASE DE DATOS");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Juego ID generado: " + savedJuego.getJuegoId());
        System.out.println("Título: " + savedJuego.getTitulo());
        System.out.println("Categoría: " + savedJuego.getCategoria());
        System.out.println("Autor: " + savedJuego.getAutor());
        System.out.println("Precio: " + savedJuego.getPrecio());
        System.out.println("Fecha Creación: " + savedJuego.getFechaCreacion());
        System.out.println("═══════════════════════════════════════════");
        
        return savedJuego;
    }

    public Juego updateJuego(Long id, Juego juegoDetails) {
        Optional<Juego> optionalJuego = juegoRepository.findById(id);
        if (optionalJuego.isPresent()) {
            Juego juego = optionalJuego.get();
            juego.setTitulo(juegoDetails.getTitulo());
            juego.setDescripcion(juegoDetails.getDescripcion());
            juego.setCategoria(juegoDetails.getCategoria());
            juego.setImagenUrl(juegoDetails.getImagenUrl());
            juego.setAutor(juegoDetails.getAutor());
            juego.setPrecio(juegoDetails.getPrecio());
            juego.setDownloadUrl(juegoDetails.getDownloadUrl());
            juego.setActivo(juegoDetails.getActivo());
            return juegoRepository.save(juego);
        }
        return null;
    }

    public boolean deleteJuego(Long id) {
        Optional<Juego> optionalJuego = juegoRepository.findById(id);
        if (optionalJuego.isPresent()) {
            Juego juego = optionalJuego.get();
            juego.setActivo(false);
            juegoRepository.save(juego);
            return true;
        }
        return false;
    }

    public List<Juego> getJuegosByCategoria(String categoria) {
        return juegoRepository.findByCategoria(categoria);
    }

    public List<Juego> searchJuegos(String titulo) {
        return juegoRepository.findByTituloContainingIgnoreCase(titulo);
    }

    public List<Juego> getJuegosByAutor(String autor) {
        return juegoRepository.findByAutor(autor);
    }
}

