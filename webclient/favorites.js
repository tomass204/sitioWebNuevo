const API_BASE_URL = 'http://localhost:8085';

class FavoritesAPI {
    static async getFavoritesByUser(userId) {
        const response = await fetch(`${API_BASE_URL}/favoritos/usuario/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get favorites');
        }
        return response.json();
    }

    static async addFavorite(favoriteData) {
        const response = await fetch(`${API_BASE_URL}/favoritos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(favoriteData),
        });
        if (!response.ok) {
            throw new Error('Failed to add favorite');
        }
        return response.json();
    }

    static async removeFavorite(favoriteId) {
        const response = await fetch(`${API_BASE_URL}/favoritos/${favoriteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to remove favorite');
        }
        return response.json();
    }
}
