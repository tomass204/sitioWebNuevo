package com.example.Usuarios.security;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class PasswordManager {

        public String encriptarPassword(String password){
        return BCrypt.hashpw(password, BCrypt.gensalt(12));
        
    }

    public boolean verificarPassword(String password, String encryptedPassword) {
        return BCrypt.checkpw(password, encryptedPassword);
    }



}
