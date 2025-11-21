package com.example.ComentariosYRespuestas.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 🔹 Permitir solicitudes desde el mismo microservicio o desde frontend en el mismo puerto
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080", "http://localhost:8087"));

        // 🔹 Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // 🔹 Cabeceras permitidas
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // 🔹 Permitir enviar credenciales (cookies, headers de auth, etc.)
        configuration.setAllowCredentials(true);

        // 🔹 Aplica esta configuración a todos los endpoints del microservicio
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
