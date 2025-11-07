package com.example.Usuarios.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactiva CSRF para APIs REST
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll() // permite libre acceso a todos los endpoints
                .anyRequest().permitAll() // permite todo
            )
            .httpBasic(basic -> basic.disable()); // Desactiva autenticación básica

        return http.build();
    }


    public class OpenApiConfig {

    @Bean
    public OpenAPI apiInfo(){
        return new OpenAPI()
        .info(new Info()
            .title("Inicio de Seccion API")
            .version("1.0")
            .description("Documentacion de Edpoint para inicio de sesion de GamingHub"));
    }
}
}

