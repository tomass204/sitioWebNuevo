package com.example.Product.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Product.model.Orden;
import com.example.Product.repository.OrdenRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    public List<Orden> getAllOrdenes() {
        return ordenRepository.findAll();
    }

    public Optional<Orden> getOrdenById(Long id) {
        return ordenRepository.findById(id);
    }

    public Orden createOrden(Orden orden) {
        orden.setFecha(LocalDateTime.now());
        return ordenRepository.save(orden);
    }

    public Orden updateOrden(Long id, Orden ordenDetails) {
        Optional<Orden> optionalOrden = ordenRepository.findById(id);
        if (optionalOrden.isPresent()) {
            Orden orden = optionalOrden.get();
            orden.setProductoIds(ordenDetails.getProductoIds());
            orden.setTotal(ordenDetails.getTotal());
            orden.setEstado(ordenDetails.getEstado());
            return ordenRepository.save(orden);
        }
        return null;
    }

    public boolean deleteOrden(Long id) {
        if (ordenRepository.existsById(id)) {
            ordenRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Orden> getOrdenesByUsuario(Long usuarioId) {
        return ordenRepository.findByUsuarioId(usuarioId);
    }

    public List<Orden> getOrdenesByEstado(String estado) {
        return ordenRepository.findByEstado(estado);
    }

    public boolean isOwner(Long id, String userId) {
        return getOrdenById(id)
                .map(orden -> orden.getUsuarioId().toString().equals(userId))
                .orElse(false);
    }
}
