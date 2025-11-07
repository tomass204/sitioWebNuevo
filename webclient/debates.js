const API_BASE_URL = 'http://localhost:8086';

class DebatesAPI {
    static async getAllDebates() {
        const response = await fetch(`${API_BASE_URL}/debates`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get debates');
        }
        return response.json();
    }

    static async createDebate(debateData) {
        const response = await fetch(`${API_BASE_URL}/debates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(debateData),
        });
        if (!response.ok) {
            throw new Error('Failed to create debate');
        }
        return response.json();
    }

    static async getDebateById(debateId) {
        const response = await fetch(`${API_BASE_URL}/debates/${debateId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get debate');
        }
        return response.json();
    }

    static async updateDebate(debateId, debateData) {
        const response = await fetch(`${API_BASE_URL}/debates/${debateId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(debateData),
        });
        if (!response.ok) {
            throw new Error('Failed to update debate');
        }
        return response.json();
    }

    static async deleteDebate(debateId) {
        const response = await fetch(`${API_BASE_URL}/debates/${debateId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete debate');
        }
        return response.json();
    }
}
