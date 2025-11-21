package com.ecommerce.apigateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.List;
import java.util.function.Predicate;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${jwt.secret}")
    private String secret;

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            
            // Skip authentication for public endpoints
            if (isSecured.test(request)) {
                if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
                }

                String token = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (token != null && token.startsWith("Bearer ")) {
                    token = token.substring(7);
                } else {
                    return onError(exchange, "Invalid authorization header", HttpStatus.UNAUTHORIZED);
                }

                try {
                    // Validate token
                    SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
                    Claims claims = Jwts.parserBuilder()
                            .setSigningKey(key)
                            .build()
                            .parseClaimsJws(token)
                            .getBody();

                    // Add user details to request headers
                    String username = claims.getSubject();
                    @SuppressWarnings("unchecked")
                    List<String> roles = claims.get("roles", List.class);
                    
                    exchange = exchange.mutate().request(
                            request.mutate()
                                    .header("X-User-Name", username)
                                    .header("X-User-Roles", String.join(",", roles))
                                    .build()
                    ).build();

                } catch (Exception e) {
                    return onError(exchange, "Invalid token", HttpStatus.UNAUTHORIZED);
                }
            }
            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        exchange.getResponse().setStatusCode(httpStatus);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
        // Configuration properties if needed
    }

    // List of public endpoints that don't require authentication
    private final Predicate<ServerHttpRequest> isSecured = request -> 
        !(
            request.getURI().getPath().contains("/api/auth/") ||
            request.getURI().getPath().contains("/api/products") && request.getMethod().matches("GET") ||
            request.getURI().getPath().contains("/swagger-ui") ||
            request.getURI().getPath().contains("/v3/api-docs")
        );
}
