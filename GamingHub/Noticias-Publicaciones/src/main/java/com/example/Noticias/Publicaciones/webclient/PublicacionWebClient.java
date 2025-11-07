package com.example.Noticias.Publicaciones.webclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Component
public class PublicacionWebClient {

    private final WebClient usuariosWebClient;
    private final WebClient comentariosWebClient;
    private final WebClient favoritosWebClient;
    private final WebClient notificacionesWebClient;

    public PublicacionWebClient(
            @Value("${usuarios-service.url}") String usuariosServiceUrl,
            @Value("${comentarios-service.url}") String comentariosServiceUrl,
            @Value("${favoritos-service.url}") String favoritosServiceUrl,
            @Value("${notificaciones-service.url}") String notificacionesServiceUrl) {
        this.usuariosWebClient = WebClient.builder().baseUrl(usuariosServiceUrl).build();
        this.comentariosWebClient = WebClient.builder().baseUrl(comentariosServiceUrl).build();
        this.favoritosWebClient = WebClient.builder().baseUrl(favoritosServiceUrl).build();
        this.notificacionesWebClient = WebClient.builder().baseUrl(notificacionesServiceUrl).build();
    }

    // Consultar Usuarios/Auth para saber quién publicó
    public Map<String, Object> getUsuarioById(Long id) {
        return this.usuariosWebClient.get()
                .uri("/usuarios/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Usuario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Comentarios/Reacciones para mostrar comentarios en un post
    public Map<String, Object> getComentariosByPublicacionId(Long publicacionId) {
        return this.comentariosWebClient.get()
                .uri("/comentarios/publicacion/{publicacionId}", publicacionId)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Comentarios no encontrados")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Favoritos cuando un usuario guarda una noticia
    public Map<String, Object> addFavorito(Long userId, Long publicacionId) {
        return this.favoritosWebClient.post()
                .uri("/favoritos")
                .bodyValue(Map.of("userId", userId, "publicacionId", publicacionId))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al agregar favorito")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Notificaciones para avisar de nuevas publicaciones
    public Map<String, Object> sendNotification(Long userId, String message) {
        return this.notificacionesWebClient.post()
                .uri("/notificaciones")
                .bodyValue(Map.of("userId", userId, "message", message))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al enviar notificación")))
                .bodyToMono(Map.class).block();
    }
}
