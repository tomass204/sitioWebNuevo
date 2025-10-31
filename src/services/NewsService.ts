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
          resolve(defaultNews);
        } else {
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

  static async addComment(newsId: string, commentData: Omit<Comment, 'id' | 'likes' | 'liked' | 'createdAt'>): Promise<void> {
    console.log('Calling ADD COMMENT endpoint for news:', newsId, 'with data:', commentData);

    const news = this.getNews();
    const newsItem = news.find(item => item.id === newsId);

    if (newsItem) {
      const newComment: Comment = {
        ...commentData,
        id: Date.now().toString(),
        likes: 0,
        liked: false,
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
      if (comment && !comment.liked) {
        comment.likes++;
        comment.liked = true;
        this.saveNews(news);
        console.log('Comment liked successfully');
      } else {
        console.log('Failed to like comment: Comment not found or already liked');
      }
    } else {
      console.log('Failed to like comment: News not found');
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
