package com.example.Debate.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Debate.model.Debate;
import com.example.Debate.repository.DebateRepository;
import com.example.Debate.webclient.DebateWebClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DebateService {

    @Autowired
    private DebateRepository repository;

    @Autowired
    private DebateWebClient debateWebClient;

    public List<Debate> listarDebatesActivos() {
        return repository.findByActivoTrue();
    }

    public Debate verDebate(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Debate no encontrado."));
    }

    public Debate crearDebate(Map<String, Object> debateData) {
        Long creadorID = (Long) debateData.get("creadorID");
        // Validate user exists
        Map<String, Object> usuario = debateWebClient.getUsuarioRole(creadorID);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado.");
        }

        Debate debate = new Debate();
        debate.setTitulo((String) debateData.get("titulo"));
        debate.setDescripcion((String) debateData.get("descripcion"));
        debate.setCreadorID(creadorID);
        debate.setTipo((String) debateData.get("tipo"));
        Debate saved = repository.save(debate);

        // Send notification
        debateWebClient.sendNotification(creadorID, "Tu debate ha sido creado.");

        return saved;
    }

    public Debate cerrarDebate(Long id) {
        Debate debate = verDebate(id);
        debate.setCerrado(true);
        return repository.save(debate);
    }

    public void eliminarDebate(Long id) {
        repository.deleteById(id);
    }
}
