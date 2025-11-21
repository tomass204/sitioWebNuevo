package com.example.Usuarios.webclient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class MailWebClient {

    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${mail-service.url}")
    private String mailServiceUrl;

    public boolean enviarCorreo(Map<String, Object> mail) {
        try {
            webClientBuilder.build()
                    .post()
                    .uri(mailServiceUrl + "/api/GamingHub/v1/Mail")
                    .bodyValue(mail)
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


}
