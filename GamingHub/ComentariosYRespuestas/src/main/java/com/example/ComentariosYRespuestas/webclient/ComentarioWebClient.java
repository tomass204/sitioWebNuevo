package com.example.ComentariosYRespuestas.webclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Component
public class ComentarioWebClient {

    private final WebClient usuariosWebClient;
    private final WebClient moderacionWebClient;
    private final WebClient notificacionesWebClient;

    public ComentarioWebClient(
            @Value("${usuarios-service.url}") String usuariosServiceUrl,
            @Value("${moderacion-service.url}") String moderacionServiceUrl,
            @Value("${notificaciones-service.url}") String notificacionesServiceUrl) {
        this.usuariosWebClient = WebClient.builder().baseUrl(usuariosServiceUrl).build();
        this.moderacionWebClient = WebClient.builder().baseUrl(moderacionServiceUrl).build();
        this.notificacionesWebClient = WebClient.builder().baseUrl(notificacionesServiceUrl).build();
    }

    // Consultar Usuarios/Auth para obtener datos del autor
    public Map<String, Object> getUsuarioById(Long id) {
        return this.usuariosWebClient.get()
                .uri("/usuarios/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Usuario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    public Map<String, Object> getUsuarioByEmail(String email) {
        return this.usuariosWebClient.get()
                .uri("/api/GamingHub/v1/Usuario/email/{email}", email)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Usuario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Moderación para reportar comentario
    public Map<String, Object> reportComentario(Long comentarioId, String reason) {
        return this.moderacionWebClient.post()
                .uri("/moderacion/report")
                .bodyValue(new ReportRequest(comentarioId, reason))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al reportar comentario")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Notificaciones para enviar notificación de nuevo comentario
    public Map<String, Object> sendNotification(Long userId, String message) {
        return this.notificacionesWebClient.post()
                .uri("/notificaciones")
                .bodyValue(new NotificationRequest(userId, message))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al enviar notificación")))
                .bodyToMono(Map.class).block();
    }

    // Inner classes for request payloads
    private static class ReportRequest {
        private Long comentarioId;
        private String reason;

        public ReportRequest(Long comentarioId, String reason) {
            this.comentarioId = comentarioId;
            this.reason = reason;
        }

        // getters and setters omitted
    }

    private static class NotificationRequest {
        private Long userId;
        private String message;

        public NotificationRequest(Long userId, String message) {
            this.userId = userId;
            this.message = message;
        }

        // getters and setters omitted
    }
}
