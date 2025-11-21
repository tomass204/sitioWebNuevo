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

export interface DebateItem {
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

export class DebateService {
  private static getDebates(): DebateItem[] {
    return JSON.parse(localStorage.getItem('gaminghub_debates') || '[]');
  }

  private static saveDebates(debates: DebateItem[]): void {
    localStorage.setItem('gaminghub_debates', JSON.stringify(debates));
  }

  static async getAllDebates(): Promise<DebateItem[]> {
    console.log('Calling GET ALL DEBATES endpoint');
    return new Promise((resolve) => {
      setTimeout(() => {
        const debates = this.getDebates();
        if (debates.length === 0) {
          const defaultDebates: DebateItem[] = [
            {
              id: '1',
              title: '¿Clash Royale o Fortnite?',
              content: '¿Cuál es mejor para batallas rápidas?',
              image: '/img/Emote.png',
              author: 'influencer@gaminghub.com',
              comments: [],
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Roblox: ¿Juego o plataforma?',
              content: 'Debate sobre el futuro de los juegos creados por usuarios.',
              image: '/img/Roblox2.png',
              author: 'influencer@gaminghub.com',
              comments: [],
              createdAt: new Date().toISOString()
            },
            {
              id: '3',
              title: '¿Batman: Arkham o Injustice?',
              content: 'Debate sobre cuál saga de Batman es superior.',
              image: '/img/Batman2.png',
              author: 'influencer@gaminghub.com',
              comments: [],
              createdAt: new Date().toISOString()
            }
          ];
          this.saveDebates(defaultDebates);
          console.log('Debates initialized with default data');
          console.log('Debates:', defaultDebates);
          resolve(defaultDebates);
        } else {
          console.log('Debates retrieved successfully, status: 200, count:', debates.length);
          console.log('Debates:', debates);
          resolve(debates);
        }
      }, 100);
    });
  }

  static async createDebate(debateData: Omit<DebateItem, 'id' | 'comments' | 'createdAt'>): Promise<DebateItem> {
    console.log('Calling CREATE DEBATE endpoint with data:', debateData);

    const debates = this.getDebates();
    const newItem: DebateItem = {
      ...debateData,
      id: Date.now().toString(),
      comments: [],
      createdAt: new Date().toISOString()
    };

    debates.unshift(newItem);
    this.saveDebates(debates);
    console.log('Debate created successfully:', newItem.title);
    return newItem;
  }

  static async addComment(debateId: string, commentData: Omit<Comment, 'id' | 'likes' | 'liked' | 'favorite' | 'createdAt'>): Promise<void> {
    console.log('Calling ADD COMMENT endpoint for debate:', debateId, 'with data:', commentData);

    const debates = this.getDebates();
    const debateItem = debates.find(item => item.id === debateId);

    if (debateItem) {
      const newComment: Comment = {
        ...commentData,
        id: Date.now().toString(),
        likes: 0,
        liked: false,
        favorite: false,
        createdAt: new Date().toISOString()
      };

      debateItem.comments.push(newComment);
      this.saveDebates(debates);

      console.log('Comment added successfully to debate:', debateItem.title);
    } else {
      console.log('Failed to add comment: Debate not found');
    }
  }

  static async likeComment(debateId: string, commentId: string): Promise<void> {
    console.log('Calling LIKE COMMENT endpoint for debate:', debateId, 'comment:', commentId);

    const debates = this.getDebates();
    const debateItem = debates.find(item => item.id === debateId);

    if (debateItem) {
      const comment = debateItem.comments.find(c => c.id === commentId);
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
        this.saveDebates(debates);
      } else {
        console.log('Failed to like/unlike comment: Comment not found');
      }
    } else {
      console.log('Failed to like/unlike comment: Debate not found');
    }
  }

  static async favoriteComment(debateId: string, commentId: string): Promise<void> {
    console.log('Calling FAVORITE COMMENT endpoint for debate:', debateId, 'comment:', commentId);

    const debates = this.getDebates();
    const debateItem = debates.find(item => item.id === debateId);

    if (debateItem) {
      const comment = debateItem.comments.find(c => c.id === commentId);
      if (comment) {
        comment.favorite = !comment.favorite;

        // Update favorites in storage
        const favorites = JSON.parse(storage.getItem('gaminghub_favorites') || '[]');
        if (comment.favorite) {
          // Add to favorites
          const favoriteItem = {
            type: 'debate',
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
          console.log(`Comentario favorito en debate ID: ${debateId}, Usuario ID: ${comment.author}, Comentario: ${comment.text}`);
        } else {
          // Remove from favorites
          const updatedFavorites = favorites.filter((fav: any) => fav.id !== comment.id);
          storage.setItem('gaminghub_favorites', JSON.stringify(updatedFavorites));
          console.log('Comment removed from favorites');
        }
        // Dispatch event to update FavoritesTab
        window.dispatchEvent(new Event('favoritesUpdated'));

        this.saveDebates(debates);
        console.log('Comment favorite toggled successfully');
      } else {
        console.log('Failed to favorite comment: Comment not found');
      }
    } else {
      console.log('Failed to favorite comment: Debate not found');
    }
  }

  static async deleteDebate(debateId: string): Promise<void> {
    console.log('Calling DELETE DEBATE endpoint for debate:', debateId);

    const debates = this.getDebates();
    const filteredDebates = debates.filter(item => item.id !== debateId);
    this.saveDebates(filteredDebates);
    console.log('Debate deleted successfully');
  }
}
