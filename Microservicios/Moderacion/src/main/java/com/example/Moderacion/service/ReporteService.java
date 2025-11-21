package com.example.Moderacion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Moderacion.model.Reporte;
import com.example.Moderacion.repository.ReporteRepository;
import com.example.Moderacion.webclient.ModeracionWebClient;

import java.util.List;
import java.util.Map;

@Service
public class ReporteService {

    @Autowired
    private ReporteRepository repository;

    @Autowired
    private ModeracionWebClient moderacionWebClient;

    public Reporte crearReporte(Map<String, Object> reporteData) {
        Long usuarioReportadorID = (Long) reporteData.get("usuarioReportadorID");

        // Validate user exists
        Map<String, Object> usuario = moderacionWebClient.getUsuario(usuarioReportadorID);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado.");
        }

        Reporte reporte = new Reporte();
        reporte.setTipoEntidad((String) reporteData.get("tipoEntidad"));
        reporte.setEntidadID((Long) reporteData.get("entidadID"));
        reporte.setUsuarioReportadorID(usuarioReportadorID);
        reporte.setMotivo((String) reporteData.get("motivo"));
        return repository.save(reporte);
    }

    public List<Reporte> listarReportesPorEstado(String estado) {
        return repository.findByEstado(estado);
    }

    public Reporte verReporte(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Reporte no encontrado."));
    }

    public void aplicarAccion(Long id, String accion) {
        Reporte reporte = verReporte(id);
        reporte.setAccionTomada(accion);
        reporte.setEstado("revisado");
        repository.save(reporte);
    }
}
