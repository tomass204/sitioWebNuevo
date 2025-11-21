const storage = (() => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return localStorage;
  } catch (e) {
    return {
      getItem: (key: string) => (window as any)[key] || '[]',
      setItem: (key: string, value: string) => (window as any)[key] = value
    };
  }
})();

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  likes: number;
  liked: boolean;
  favorite: boolean;
  createdAt: string;
}

export class NewsService {
  private static getNews(): NewsItem[] {
    return JSON.parse(localStorage.getItem('gaminghub_news') || '[]');
  }

  private static saveNews(news: NewsItem[]): void {
    localStorage.setItem('gaminghub_news', JSON.stringify(news));
  }

  static async getAllNews(): Promise<NewsItem[]> {
    console.log('Calling GET ALL NEWS endpoint');
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const news = this.getNews();
        const isTest = typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;
        if (news.length === 0 && !isTest) {
          // Initialize with default news
          const defaultNews: NewsItem[] = [
            {
              id: '1',
              title: 'Nueva temporada de Clash Royale',
              content: 'Supercell lanza la temporada de invierno con nuevas cartas y desafíos.',
              image: '/img/ClashRoyale.png',
              author: 'influencer@gaminghub.com',
              comments: [],
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Actualización épica de Fortnite',
              content: 'Capítulo 5 trae mapas nuevos y colaboraciones con Roblox.',
              image: '/img/Fornite.png',
              author: 'influencer@gaminghub.com',
              comments: [],
              createdAt: new Date().toISOString()
            },
            {
              id: '3',
              title: 'Eventos especiales en Roblox',
              content: 'Fiestas temáticas y premios exclusivos para los jugadores.',
              image: '/img/Roblox.png',
              author: 'influencer@gaminghub.com',
              comments: [],
              createdAt: new Date().toISOString()
            }
          ];
          this.saveNews(defaultNews);
          console.log('News initialized with default data');
          console.log('News:', defaultNews);
          resolve(defaultNews);
        } else {
          console.log('News retrieved successfully, status: 200, count:', news.length);
          console.log('News:', news);
          resolve(news);
        }
      }, 100);
    });
  }

  static async createNews(newsData: Omit<NewsItem, 'id' | 'comments' | 'createdAt'>): Promise<NewsItem> {
    console.log('Calling CREATE NEWS endpoint with data:', newsData);

    const news = this.getNews();
    const newItem: NewsItem = {
      ...newsData,
      id: Date.now().toString(),
      comments: [],
      createdAt: new Date().toISOString()
    };

    news.unshift(newItem);
    this.saveNews(news);
    console.log('News created successfully:', newItem.title);
    return newItem;
  }

  static async addComment(newsId: string, commentData: Omit<Comment, 'id' | 'likes' | 'liked' | 'favorite' | 'createdAt'>): Promise<void> {
    console.log('Calling ADD COMMENT endpoint for news:', newsId, 'with data:', commentData);

    const news = this.getNews();
    const newsItem = news.find(item => item.id === newsId);

    if (newsItem) {
      const newComment: Comment = {
        ...commentData,
        id: Date.now().toString(),
        likes: 0,
        liked: false,
        favorite: false,
        createdAt: new Date().toISOString()
      };

      newsItem.comments.push(newComment);
      this.saveNews(news);

      console.log('Comment added successfully to news:', newsItem.title);
    } else {
      console.log('Failed to add comment: News not found');
    }
  }

  static async likeComment(newsId: string, commentId: string): Promise<void> {
    console.log('Calling LIKE COMMENT endpoint for news:', newsId, 'comment:', commentId);

    const news = this.getNews();
    const newsItem = news.find(item => item.id === newsId);

    if (newsItem) {
      const comment = newsItem.comments.find(c => c.id === commentId);
      if (comment) {
        if (comment.liked) {
          comment.likes--;
          comment.liked = false;
          console.log('Comment unliked successfully');
        } else {
          comment.likes++;
          comment.liked = true;
          console.log('Comment liked successfully');
        }
        this.saveNews(news);
      } else {
        console.log('Failed to like/unlike comment: Comment not found');
      }
    } else {
      console.log('Failed to like/unlike comment: News not found');
    }
  }

  static async favoriteComment(newsId: string, commentId: string): Promise<void> {
    console.log('Calling FAVORITE COMMENT endpoint for news:', newsId, 'comment:', commentId);

    const news = this.getNews();
    const newsItem = news.find(item => item.id === newsId);

    if (newsItem) {
      const comment = newsItem.comments.find(c => c.id === commentId);
      if (comment) {
        comment.favorite = !comment.favorite;

        // Update favorites in storage
        const favorites = JSON.parse(storage.getItem('gaminghub_favorites') || '[]');
        if (comment.favorite) {
          // Add to favorites
          const favoriteItem = {
            type: 'news',
            id: comment.id,
            content: comment.text,
            author: comment.author,
            likes: comment.likes,
            liked: comment.liked,
            favorite: comment.favorite,
            createdAt: comment.createdAt
          };
          favorites.push(favoriteItem);
          storage.setItem('gaminghub_favorites', JSON.stringify(favorites));
          console.log(`Comentario favorito en noticia ID: ${newsId}, Usuario ID: ${comment.author}, Comentario: ${comment.text}`);
        } else {
          // Remove from favorites
          const updatedFavorites = favorites.filter((fav: any) => fav.id !== comment.id);
          storage.setItem('gaminghub_favorites', JSON.stringify(updatedFavorites));
          console.log('Comment removed from favorites');
        }
        // Dispatch event to update FavoritesTab
        window.dispatchEvent(new Event('favoritesUpdated'));

        this.saveNews(news);
        console.log('Comment favorite toggled successfully');
      } else {
        console.log('Failed to favorite comment: Comment not found');
      }
    } else {
      console.log('Failed to favorite comment: News not found');
    }
  }

  static async deleteNews(newsId: string): Promise<void> {
    console.log('Calling DELETE NEWS endpoint for news:', newsId);

    const news = this.getNews();
    const filteredNews = news.filter(item => item.id !== newsId);
    this.saveNews(filteredNews);
    console.log('News deleted successfully');
  }
}
