package main.java.com.example.Product.service;

import main.java.com.example.Product.model.Producto;
import main.java.com.example.Product.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
