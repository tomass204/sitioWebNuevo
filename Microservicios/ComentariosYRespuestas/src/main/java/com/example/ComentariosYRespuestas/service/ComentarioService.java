package com.example.ComentariosYRespuestas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ComentariosYRespuestas.model.Comentario;
import com.example.ComentariosYRespuestas.repository.ComentarioRepository;
import com.example.ComentariosYRespuestas.webclient.ComentarioWebClient;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository repository;

    @Autowired
    private ComentarioWebClient comentarioWebClient;

    public List<Comentario> listarComentariosPorPublicacion(Long publicacionID) {
        List<Comentario> comentarios = repository.findByPublicacionID(publicacionID);
        for (Comentario comentario : comentarios) {
            comentario.setLikesCount(comentarioWebClient.contarReaccionesPorComentario(comentario.getComentarioID()));
            comentario.setAutorNombre(comentarioWebClient.getUsuarioById(comentario.getAutorID()).get("nombre").toString());
        }
        return comentarios;
    }

public Comentario crearComentario(Map<String, Object> comentarioData) {
    Long autorID,publicacionID;
    String comentarioNuevo;
    try{
        autorID=Long.valueOf(String.valueOf(comentarioData.get("autorID")));
        publicacionID=Long.valueOf(String.valueOf(comentarioData.get("publicacionID")));
        comentarioNuevo=String.valueOf(comentarioData.get("contenido"));
    }catch (Exception ex){
        throw new RuntimeException("Error en los datos de entrada");
    }

    // Validar existencia de la publicación
    if (!comentarioWebClient.existePublicacion(publicacionID)) {
        throw new RuntimeException("La publicación con ID " + publicacionID + " no existe.");
    }

    Comentario comentario = new Comentario();
    comentario.setContenido(comentarioNuevo);
    comentario.setAutorID(autorID);
    comentario.setPublicacionID(publicacionID);

    return repository.save(comentario);
}

    public Comentario editarComentario(Map<String, Object> comentarioData, Long id) {
        Comentario comentario = verComentario(id);
        comentario.setContenido((String) comentarioData.get("contenido"));
        return repository.save(comentario);
    }

    public void eliminarComentario(Long id) {
        repository.deleteById(id);
    }

    public Comentario verComentario(Long id) {
        Comentario comentario = repository.findById(id).orElseThrow(() -> new RuntimeException("Comentario no encontrado."));
        comentario.setLikesCount(comentarioWebClient.contarReaccionesPorComentario(comentario.getComentarioID()));
        comentario.setAutorNombre(comentarioWebClient.getUsuarioById(comentario.getAutorID()).get("nombre").toString());
        return comentario;
    }

    public Long contarComentariosPorPublicacion(Long publicacionID) {
        return repository.countByPublicacionID(publicacionID);
    }
}
