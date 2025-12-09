package com.example.Product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Product.model.Producto;
import com.example.Product.repository.ProductoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> getAllProductos() {
        return productoRepository.findByActivoTrue();
    }

    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    public Producto createProducto(Producto producto) {
        // Validar que el producto tenga todos los campos requeridos
        if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es requerido");
        }
        if (producto.getPrecio() == null || producto.getPrecio().compareTo(java.math.BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El precio debe ser mayor o igual a cero");
        }

        // Establecer valores por defecto si no vienen
        if (producto.getActivo() == null) {
            producto.setActivo(true);
        }

        return productoRepository.save(producto);
    }

    public Producto updateProducto(Long id, Producto productoDetails) {
        Optional<Producto> optionalProducto = productoRepository.findById(id);
        if (optionalProducto.isPresent()) {
            Producto producto = optionalProducto.get();
            producto.setNombre(productoDetails.getNombre());
            producto.setDescripcion(productoDetails.getDescripcion());
            producto.setPrecio(productoDetails.getPrecio());
            producto.setCategoria(productoDetails.getCategoria());
            producto.setImagenUrl(productoDetails.getImagenUrl());
            producto.setActivo(productoDetails.getActivo());
            return productoRepository.save(producto);
        }
        return null;
    }

    public boolean deleteProducto(Long id) {
        Optional<Producto> optionalProducto = productoRepository.findById(id);
        if (optionalProducto.isPresent()) {
            Producto producto = optionalProducto.get();
            producto.setActivo(false);
            productoRepository.save(producto);
            return true;
        }
        return false;
    }

    public List<Producto> getProductosByCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    public List<Producto> searchProductos(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }
}
