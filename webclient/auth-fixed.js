class AuthAPI {
    static async login(credentials) {
        // Usar solo localStorage para autenticación
        const users = JSON.parse(localStorage.getItem('gaminghub_users')) || {
            'basic@gaminghub.com': { password: 'pass', role: 'UsuarioBasico', warnings: 0, profilePic: 'img/UsuarioBasico.png', username: 'UsuarioBasico' },
            'influencer@gaminghub.com': { password: 'pass', role: 'Influencer', warnings: 0, profilePic: 'img/Influencer.png', username: 'Influencer' },
            'moderator@gaminghub.com': { password: 'pass', role: 'Moderador', warnings: 0, profilePic: 'img/Moderador.png', username: 'Moderador' },
            'tomasgarrido512@gmail.com': { password: '12345', role: 'Propietario', warnings: 0, profilePic: 'img/Propietario.png', username: 'Propietario' }
        };

        const user = users[credentials.email];
        if (!user || user.password !== credentials.password) {
            throw new Error('Credenciales incorrectas');
        }

        return {
            content: {
                email: credentials.email,
                nombre: user.username,
                rol: user.role,
                token: 'local_token_' + Date.now()
            }
        };
    }

    static async register(userData) {
        const users = JSON.parse(localStorage.getItem('gaminghub_users')) || {
            'basic@gaminghub.com': { password: 'pass', role: 'UsuarioBasico', warnings: 0, profilePic: 'img/UsuarioBasico.png', username: 'UsuarioBasico' },
            'influencer@gaminghub.com': { password: 'pass', role: 'Influencer', warnings: 0, profilePic: 'img/Influencer.png', username: 'Influencer' },
            'moderator@gaminghub.com': { password: 'pass', role: 'Moderador', warnings: 0, profilePic: 'img/Moderador.png', username: 'Moderador' },
            'tomasgarrido512@gmail.com': { password: '12345', role: 'Propietario', warnings: 0, profilePic: 'img/Propietario.png', username: 'Propietario' }
        };

        // Verificar si el usuario ya existe
        if (users[userData.email]) {
            throw new Error('El usuario ya existe');
        }

        // Crear nuevo usuario
        users[userData.email] = {
            password: userData.contrasena,
            role: userData.rol,
            username: userData.nombre,
            warnings: 0,
            profilePic: 'img/UsuarioBasico.png',
            activo: true
        };

        // Guardar en localStorage
        localStorage.setItem('gaminghub_users', JSON.stringify(users));

        return {
            content: {
                email: userData.email,
                nombre: userData.nombre,
                rol: userData.rol,
                token: 'local_token_' + Date.now()
            }
        };
    }

    static async getProfile(userId) {
        // Simular perfil local
        const mockProfile = {
            id: userId,
            nombre: "Usuario GamingHub",
            email: "user@gaminghub.com",
            rol: "UsuarioBasico",
            fechaRegistro: new Date().toISOString(),
            profilePic: "img/UsuarioBasico.png",
            warnings: 0,
            activo: true
        };

        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return { content: mockProfile };
    }

    static async updateProfile(userId, userData) {
        // Simular actualización local
        const updatedProfile = {
            id: userId,
            nombre: userData.nombre || "Usuario GamingHub",
            email: userData.email || "user@gaminghub.com",
            rol: userData.rol || "UsuarioBasico",
            fechaRegistro: new Date().toISOString(),
            profilePic: userData.profilePic || "img/UsuarioBasico.png",
            warnings: 0,
            activo: true
        };

        // Simular delay
        await new Promise(resolve => setTimeout(resolve, 150));
        return { content: updatedProfile };
    }

    // Método para crear usuarios de prueba
    static async createTestUsers() {
        const testUsers = [
            {
                nombre: 'Usuario Básico',
                email: 'basic@gaminghub.com',
                contrasena: 'pass',
                rol: 'UsuarioBasico'
            },
            {
                nombre: 'Influencer',
                email: 'influencer@gaminghub.com',
                contrasena: 'pass',
                rol: 'Influencer'
            },
            {
                nombre: 'Moderador',
                email: 'moderator@gaminghub.com',
                contrasena: 'pass',
                rol: 'Moderador'
            }
        ];

        const results = [];
        for (const user of testUsers) {
            try {
                await this.register(user);
                results.push(`✅ ${user.email}: Creado exitosamente`);
            } catch (error) {
                results.push(`❌ ${user.email}: ${error.message}`);
            }
        }
        return results;
    }
}
