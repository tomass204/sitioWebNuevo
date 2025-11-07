const API_BASE_URL = 'http://localhost:8082';

class ReactionsAPI {
    static async getReactionsByPublication(publicationId) {
        const response = await fetch(`${API_BASE_URL}/reacciones/publicacion/${publicationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get reactions');
        }
        return response.json();
    }

    static async createReaction(reactionData) {
        const response = await fetch(`${API_BASE_URL}/reacciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(reactionData),
        });
        if (!response.ok) {
            throw new Error('Failed to create reaction');
        }
        return response.json();
    }

    static async updateReaction(reactionId, reactionData) {
        const response = await fetch(`${API_BASE_URL}/reacciones/${reactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(reactionData),
        });
        if (!response.ok) {
            throw new Error('Failed to update reaction');
        }
        return response.json();
    }

    static async deleteReaction(reactionId) {
        const response = await fetch(`${API_BASE_URL}/reacciones/${reactionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete reaction');
        }
        return response.json();
    }
}
