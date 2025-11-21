package com.example.Usuarios.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;

import com.example.Usuarios.controller.UsuarioController;
import com.example.Usuarios.webclient.MailWebClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.stereotype.Service;

import com.example.Usuarios.model.Usuario;
import com.example.Usuarios.repository.UsuarioRepository;
import com.example.Usuarios.security.PasswordManager;
import org.springframework.web.bind.annotation.RequestParam;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordManager passwordManager;

    @Autowired
    private MailWebClient mailWebClient;


    public Usuario iniciarSession(String email, String contrasena) {
        Optional<Usuario> usuarioOptional = repository.findFirstByEmailAndActivoTrue(email);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("Error al iniciar session.");
        }

        Usuario usuario = usuarioOptional.get();

        if (!passwordManager.verificarPassword(contrasena, usuario.getContrasena())) {
            if(usuario.getContrasenaTemporalUsada()==null ||  !passwordManager.verificarPassword(contrasena, usuario.getContrasenaTemporal())){
                throw new RuntimeException("Error al iniciar session.");
            }
            if (usuario.getContrasenaTemporalUsada() != null && usuario.getContrasenaTemporalUsada()
                    || usuario.getExpiracionContrasenaTemporal() != null && usuario.getExpiracionContrasenaTemporal().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Error al iniciar sesión.");
            }
            usuario.setContrasena(passwordManager.encriptarPassword(contrasena));
            usuario.setContrasenaTemporalUsada(true);
            return repository.save(usuario);
        }

        return usuario;
    }

    public Usuario crear(Map<String, Object> map_usuario) {
        String email = String.valueOf(map_usuario.get("email")).trim();

        // Validar si el email está vacío o nulo
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico no puede estar vacío.");
        }

        // Validar formato de correo
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("El correo electrónico no tiene un formato válido.");
        }

        // Validar si ya existe un usuario activo con ese email
        if (repository.findFirstByEmailAndActivoTrue(email).isPresent()) {
            throw new IllegalArgumentException("Ya existe un usuario activo con ese email: " + email);
        }

        // Crear y asignar valores al usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(String.valueOf(map_usuario.get("nombre")));
        usuario.setEmail(email);
        usuario.setRol(String.valueOf(map_usuario.get("rol")));

        String contrasena = String.valueOf(map_usuario.get("contrasena"));
        if (contrasena == null || contrasena.isEmpty()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía.");
        }

        usuario.setContrasena(passwordManager.encriptarPassword(contrasena));
        usuario.setActivo(true);

        return repository.save(usuario);
    }


    public Usuario editar(Map<String, Object> map_usuario, Long usuarioID) {
        Optional<Usuario> usuarioOptional = repository.findById(usuarioID);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("No existe el usuario.");
        }
        Usuario usuario = usuarioOptional.get();
        usuario.setNombre(String.valueOf(map_usuario.get("nombre")));
        usuario.setEmail(String.valueOf(map_usuario.get("email")));
        usuario.setRol(String.valueOf(map_usuario.get("rol")));
        String contrasena = String.valueOf(map_usuario.get("contrasena"));
        if (contrasena != null && !contrasena.isEmpty()) {
            usuario.setContrasena(passwordManager.encriptarPassword(contrasena));
        }
        return repository.save(usuario);
    }

    public Usuario ver(Long usuarioID) {
        Optional<Usuario> usuarioOptional = repository.findById(usuarioID);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("No existe el usuario.");
        }
        return usuarioOptional.get();
    }

    public Usuario verPorEmail(String email) {
        Optional<Usuario> usuarioOptional = repository.findFirstByEmailAndActivoTrue(email);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("No existe el usuario.");
        }
        return usuarioOptional.get();
    }

    public Usuario activar(Long usuarioID) {
        Optional<Usuario> usuarioOptional = repository.findById(usuarioID);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("No existe el usuario.");
        }
        Usuario usuario = usuarioOptional.get();
        usuario.setActivo(true);
        return repository.save(usuario);
    }

    public Usuario desactivar(Long usuarioID) {
        Optional<Usuario> usuarioOptional = repository.findById(usuarioID);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("No existe el usuario.");
        }
        Usuario usuario = usuarioOptional.get();
        usuario.setActivo(false);
        return repository.save(usuario);
    }

    public Usuario buscarPorRol(String rol) {
        return repository.findFirstByRol(rol)
                .orElseThrow(() -> new RuntimeException("No se encontró usuario con el rol: " + rol));
    }

    public List<Usuario> listarPorRol(String rol) {
        return repository.findByRol(rol);
    }

    public Usuario cambiarRol(Long usuarioID, String nuevoRol) {
        Optional<Usuario> usuarioOptional = repository.findById(usuarioID);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("No existe el usuario.");
        }
        Usuario usuario = usuarioOptional.get();
        usuario.setRol(nuevoRol);
        return repository.save(usuario);
    }


    public Usuario cambiarContrasena(String nuevaContrasena, Long usuarioID) {
        Optional<Usuario> usuarioOptional = repository.findById(usuarioID);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("No existe el usuario.");
        }
        Usuario usuario = usuarioOptional.get();
        usuario.setContrasena(passwordManager.encriptarPassword(nuevaContrasena));
        return repository.save(usuario);
    }


    public Usuario recuperarContrasena(String email) {


        // Validar si el email está vacío o nulo
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("El correo electrónico no puede estar vacío.");
        }

        // Validar formato de correo
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("El correo electrónico no tiene un formato válido.");
        }


        Optional<Usuario> usuarioOptional = repository.findByEmailAndActivoTrue(email);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("No existe el usuario.");
        }
        Usuario usuario = usuarioOptional.get();
        String contrasenaTemporal=generarCodigo();
        usuario.setContrasenaTemporal(passwordManager.encriptarPassword(contrasenaTemporal));
        usuario.setExpiracionContrasenaTemporal(LocalDateTime.now().plusHours(1));
        usuario.setContrasenaTemporalUsada(false);
        usuario = repository.save(usuario);
        usuario.setContrasena(null);
        usuario.setContrasenaTemporal(null);

        Map<String,Object> mailMap= new HashMap<>();
        mailMap.put("to", usuario.getEmail());
        mailMap.put("subject", "Recuperación de contraseña - GamingHub");
        mailMap.put("content", getCorreoRecuperacion(usuario.getNombre(), contrasenaTemporal));
        mailWebClient.enviarCorreo(mailMap);
        return usuario;
    }


    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom random = new SecureRandom();

    private String generarCodigo() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }
        return sb.toString();
    }


    public String getCorreoRecuperacion(String usuario, String password) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html>")
                .append("<body style='font-family:Arial,sans-serif;'>")
                .append("<h2>Recuperación de contraseña - GamingHub</h2>")
                .append("<p>Estimad@ <strong>").append(usuario).append("</strong>,</p>")
                .append("<p>Su nueva contraseña es:</p>")
                .append("<p style='font-size:18px;font-weight:bold;color:#0ea5a3;'>")
                .append(password)
                .append("</p>")
                .append("<p>Por favor cámbiela después de iniciar sesión para mayor seguridad.</p>")
                .append("<hr>")
                .append("<p style='font-size:12px;color:#777;'>Este correo fue enviado automáticamente por GamingHub. No responda a este mensaje.</p>")
                .append("</body>")
                .append("</html>");
        return sb.toString();
    }


}