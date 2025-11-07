package com.example.ComentariosYRespuestas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ComentariosYRespuestas.model.Comentario;
import com.example.ComentariosYRespuestas.repository.ComentarioRepository;
import com.example.ComentariosYRespuestas.webclient.ComentarioWebClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository repository;

    @Autowired
    private ComentarioWebClient comentarioWebClient;

    public List<Comentario> listarComentariosPorPublicacion(Long publicacionID) {
        return repository.findByPublicacionID(publicacionID);
    }

    public Comentario crearComentario(Map<String, Object> comentarioData) {
        String autorEmail = (String) comentarioData.get("autor");
        // Validate user exists
        // Map<String, Object> usuario = comentarioWebClient.getUsuarioByEmail(autorEmail);
        // if (usuario == null) {
        //     throw new RuntimeException("Usuario no encontrado.");
        // }

        // Long autorID = (Long) usuario.get("id");
        Long autorID = 1L; // dummy for testing

        Comentario comentario = new Comentario();
        comentario.setContenido((String) comentarioData.get("texto"));
        comentario.setAutorID(autorID);
        comentario.setPublicacionID((Long) comentarioData.get("publicacionId"));
        Comentario saved = repository.save(comentario);

        // Send notification (assuming there's a way to get the publication author)
        // For simplicity, send to the comment author or something
        // comentarioWebClient.sendNotification(autorID, "Tu comentario ha sido creado.");

        return saved;
    }

    public Comentario editarComentario(Map<String, Object> comentarioData, Long id) {
        Comentario comentario = verComentario(id);
        comentario.setContenido((String) comentarioData.get("texto"));
        return repository.save(comentario);
    }

    public void eliminarComentario(Long id) {
        repository.deleteById(id);
    }

    public Comentario verComentario(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Comentario no encontrado."));
    }
}
