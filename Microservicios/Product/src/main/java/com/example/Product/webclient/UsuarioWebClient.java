package main.java.com.example.Product.webclient;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class UsuarioWebClient {

    private final WebClient webClient;

    public UsuarioWebClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8081").build(); // Assuming Usuarios service is on 8081
    }

    public Mono<String> getUsuarioRole(Long usuarioId) {
        return this.webClient.get()
                .uri("/v1/usuarios/{id}/role", usuarioId)
                .retrieve()
                .bodyToMono(String.class);
    }
}
