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
        // Validar que el juego tenga todos los campos requeridos
        if (juego.getTitulo() == null || juego.getTitulo().trim().isEmpty()) {
            throw new IllegalArgumentException("El título es requerido");
        }
        if (juego.getCategoria() == null || juego.getCategoria().trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría es requerida");
        }
        if (juego.getAutor() == null || juego.getAutor().trim().isEmpty()) {
            throw new IllegalArgumentException("El autor es requerido");
        }
        if (juego.getPrecio() == null || juego.getPrecio().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El precio debe ser mayor o igual a cero");
        }
        if (juego.getImagenUrl() == null || juego.getImagenUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("La URL de la imagen es requerida");
        }

        // Establecer valores por defecto si no vienen
        if (juego.getActivo() == null) {
            juego.setActivo(true);
        }
        if (juego.getFechaCreacion() == null) {
            juego.setFechaCreacion(java.time.LocalDateTime.now());
        }

        return juegoRepository.save(juego);
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

