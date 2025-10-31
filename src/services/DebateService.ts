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
          resolve(defaultDebates);
        } else {
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

  static async addComment(debateId: string, commentData: Omit<Comment, 'id' | 'likes' | 'liked' | 'createdAt'>): Promise<void> {
    console.log('Calling ADD COMMENT endpoint for debate:', debateId, 'with data:', commentData);

    const debates = this.getDebates();
    const debateItem = debates.find(item => item.id === debateId);

    if (debateItem) {
      const newComment: Comment = {
        ...commentData,
        id: Date.now().toString(),
        likes: 0,
        liked: false,
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
      if (comment && !comment.liked) {
        comment.likes++;
        comment.liked = true;
        this.saveDebates(debates);
        console.log('Comment liked successfully');
      } else {
        console.log('Failed to like comment: Comment not found or already liked');
      }
    } else {
      console.log('Failed to like comment: Debate not found');
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
