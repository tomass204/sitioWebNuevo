const API_BASE_URL = 'http://localhost:8084';

class ModerationAPI {
    static async getAllReports() {
        const response = await fetch(`${API_BASE_URL}/reportes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get reports');
        }
        return response.json();
    }

    static async createReport(reportData) {
        const response = await fetch(`${API_BASE_URL}/reportes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(reportData),
        });
        if (!response.ok) {
            throw new Error('Failed to create report');
        }
        return response.json();
    }

    static async getReportById(reportId) {
        const response = await fetch(`${API_BASE_URL}/reportes/${reportId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to get report');
        }
        return response.json();
    }

    static async updateReport(reportId, reportData) {
        const response = await fetch(`${API_BASE_URL}/reportes/${reportId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(reportData),
        });
        if (!response.ok) {
            throw new Error('Failed to update report');
        }
        return response.json();
    }

    static async deleteReport(reportId) {
        const response = await fetch(`${API_BASE_URL}/reportes/${reportId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete report');
        }
        return response.json();
    }
}
