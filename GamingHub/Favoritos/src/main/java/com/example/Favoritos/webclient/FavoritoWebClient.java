package com.example.Favoritos.webclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Component
public class FavoritoWebClient {

    private final WebClient usuariosWebClient;
    private final WebClient publicacionesWebClient;
    private final WebClient debatesWebClient;

    public FavoritoWebClient(
            @Value("${usuarios-service.url}") String usuariosServiceUrl,
            @Value("${publicaciones-service.url}") String publicacionesServiceUrl,
            @Value("${debates-service.url}") String debatesServiceUrl) {
        this.usuariosWebClient = WebClient.builder().baseUrl(usuariosServiceUrl).build();
        this.publicacionesWebClient = WebClient.builder().baseUrl(publicacionesServiceUrl).build();
        this.debatesWebClient = WebClient.builder().baseUrl(debatesServiceUrl).build();
    }

    // Consultar Usuarios/Auth para saber de quién son los favoritos
    public Map<String, Object> getUsuarioById(Long id) {
        return this.usuariosWebClient.get()
                .uri("/usuarios/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Usuario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Noticias/Publicaciones para traer datos de lo que se guardó
    public Map<String, Object> getPublicacionById(Long id) {
        return this.publicacionesWebClient.get()
                .uri("/publicaciones/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Publicación no encontrada")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Debates para cuando se guarda un debate favorito
    public Map<String, Object> getDebateById(Long id) {
        return this.debatesWebClient.get()
                .uri("/debates/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Debate no encontrado")))
                .bodyToMono(Map.class).block();
    }
}
