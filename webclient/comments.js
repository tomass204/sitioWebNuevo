const API_BASE_URL = 'http://localhost:8087';

class CommentsAPI {
    static async getCommentsByPublication(publicationId) {
        const response = await fetch(`${API_BASE_URL}/comentarios/publicacion/${publicationId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get comments');
        }
        return response.json();
    }

    static async createComment(commentData) {
        const response = await fetch(`${API_BASE_URL}/comentarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(commentData),
        });
        if (!response.ok) {
            throw new Error('Failed to create comment');
        }
        return response.json();
    }

    static async updateComment(commentId, commentData) {
        const response = await fetch(`${API_BASE_URL}/comentarios/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(commentData),
        });
        if (!response.ok) {
            throw new Error('Failed to update comment');
        }
        return response.json();
    }

    static async deleteComment(commentId) {
        const response = await fetch(`${API_BASE_URL}/comentarios/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
        return response.json();
    }
}
