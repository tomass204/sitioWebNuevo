const API_BASE_URL = 'http://localhost:8081';

class AuthAPI {
    static async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario/iniciar-session?email=${credentials.email}&contrasena=${credentials.password}`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    }

    static async register(userData) {
        const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.json();
    }

    static async getProfile(userId) {
        const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario/${userId}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Failed to get profile');
        }
        return response.json();
    }

    static async updateProfile(userId, userData) {
        const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    }
}
