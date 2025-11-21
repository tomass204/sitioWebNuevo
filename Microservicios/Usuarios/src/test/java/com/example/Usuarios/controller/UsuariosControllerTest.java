package com.example.Usuarios.controller;

import com.example.Usuarios.model.Usuario;
import com.example.Usuarios.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.example.Usuarios.Config.SecurityConfig;

@WebMvcTest(UsuarioController.class)
@AutoConfigureMockMvc(addFilters = true)
@WithMockUser(roles = "ADMIN")
class UsuariosControllerTest {

    @MockBean
    private UsuarioService service;

    @Autowired
    private MockMvc mockMvc;

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll()
                );
            return http.build();
        }
    }

    @Test
    void iniciarSession() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setContrasena("password");
        usuario.setRol("usuario");
        usuario.setActivo(true);

        when(service.iniciarSession(eq("john@example.com"), eq("password"))).thenReturn(usuario);

        try {
            mockMvc.perform(post("/api/GamingHub/v1/Usuario/iniciar-session")
                    .param("email", "john@example.com")
                    .param("contrasena", "password"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuarioID").value(1L))
                .andExpect(jsonPath("$.email").value("john@example.com"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void crearUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setContrasena("password");
        usuario.setRol("usuario");
        usuario.setActivo(true);

        when(service.crear(anyMap())).thenReturn(usuario);

        String json = "{\n" +
                "  \"nombre\": \"John\",\n" +
                "  \"email\": \"john@example.com\",\n" +
                "  \"rol\": \"usuario\",\n" +
                "  \"contrasena\": \"password\"\n" +
                "}";

        try {
            mockMvc.perform(post("/api/GamingHub/v1/Usuario")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuarioID").value(1L))
                .andExpect(jsonPath("$.email").value("john@example.com"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void editarUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setContrasena("password");
        usuario.setRol("usuario");
        usuario.setActivo(true);

        when(service.editar(anyMap(), eq(1L))).thenReturn(usuario);

        String json = "{\n" +
                "  \"nombreUsuario\": \"John\",\n" +
                "  \"email\": \"john@example.com\",\n" +
                "  \"rol\": \"usuario\",\n" +
                "  \"contrasena\": \"newpassword\"\n" +
                "}";

        try {
            mockMvc.perform(put("/api/GamingHub/v1/Usuario/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuarioID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void activarUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setContrasena("password");
        usuario.setRol("usuario");
        usuario.setActivo(true);

        when(service.activar(1L)).thenReturn(usuario);

        try {
            mockMvc.perform(patch("/api/GamingHub/v1/Usuario/cambiar-estado/1")
                    .param("activar", "true")
                    .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activo").value(true));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void desactivarUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setContrasena("password");
        usuario.setRol("usuario");
        usuario.setActivo(false);

        when(service.desactivar(1L)).thenReturn(usuario);

        try {
            mockMvc.perform(patch("/api/GamingHub/v1/Usuario/cambiar-estado/1")
                    .param("activar", "false")
                    .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activo").value(false));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void verUsuario() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setContrasena("password");
        usuario.setRol("usuario");
        usuario.setActivo(true);

        when(service.ver(1L)).thenReturn(usuario);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Usuario/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuarioID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void buscarPorRol() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setContrasena("password");
        usuario.setRol("usuario");
        usuario.setActivo(true);

        when(service.buscarPorRol("usuario")).thenReturn(usuario);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Usuario/buscar-por-rol/usuario"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuarioID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    void listarPorRol() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuarioID(1L);
        usuario.setNombre("John");
        usuario.setEmail("john@example.com");
        usuario.setContrasena("password");
        usuario.setRol("usuario");
        usuario.setActivo(true);

        List<Usuario> usuarios = List.of(usuario);

        when(service.listarPorRol("usuario")).thenReturn(usuarios);

        try {
            mockMvc.perform(get("/api/GamingHub/v1/Usuario/listar-por-rol/usuario"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$._embedded.usuarioList[0].usuarioID").value(1L));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
