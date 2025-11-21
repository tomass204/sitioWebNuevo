package com.example.Favoritos.controller;

import com.example.Favoritos.model.Favorito;
import com.example.Favoritos.service.FavoritoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(FavoritoController.class)
class FavoritoControllerTest {

    @MockBean
    private FavoritoService service;

    @Autowired
    private MockMvc mockMvc;

    @Test
    void guardarFavorito() throws Exception {
        Favorito favorito = new Favorito();
        favorito.setFavoritoID(1L);
        favorito.setUsuarioID(1L);
        favorito.setPublicacionID(1L);
        favorito.setActivo(true);

        when(service.guardarFavorito(anyMap())).thenReturn(favorito);

        String json = "{\n" +
                "  \"usuarioID\": 1,\n" +
                "  \"publicacionID\": 1\n" +
                "}";

        try {
            mockMvc.perform(post("/api/GamingHub/v1/Favoritos/guardar")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.favoritoID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void eliminarFavorito() throws Exception {
        try {
            mockMvc.perform(delete("/api/GamingHub/v1/Favoritos/1"))
                .andExpect(status().isNoContent());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void obtenerFavoritosPorUsuario() throws Exception {
        Favorito favorito = new Favorito();
        favorito.setFavoritoID(1L);
        favorito.setUsuarioID(1L);
        favorito.setPublicacionID(1L);
        favorito.setActivo(true);

        List<Favorito> favoritos = List.of(favorito);

        when(service.obtenerFavoritosPorUsuario(1L)).thenReturn(favoritos);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Favoritos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.favoritoList[0].favoritoID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
