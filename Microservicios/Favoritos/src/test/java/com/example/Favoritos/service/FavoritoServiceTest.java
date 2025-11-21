package com.example.Favoritos.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Favoritos.model.Favorito;
import com.example.Favoritos.repository.FavoritoRepository;
import com.example.Favoritos.webclient.FavoritoWebClient;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FavoritoServiceTest {

    @Mock
    private FavoritoRepository repository;

    @Mock
    private FavoritoWebClient favoritoWebClient;

    @InjectMocks
    private FavoritoService service;

    @Test
    void guardarFavoritoNuevo() {
        Map<String, Object> mapFavorito = new HashMap<>();
        mapFavorito.put("usuarioID", 1L);
        mapFavorito.put("publicacionID", 1L);

        Map<String, Object> usuario = Map.of("usuarioID", 1L);

        Favorito favorito = new Favorito();
        favorito.setFavoritoID(1L);
        favorito.setUsuarioID(1L);
        favorito.setPublicacionID(1L);
        favorito.setActivo(true);

        when(favoritoWebClient.getUsuarioById(1L)).thenReturn(usuario);
        when(repository.findByUsuarioIDAndPublicacionID(1L, 1L)).thenReturn(Optional.empty());
        when(repository.save(ArgumentMatchers.any(Favorito.class))).thenReturn(favorito);

        Favorito result = service.guardarFavorito(mapFavorito);

        assertNotNull(result);
        assertEquals(favorito.getFavoritoID(), result.getFavoritoID());
    }

    @Test
    void guardarFavoritoExistente() {
        Map<String, Object> mapFavorito = new HashMap<>();
        mapFavorito.put("usuarioID", 1L);
        mapFavorito.put("publicacionID", 1L);

        Map<String, Object> usuario = Map.of("usuarioID", 1L);

        Favorito favorito = new Favorito();
        favorito.setFavoritoID(1L);
        favorito.setUsuarioID(1L);
        favorito.setPublicacionID(1L);
        favorito.setActivo(false);

        when(favoritoWebClient.getUsuarioById(1L)).thenReturn(usuario);
        when(repository.findByUsuarioIDAndPublicacionID(1L, 1L)).thenReturn(Optional.of(favorito));
        when(repository.save(ArgumentMatchers.any(Favorito.class))).thenReturn(favorito);

        Favorito result = service.guardarFavorito(mapFavorito);

        assertNotNull(result);
        assertEquals(true, result.getActivo());
    }

    @Test
    void eliminarFavorito() {
        service.eliminarFavorito(1L);
        // No exception thrown
    }

    @Test
    void obtenerFavoritosPorUsuario() {
        Favorito favorito = new Favorito();
        favorito.setFavoritoID(1L);
        favorito.setUsuarioID(1L);
        favorito.setPublicacionID(1L);
        favorito.setActivo(true);

        List<Favorito> favoritos = List.of(favorito);

        when(repository.findByUsuarioID(1L)).thenReturn(favoritos);

        List<Favorito> result = service.obtenerFavoritosPorUsuario(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(favorito.getFavoritoID(), result.get(0).getFavoritoID());
    }

    @Test
    void verFavorito() {
        Favorito favorito = new Favorito();
        favorito.setFavoritoID(1L);
        favorito.setUsuarioID(1L);
        favorito.setPublicacionID(1L);
        favorito.setActivo(true);

        when(repository.findById(1L)).thenReturn(Optional.of(favorito));

        Favorito result = service.verFavorito(1L);

        assertNotNull(result);
        assertEquals(favorito.getFavoritoID(), result.getFavoritoID());
    }

    @Test
    void existeFavorito() {
        when(repository.existsByUsuarioIDAndPublicacionID(1L, 1L)).thenReturn(true);

        boolean result = service.existeFavorito(1L, 1L);

        assertEquals(true, result);
    }
}
