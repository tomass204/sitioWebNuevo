package com.example.Usuarios.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Usuarios.model.Usuario;

@Repository 
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {

   

    Optional<Usuario> findByEmailAndContrasenaAndActivoTrue(String email, String contrasena);

   Optional<Usuario> findByEmailAndActivoTrue(String email);
   Optional<Usuario> findFirstByEmailAndActivoTrue(String email);

    List<Usuario> findByRol(String rol);
    Optional<Usuario> findFirstByRol(String rol);




}
