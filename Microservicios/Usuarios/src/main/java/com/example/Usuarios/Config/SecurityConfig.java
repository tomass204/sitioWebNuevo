package com.example.Usuarios.Config;

import com.example.Usuarios.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("POST", "/api/GamingHub/v1/Usuario/iniciar-session").permitAll() // Login
                .requestMatchers("POST", "/api/GamingHub/v1/Usuario").permitAll() // Registration
                .requestMatchers("PUT", "/api/GamingHub/v1/Usuario/recuperar-contrasena").permitAll() // Password recovery
                .requestMatchers("GET", "/api/GamingHub/v1/Usuario/**").authenticated() // View users
                .requestMatchers("PUT", "/api/GamingHub/v1/Usuario/**").hasAnyRole("MODERADOR", "PROPIETARIO") // Edit users
                .requestMatchers("PATCH", "/api/GamingHub/v1/Usuario/**").hasAnyRole("MODERADOR", "PROPIETARIO") // Change status
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}


