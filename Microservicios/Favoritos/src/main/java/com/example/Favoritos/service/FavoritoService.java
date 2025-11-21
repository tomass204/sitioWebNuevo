package com.example.Favoritos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Favoritos.model.Favorito;
import com.example.Favoritos.repository.FavoritoRepository;
import com.example.Favoritos.webclient.FavoritoWebClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository repository;

    @Autowired
    private FavoritoWebClient favoritoWebClient;

    public Favorito guardarFavorito(Map<String, Object> favoritoData) {
        Long usuarioID, publicacionID;
        try {
            usuarioID = Long.valueOf(String.valueOf(favoritoData.get("usuarioID")));
            publicacionID = Long.valueOf(String.valueOf(favoritoData.get("publicacionID")));

        } catch (Exception ex) {
            throw new RuntimeException("Error en los datos de entrada.");
        }
        // Validate user exists
        Map<String, Object> usuario = favoritoWebClient.getUsuarioById(usuarioID);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado.");
        }

        Optional<Favorito> favoritoExistente = repository.findByUsuarioIDAndPublicacionID(usuarioID, publicacionID);
        if (favoritoExistente.isPresent()) {
            
            Favorito favorito = favoritoExistente.get();
            if (!favorito.getActivo()) {
                favorito.setActivo(true);
                return repository.save(favorito);
            }
            return favorito; 
        } else {
            
            Favorito favorito = new Favorito();
            favorito.setUsuarioID(usuarioID);
            favorito.setPublicacionID(publicacionID);
            return repository.save(favorito);
        }
    }

    public void eliminarFavorito(Long id) {
        repository.deleteById(id);
    }

    public List<Favorito> obtenerFavoritosPorUsuario(Long usuarioID) {
        return repository.findByUsuarioID(usuarioID);
    }

    public Favorito verFavorito(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Favorito no encontrado."));
    }

    public boolean existeFavorito(Long usuarioID, Long publicacionID) {
        return repository.existsByUsuarioIDAndPublicacionID(usuarioID, publicacionID);
    }
}
