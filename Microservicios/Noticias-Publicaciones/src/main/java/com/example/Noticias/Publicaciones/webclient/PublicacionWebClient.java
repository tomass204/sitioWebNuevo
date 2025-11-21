package com.example.Noticias.Publicaciones.webclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class PublicacionWebClient {

    private final WebClient usuariosWebClient;
    private final WebClient comentariosWebClient;
    private final WebClient favoritosWebClient;
    private final WebClient notificacionesWebClient;
    private final WebClient reaccionesWebClient;
    private final WebClient imagenesWebClient;

    public PublicacionWebClient(
            @Value("${usuarios-service.url}") String usuariosServiceUrl,
            @Value("${comentarios-service.url}") String comentariosServiceUrl,
            @Value("${favoritos-service.url}") String favoritosServiceUrl,
            @Value("${notificaciones-service.url}") String notificacionesServiceUrl,
            @Value("${reacciones-service.url}") String reaccionesServiceUrl,
            @Value("${imagenes-service.url}") String imagenesServiceUrl) {
        this.usuariosWebClient = WebClient.builder().baseUrl(usuariosServiceUrl).build();
        this.comentariosWebClient = WebClient.builder().baseUrl(comentariosServiceUrl).build();
        this.favoritosWebClient = WebClient.builder().baseUrl(favoritosServiceUrl).build();
        this.notificacionesWebClient = WebClient.builder().baseUrl(notificacionesServiceUrl).build();
        this.reaccionesWebClient = WebClient.builder().baseUrl(reaccionesServiceUrl).build();
        this.imagenesWebClient = WebClient.builder().baseUrl(imagenesServiceUrl).build();
    }

    // Consultar Usuarios/Auth para saber quién publicó
    public Map<String, Object> getUsuarioById(Long id) {
        return this.usuariosWebClient.get()
                .uri("/api/GamingHub/v1/Usuario/{id}", id)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Usuario no encontrado")))
                .bodyToMono(Map.class).block();
    }


    public List<Map<String, Object>> getImagenesPorPublicacionId(Long id, String tipo) {
        return this.imagenesWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/GamingHub/v1/Imagen/buscar-por-entidad")
                        .queryParam("entidadID", id)
                        .queryParam("tipoEntidad", tipo)
                        .build())
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Publicación no encontrada: " + body)))
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }

    public void subirImagenes(Long entidadId, List<MultipartFile> archivos) throws IOException {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("entidadID", entidadId);
        builder.part("tipoEntidad", "PUBLICACION");

        for (MultipartFile archivo : archivos) {
            ByteArrayResource resource = new ByteArrayResource(archivo.getBytes()) {
                @Override
                public String getFilename() {
                    return archivo.getOriginalFilename();
                }
            };

            builder.part("archivos", resource)
                    .filename(archivo.getOriginalFilename())
                    .contentType(MediaType.parseMediaType(archivo.getContentType()));
        }

        imagenesWebClient.post()
                .uri("/api/GamingHub/v1/Imagen/subir")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .bodyValue(builder.build())
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }




    // Consultar Comentarios/Reacciones para mostrar comentarios en un post
    public Map<String, Object> getComentariosByPublicacionId(Long publicacionId) {
        return this.comentariosWebClient.get()
                .uri("/comentarios/publicacion/{publicacionId}", publicacionId)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Comentarios no encontrados")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Favoritos cuando un usuario guarda una noticia
    public Map<String, Object> addFavorito(Long userId, Long publicacionId) {
        return this.favoritosWebClient.post()
                .uri("/favoritos")
                .bodyValue(Map.of("userId", userId, "publicacionId", publicacionId))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al agregar favorito")))
                .bodyToMono(Map.class).block();
    }

    // Consultar Notificaciones para avisar de nuevas publicaciones
    public Map<String, Object> sendNotification(Long userId, String message) {
        return this.notificacionesWebClient.post()
                .uri("/notificaciones")
                .bodyValue(Map.of("userId", userId, "message", message))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Error al enviar notificación")))
                .bodyToMono(Map.class).block();
    }

    public boolean existeUsuario(Long id) {
        try {
            this.usuariosWebClient.get()
                    .uri("/api/GamingHub/v1/Usuario/{id}", id)
                    .retrieve()
                    .bodyToMono(Object.class)
                    .block();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Consultar Reacciones para obtener el conteo de likes de una publicación
    public Long getLikesCount(Long publicacionId) {
        try {
            return this.reaccionesWebClient.get()
                    .uri("/api/GamingHub/v1/Reacciones/publicacion/{idPublicacion}", publicacionId)
                    .retrieve()
                    .bodyToMono(Long.class)
                    .block();
        } catch (Exception e) {
            return 0L;
        }
    }

    // Consultar Comentarios para obtener el conteo de comentarios de una publicación
    public Long getComentariosCount(Long publicacionId) {
        try {
            return this.comentariosWebClient.get()
                    .uri("/api/GamingHub/v1/Comentarios/publicacion/{idPublicacion}/count", publicacionId)
                    .retrieve()
                    .bodyToMono(Long.class)
                    .block();
        } catch (Exception e) {
            return 0L;
        }
    }
}
