package com.example.Product.webclient;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class GameWebClient {

    private final WebClient webClient;

    public GameWebClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8090").build();
    }

    /**
     * Obtiene un juego por su ID desde el microservicio de Game
     */
    public Mono<Map> getJuegoById(Long juegoId) {
        return this.webClient.get()
                .uri("/v1/juegos/{id}", juegoId)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Juego no encontrado: " + juegoId)))
                .bodyToMono(Map.class)
                .onErrorReturn(null);
    }

    /**
     * Verifica si un juego existe y está activo
     */
    public Mono<Boolean> verificarJuegoExiste(Long juegoId) {
        return getJuegoById(juegoId)
                .map(juego -> juego != null && Boolean.TRUE.equals(juego.get("activo")))
                .defaultIfEmpty(false);
    }
}

