package com.example.Game.Config;

import com.example.Game.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
                .requestMatchers("GET", "/v1/juegos", "/v1/juegos/**").hasAnyRole("USUARIO_BASICO", "CREADOR_CONTENIDO", "MODERADOR", "PROPIETARIO") // Viewing games for authenticated users
                .requestMatchers("POST", "/v1/juegos").hasAnyRole("CREADOR_CONTENIDO", "MODERADOR", "PROPIETARIO") // Creating games for creators and above
                .requestMatchers("PUT", "/v1/juegos/**").hasAnyRole("MODERADOR", "PROPIETARIO") // Updating games for moderators and owners
                .requestMatchers("DELETE", "/v1/juegos/**").hasAnyRole("MODERADOR", "PROPIETARIO") // Deleting games for moderators and owners
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}