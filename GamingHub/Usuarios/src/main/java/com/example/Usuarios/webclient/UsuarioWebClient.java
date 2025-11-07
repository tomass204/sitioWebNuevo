package com.example.Usuarios.webclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Component
public class UsuarioWebClient {

    private final WebClient webClient;

    public UsuarioWebClient(@Value("${usuarios-service.url}") String usuariosServiceUrl) {
        this.webClient = WebClient.builder().baseUrl(usuariosServiceUrl).build();
    }

    public Map<String, Object> getUsuarioById(Long id) {
        return this.webClient.get()
                .uri("/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Usuario no encontrado")))
                .bodyToMono(Map.class).block();
    }

    public Map<String, Object> getRolesByUsuarioId(Long id) {
        return this.webClient.get()
                .uri("/{id}/roles", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Roles no encontrados")))
                .bodyToMono(Map.class).block();
    }

    public Map<String, Object> authenticateUser(String username, String password) {
        return this.webClient.post()
                .uri("/auth")
                .bodyValue(new AuthRequest(username, password))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Autenticación fallida")))
                .bodyToMono(Map.class).block();
    }

    // Inner class for auth request payload
    private static class AuthRequest {
        private String username;
        private String password;

        public AuthRequest(String username, String password) {
            this.username = username;
            this.password = password;
        }

        // getters and setters omitted for brevity
    }
}
