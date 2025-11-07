class NewsAPI {
    static async getAllNews() {
        // Datos locales simulados para noticias
        const mockNews = [
            {
                id: 1,
                titulo: "GamingHub: La nueva era del gaming",
                contenido: "Bienvenidos a GamingHub, tu comunidad definitiva para gamers. Aquí encontrarás las últimas noticias, reseñas y debates sobre el mundo del gaming.",
                fechaPublicacion: new Date().toISOString(),
                autor: "Sistema",
                categoria: "Noticias",
                imagen: "img/gaming-default.jpg"
            },
            {
                id: 2,
                titulo: "Mejores juegos de 2024",
                contenido: "Descubre los títulos más esperados de este año. Desde RPGs épicos hasta shooters intensos, te presentamos lo mejor del gaming actual.",
                fechaPublicacion: new Date().toISOString(),
                autor: "Sistema",
                categoria: "Reseñas",
                imagen: "img/games-2024.jpg"
            },
            {
                id: 3,
                titulo: "Consejos para nuevos jugadores",
                contenido: "Guía completa para principiantes en el mundo del gaming. Aprende los conceptos básicos y cómo mejorar tu experiencia de juego.",
                fechaPublicacion: new Date().toISOString(),
                autor: "Sistema",
                categoria: "Tutoriales",
                imagen: "img/beginners-guide.jpg"
            }
        ];

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 100));
        return { content: mockNews };
    }

    static async createNews(newsData) {
        // Simular creación local
        const newNews = {
            id: Date.now(),
            titulo: newsData.titulo,
            contenido: newsData.contenido,
            fechaPublicacion: new Date().toISOString(),
            autor: "Usuario",
            categoria: newsData.categoria || "General",
            imagen: newsData.imagen || "img/default-publication.jpg"
        };

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 200));
        return { content: newNews };
    }

    static async getNewsById(newsId) {
        const news = await this.getAllNews();
        const newsItem = news.content.find(n => n.id === parseInt(newsId));

        if (!newsItem) {
            throw new Error('News not found');
        }

        return { content: newsItem };
    }

    static async updateNews(newsId, newsData) {
        // Simular actualización local
        const updatedNews = {
            id: parseInt(newsId),
            titulo: newsData.titulo,
            contenido: newsData.contenido,
            fechaPublicacion: new Date().toISOString(),
            autor: "Usuario",
            categoria: newsData.categoria || "General",
            imagen: newsData.imagen || "img/default-publication.jpg"
        };

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 200));
        return { content: updatedNews };
    }

    static async deleteNews(newsId) {
        // Simular eliminación local
        await new Promise(resolve => setTimeout(resolve, 100));
        return { content: { message: 'News deleted successfully' } };
    }
}
