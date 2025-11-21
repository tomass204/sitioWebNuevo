package com.example.Usuarios.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Usuarios.model.Usuario;
import com.example.Usuarios.repository.UsuarioRepository;
import com.example.Usuarios.security.PasswordManager;

@ExtendWith(MockitoExtension.class)
public class UsuariosServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordManager passwordManager;

    @InjectMocks
    private UsuarioService service;

    @Test
    void iniciarSession() {
        String email = "john@example.com";
        String contrasena = "password";

        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setEmail(email);
        usuario.setContrasena("encryptedPassword");
        usuario.setActivo(true);

        when(repository.findFirstByEmailAndActivoTrue(email)).thenReturn(Optional.of(usuario));
        when(passwordManager.verificarPassword(contrasena, "encryptedPassword")).thenReturn(true);

        Usuario result = service.iniciarSession(email, contrasena);

        assertNotNull(result);
        assertEquals(usuario.getUsuarioID(), result.getUsuarioID());
        assertEquals(usuario.getEmail(), result.getEmail());
        assertEquals(usuario.getContrasena(), result.getContrasena());
        assertEquals(usuario.getActivo(), result.getActivo());
    }

    @Test
    void crearUsuario() {
        Map<String, Object> mapUsuario = new HashMap<>();
        mapUsuario.put("nombre", "John");
        mapUsuario.put("email", "john@example.com");
        mapUsuario.put("rol", "usuario");
        mapUsuario.put("contrasena", "password");

        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setRol("usuario");
        usuario.setContrasena("password");
        usuario.setActivo(true);

        when(passwordManager.encriptarPassword("password")).thenReturn("password");
        when(repository.save(ArgumentMatchers.any(Usuario.class))).thenReturn(usuario);

        Usuario result = service.crear(mapUsuario);

        assertNotNull(result);
        assertEquals(usuario.getUsuarioID(), result.getUsuarioID());
        assertEquals(usuario.getNombre(), result.getNombre());
        assertEquals(usuario.getEmail(), result.getEmail());
        assertEquals(usuario.getRol(), result.getRol());
        assertEquals(usuario.getContrasena(), result.getContrasena());
        assertEquals(usuario.getActivo(), result.getActivo());
    }

    @Test
    void editarUsuario() {
        Map<String, Object> mapUsuario = new HashMap<>();
        mapUsuario.put("nombreUsuario", "John");
        mapUsuario.put("email", "john@example.com");
        mapUsuario.put("rol", "usuario");
        mapUsuario.put("contrasena", "password");

        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setRol("usuario");
        usuario.setContrasena("password");
        usuario.setActivo(true);

        when(passwordManager.encriptarPassword("password")).thenReturn("password");
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        when(repository.save(ArgumentMatchers.any(Usuario.class))).thenReturn(usuario);

        Usuario result = service.editar(mapUsuario, 1L);

        assertNotNull(result);
        assertEquals(usuario.getUsuarioID(), result.getUsuarioID());
        assertEquals(usuario.getNombre(), result.getNombre());
        assertEquals(usuario.getEmail(), result.getEmail());
        assertEquals(usuario.getRol(), result.getRol());
        assertEquals(usuario.getContrasena(), result.getContrasena());
        assertEquals(usuario.getActivo(), result.getActivo());
    }

    @Test
    void verUsuario() {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setRol("usuario");
        usuario.setContrasena("password");
        usuario.setActivo(true);

        when(repository.findById(1L)).thenReturn(Optional.of(usuario));

        Usuario result = service.ver(1L);

        assertNotNull(result);
        assertEquals(usuario.getUsuarioID(), result.getUsuarioID());
        assertEquals(usuario.getNombre(), result.getNombre());
        assertEquals(usuario.getEmail(), result.getEmail());
        assertEquals(usuario.getRol(), result.getRol());
        assertEquals(usuario.getContrasena(), result.getContrasena());
        assertEquals(usuario.getActivo(), result.getActivo());
    }

    @Test
    void verPorEmailUsuario() {
        String email = "notfound@example.com";

        when(repository.findFirstByEmailAndActivoTrue(email)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            service.verPorEmail(email);
        });
    }

    @Test
    void activarUsuario() {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setActivo(true);

        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        when(repository.save(ArgumentMatchers.any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario result = service.activar(1L);

        assertNotNull(result);
        assertEquals(1L, result.getUsuarioID());
        assertEquals(true, result.getActivo());
    }

    @Test
    void desactivarUsuario() {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setActivo(false);

        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        when(repository.save(ArgumentMatchers.any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario result = service.desactivar(1L);

        assertNotNull(result);
        assertEquals(1L, result.getUsuarioID());
        assertEquals(false, result.getActivo());
    }

    @Test
    void buscarPorRol() {
        String rol = "usuario";

        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setRol(rol);
        usuario.setContrasena("password");
        usuario.setActivo(true);

        when(repository.findFirstByRol(rol)).thenReturn(Optional.of(usuario));

        Usuario result = service.buscarPorRol(rol);

        assertNotNull(result);
        assertEquals(usuario.getUsuarioID(), result.getUsuarioID());
        assertEquals(usuario.getNombre(), result.getNombre());
        assertEquals(usuario.getEmail(), result.getEmail());
        assertEquals(usuario.getRol(), result.getRol());
        assertEquals(usuario.getContrasena(), result.getContrasena());
        assertEquals(usuario.getActivo(), result.getActivo());
    }

    @Test
    void listarPorRol() {
        String rol = "usuario";

        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setRol(rol);
        usuario.setContrasena("password");
        usuario.setActivo(true);

        List<Usuario> usuarios = List.of(usuario);

        when(repository.findByRol(rol)).thenReturn(usuarios);

        List<Usuario> result = service.listarPorRol(rol);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(usuario.getUsuarioID(), result.get(0).getUsuarioID());
        assertEquals(usuario.getNombre(), result.get(0).getNombre());
        assertEquals(usuario.getEmail(), result.get(0).getEmail());
        assertEquals(usuario.getRol(), result.get(0).getRol());
        assertEquals(usuario.getContrasena(), result.get(0).getContrasena());
        assertEquals(usuario.getActivo(), result.get(0).getActivo());
    }
}
