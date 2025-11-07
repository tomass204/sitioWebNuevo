package com.example.Usuarios.service;

import java.util.Map;
import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Usuarios.model.Usuario;
import com.example.Usuarios.repository.UsuarioRepository;
import com.example.Usuarios.security.PasswordManager;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordManager passwordManager;

    public Usuario iniciarSession(String email, String contrasena) {
        Optional<Usuario> usuarioOptional = repository.findFirstByEmailAndActivoTrue(email);
        if (!usuarioOptional.isPresent()) {
            throw new RuntimeException("Error al iniciar session.");
        }

        Usuario usuario = usuarioOptional.get();

        if (!passwordManager.verificarPassword(contrasena, usuario.getContrasena())) {
            throw new RuntimeException("Error al iniciar session.");
        }

        return usuario;
    }

    public Usuario crear(Map<String, Object> map_usuario) {
        String email = String.valueOf(map_usuario.get("email"));

        // Validar si ya existe un usuario con ese email
        if (repository.findFirstByEmailAndActivoTrue(email).isPresent()) {
            throw new RuntimeException("Ya existe un usuario con ese email: " + email);
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(String.valueOf(map_usuario.get("nombre")));
        usuario.setEmail(email);
        usuario.setRol(String.valueOf(map_usuario.get("rol")));
        String contrasena = String.valueOf(map_usuario.get("contrasena"));
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
        usuario.setNombre(String.valueOf(map_usuario.get("nombreUsuario")));
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
}