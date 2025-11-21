package com.example.Solicitudes.webclient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class SolicitudWebClient {

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${usuarios-service.url}")
    private String usuariosServiceUrl;

    public boolean usuarioExiste(Long usuarioId) {
        try {
            webClientBuilder.build()
                    .get()
                    .uri(usuariosServiceUrl + "/api/GamingHub/v1/Usuario/{usuarioId}", usuarioId)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(),
                            response -> response.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("Usuario no encontrado")))
                    .bodyToMono(Void.class).block();
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }

    public void cambiarRolUsuario(Long usuarioId, String nuevoRol) {
        webClientBuilder.build()
                .put()
                .uri(usuariosServiceUrl + "/api/GamingHub/v1/Usuario/cambiar-rol/{usuarioId}", usuarioId)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue("{\"rol\": \"" + nuevoRol + "\"}")
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al cambiar rol del usuario")))
                .bodyToMono(Void.class).block();
    }
}
