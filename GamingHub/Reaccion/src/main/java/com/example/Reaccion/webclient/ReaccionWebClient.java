package com.example.Reaccion.webclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Component
public class ReaccionWebClient {

    private final WebClient usuariosWebClient;
    private final WebClient comentariosWebClient;
    private final WebClient moderacionWebClient;
    private final WebClient notificacionesWebClient;

    public ReaccionWebClient(
            @Value("${usuarios-service.url}") String usuariosServiceUrl,
            @Value("${comentarios-service.url}") String comentariosServiceUrl,
            @Value("${moderacion-service.url}") String moderacionServiceUrl,
            @Value("${notificaciones-service.url}") String notificacionesServiceUrl) {
        this.usuariosWebClient = WebClient.builder().baseUrl(usuariosServiceUrl).build();
        this.comentariosWebClient = WebClient.builder().baseUrl(comentariosServiceUrl).build();
        this.moderacionWebClient = WebClient.builder().baseUrl(moderacionServiceUrl).build();
        this.notificacionesWebClient = WebClient.builder().baseUrl(notificacionesServiceUrl).build();
    }

    // Consultar Usuarios/Auth para identificar autores de reacciones
    public Map<String, Object> getUsuarioById(Long id) {
        return this.usuariosWebClient.get()
                .uri("/usuarios/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Usuario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Comentarios/Reacciones para enlazar una reacción a un comentario
    public Map<String, Object> getComentarioById(Long id) {
        return this.comentariosWebClient.get()
                .uri("/comentarios/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Comentario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Moderación para eliminar reacciones ofensivas
    public Map<String, Object> reportReaccion(Long reaccionId, String reason) {
        return this.moderacionWebClient.post()
                .uri("/moderacion/report")
                .bodyValue(Map.of("reaccionId", reaccionId, "reason", reason))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al reportar reacción")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Notificaciones para cuando alguien da like
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
