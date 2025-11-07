package com.example.Debate.webclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${usuarios-service.url}")
    private String usuariosServiceUrl;

    @Value("${moderacion-service.url}")
    private String moderacionServiceUrl;

    @Value("${notificaciones-service.url}")
    private String notificacionesServiceUrl;

    @Bean
    public WebClient usuariosWebClient() {
        return WebClient.builder()
                .baseUrl(usuariosServiceUrl)
                .build();
    }

    @Bean
    public WebClient moderacionWebClient() {
        return WebClient.builder()
                .baseUrl(moderacionServiceUrl)
                .build();
    }

    @Bean
    public WebClient notificacionesWebClient() {
        return WebClient.builder()
                .baseUrl(notificacionesServiceUrl)
                .build();
    }
}
