package com.example.Moderacion.webclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Component
public class ModeracionWebClient {

    private final WebClient usuariosWebClient;
    private final WebClient comentariosWebClient;
    private final WebClient publicacionesWebClient;
    private final WebClient debatesWebClient;

    public ModeracionWebClient(
            @Value("${usuarios-service.url}") String usuariosServiceUrl,
            @Value("${comentarios-service.url}") String comentariosServiceUrl,
            @Value("${noticias-service.url}") String noticiasServiceUrl,
            @Value("${debates-service.url}") String debatesServiceUrl) {
        this.usuariosWebClient = WebClient.builder().baseUrl(usuariosServiceUrl).build();
        this.comentariosWebClient = WebClient.builder().baseUrl(comentariosServiceUrl).build();
        this.publicacionesWebClient = WebClient.builder().baseUrl(noticiasServiceUrl).build();
        this.debatesWebClient = WebClient.builder().baseUrl(debatesServiceUrl).build();
    }

    // Consultar Usuarios/Auth para obtener usuario
    public Map<String, Object> getUsuario(Long id) {
        return this.usuariosWebClient.get()
                .uri("/usuarios/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Usuario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Usuarios/Auth para suspender cuenta
    public Map<String, Object> suspendUser(Long userId, String reason) {
        return this.usuariosWebClient.post()
                .uri("/usuarios/suspend")
                .bodyValue(new SuspendRequest(userId, reason))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al suspender usuario")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Comentarios/Reacciones para eliminar comentario
    public Map<String, Object> deleteComentario(Long comentarioId) {
        return this.comentariosWebClient.delete()
                .uri("/comentarios/{comentarioId}", comentarioId)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Comentario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Noticias/Publicaciones para ocultar publicación
    public Map<String, Object> hidePublicacion(Long publicacionId) {
        return this.publicacionesWebClient.put()
                .uri("/publicaciones/{publicacionId}/hide", publicacionId)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Publicación no encontrada")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Debates para cerrar debate
    public Map<String, Object> closeDebate(Long debateId) {
        return this.debatesWebClient.put()
                .uri("/debates/{debateId}/close", debateId)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Debate no encontrado")))
                .bodyToMono(Map.class).block();
    }

    // Inner classes for request payloads
    private static class SuspendRequest {
        private Long userId;
        private String reason;

        public SuspendRequest(Long userId, String reason) {
            this.userId = userId;
            this.reason = reason;
        }

        // getters and setters omitted
    }
}
