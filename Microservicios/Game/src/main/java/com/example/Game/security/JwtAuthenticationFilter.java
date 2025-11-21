package com.example.Game.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtSecret.getBytes())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                
                // Mapear roles del sitio web a roles del backend
                String roleWithPrefix;
                if (role != null) {
                    if (role.startsWith("ROLE_")) {
                        roleWithPrefix = role;
                    } else {
                        switch (role) {
                            case "UsuarioBasico":
                                roleWithPrefix = "ROLE_USUARIO_BASICO";
                                break;
                            case "Influencer":
                                roleWithPrefix = "ROLE_INFLUENCER";
                                break;
                            case "Moderador":
                                roleWithPrefix = "ROLE_MODERADOR";
                                break;
                            case "Propietario":
                                roleWithPrefix = "ROLE_PROPIETARIO";
                                break;
                            default:
                                roleWithPrefix = "ROLE_USUARIO_BASICO";
                        }
                    }
                } else {
                    roleWithPrefix = "ROLE_USUARIO_BASICO";
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority(roleWithPrefix)));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // Invalid token
            }
        }
        filterChain.doFilter(request, response);
    }
}

