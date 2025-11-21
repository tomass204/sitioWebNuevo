package com.example.Product.service;

import com.example.Product.repository.OrdenRepository;
import com.example.Product.model.Orden;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        // Establecer fecha automáticamente si no viene
        if (orden.getFecha() == null) {
            orden.setFecha(LocalDateTime.now());
        }
        // Asegurar que el estado esté establecido
        if (orden.getEstado() == null || orden.getEstado().isEmpty()) {
            orden.setEstado("PENDIENTE");
        }
        // Log para debugging
        System.out.println("Creando orden:");
        System.out.println("  - Usuario ID: " + orden.getUsuarioId());
        System.out.println("  - Productos: " + orden.getProductoIds());
        System.out.println("  - Total: " + orden.getTotal());
        System.out.println("  - Estado: " + orden.getEstado());
        System.out.println("  - Fecha: " + orden.getFecha());

        Orden savedOrden = ordenRepository.save(orden);

        System.out.println("Orden creada exitosamente con ID: " + savedOrden.getOrdenId());
        return savedOrden;
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
}
