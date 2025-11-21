package com.example.Noticias.Publicaciones.service;

import com.example.Noticias.Publicaciones.model.Publicacion;
import com.example.Noticias.Publicaciones.repository.PublicacionRepository;
import com.example.Noticias.Publicaciones.webclient.PublicacionWebClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PublicacionService {

    @Autowired
    private PublicacionRepository repository;

    @Autowired
    private PublicacionWebClient webClient;

    public List<Publicacion> listarTodas() {
        List<Publicacion> publicaciones = repository.findAll();
        for (Publicacion pub : publicaciones) {
            pub.setLikesCount(webClient.getLikesCount(pub.getPublicacionID()));
            pub.setComentariosCount(webClient.getComentariosCount(pub.getPublicacionID()));
            try{
                pub.setAutor(webClient.getUsuarioById(pub.getAutorID()).get("nombre").toString());
            }catch(Exception ex){
                pub.setAutor("GamimngHub");
            }
            pub.setImagenes(webClient.getImagenesPorPublicacionId(pub.getPublicacionID(), "Publicacion"));
        }
        return publicaciones;
    }

    public Publicacion verPublicacion(Long id) {
        Optional<Publicacion> publicacionOptional = repository.findById(id);
        if (!publicacionOptional.isPresent()) {
            throw new RuntimeException("Publicación no encontrada.");
        }
        Publicacion publicacion=publicacionOptional.get();
        try{
            publicacion.setAutor(webClient.getUsuarioById(publicacion.getAutorID()).get("nombre").toString());
        }catch(Exception ex){
            publicacion.setAutor("GamimngHub");
        }
        publicacion.setImagenes(webClient.getImagenesPorPublicacionId(publicacion.getPublicacionID(), "Publicacion"));
        return publicacion;

    }

    public Publicacion crearPublicacion(Map<String, Object> data, List<MultipartFile> archivos) {
        String titulo = (String) data.get("titulo");
        String contenido = (String) data.get("contenido");
        String tipo = (String) data.get("tipo");
        Long autorID = ((Number) data.get("autorID")).longValue();

        if (!webClient.existeUsuario(autorID)) {
            throw new IllegalArgumentException("El autor con ID " + autorID + " no existe.");
        }

        Publicacion publicacion = new Publicacion();
        publicacion.setTitulo(titulo);
        publicacion.setContenido(contenido);
        publicacion.setTipo(tipo);
        publicacion.setAutorID(autorID);
        publicacion.setFechaCreacion(LocalDateTime.now());
        publicacion= repository.save(publicacion);

        try{
            webClient.subirImagenes(publicacion.getPublicacionID(), archivos);
        }catch (Exception ex){
            System.out.println("Error al subir imagenes: "+ex);
        }
        return publicacion;
    }

    public Publicacion editarPublicacion(Map<String, Object> data, Long id) {
        Publicacion p = verPublicacion(id);
        if (data.containsKey("titulo")) p.setTitulo((String) data.get("titulo"));
        if (data.containsKey("contenido")) p.setContenido((String) data.get("contenido"));
        if (data.containsKey("tipo")) p.setTipo((String) data.get("tipo"));
        return repository.save(p);
    }

    public void eliminarPublicacion(Long id) {
        verPublicacion(id);
        repository.deleteById(id);
    }

    public Publicacion destacarPublicacion(Long id) {
        Publicacion p = verPublicacion(id);
        p.setDestacada(true);
        return repository.save(p);
    }
}
