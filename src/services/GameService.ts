export interface GameItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  author: string;
  price: number;
  createdAt: string;
}

export class GameService {
  private static getGames(): GameItem[] {
    return JSON.parse(localStorage.getItem('gaminghub_games') || '[]');
  }

  private static saveGames(games: GameItem[]): void {
    localStorage.setItem('gaminghub_games', JSON.stringify(games));
  }

  private static getPurchasedGames(userEmail: string): string[] {
    return JSON.parse(localStorage.getItem(`gaminghub_purchased_${userEmail}`) || '[]');
  }

  private static savePurchasedGames(userEmail: string, purchased: string[]): void {
    localStorage.setItem(`gaminghub_purchased_${userEmail}`, JSON.stringify(purchased));
  }

  static async getAllGames(): Promise<GameItem[]> {
    console.log('Calling GET ALL GAMES endpoint');
    return new Promise((resolve) => {
      setTimeout(() => {
        const games = this.getGames();
        if (games.length === 0) {
          const defaultGames: GameItem[] = [
            {
              id: '1',
              title: 'Clash Royale',
              category: 'strategy',
              description: 'Juego de estrategia en tiempo real.',
              image: '/img/ClashRoyale3.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Fortnite',
              category: 'action',
              description: 'Battle royale con construcción.',
              image: '/img/Fornite3.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString()
            },
            {
              id: '3',
              title: 'Roblox',
              category: 'adventure',
              description: 'Plataforma de juegos creados por usuarios.',
              image: '/img/Roblox3.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString()
            },
            {
              id: '4',
              title: 'Batman',
              category: 'action',
              description: 'Juego de acción y aventura con el Caballero Oscuro.',
              image: '/img/Batman3.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString()
            },
            {
              id: '5',
              title: 'Outlast Trials',
              category: 'horror',
              description: 'Juego de horror cooperativo en primera persona.',
              image: '/img/Outlast3.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString()
            },
            {
              id: '6',
              title: 'Brawl Stars',
              category: 'strategy',
              description: 'Juego de batalla multijugador en tiempo real con personajes únicos.',
              image: '/img/BrawlStars3.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString()
            },
            {
              id: '7',
              title: 'Minecraft',
              category: 'adventure',
              description: 'Juego de construcción y exploración en un mundo abierto.',
              image: '/img/Minecraft3.png',
              author: 'influencer@gaminghub.com',
              price: 26.95,
              createdAt: new Date().toISOString()
            },
            {
              id: '8',
              title: 'The Witcher 3',
              category: 'rpg',
              description: 'Épica aventura de rol con mundo abierto.',
              image: '/img/witcher3.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString()
            },
            {
              id: '9',
              title: 'Cyberpunk 2077',
              category: 'action',
              description: 'Juego de acción en un futuro distópico.',
              image: '/img/cyberpunk.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString()
            },
            {
              id: '10',
              title: 'Among Us',
              category: 'party',
              description: 'Juego de fiesta multijugador con traidores.',
              image: '/img/amongus.png',
              author: 'influencer@gaminghub.com',
              price: 4.99,
              createdAt: new Date().toISOString()
            },
            {
              id: '11',
              title: 'League of Legends',
              category: 'strategy',
              description: 'MOBA competitivo con equipos de 5.',
              image: '/img/lol.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString()
            },
            {
              id: '12',
              title: 'Valorant',
              category: 'fps',
              description: 'Shooter táctico con personajes únicos.',
              image: '/img/valorant.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString()
            },
            {
              id: '13',
              title: 'Assassin\'s Creed Valhalla',
              category: 'action',
              description: 'Aventura histórica con vikingos.',
              image: '/img/acvalhalla.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString()
            },
            {
              id: '14',
              title: 'FIFA 23',
              category: 'sports',
              description: 'Simulador de fútbol con equipos reales.',
              image: '/img/fifa23.png',
              author: 'influencer@gaminghub.com',
              price: 69.99,
              createdAt: new Date().toISOString()
            },
            {
              id: '15',
              title: 'Hades',
              category: 'rpg',
              description: 'Roguelike con mitología griega.',
              image: '/img/hades.png',
              author: 'influencer@gaminghub.com',
              price: 24.99,
              createdAt: new Date().toISOString()
            }
          ];
          this.saveGames(defaultGames);
          console.log('Games initialized with default data');
          resolve(defaultGames);
        } else {
          console.log('Games retrieved successfully, count:', games.length);
          resolve(games);
        }
      }, 100);
    });
  }

  static async searchGames(query: string): Promise<GameItem[]> {
    console.log('Calling SEARCH GAMES endpoint with query:', query);
    return new Promise((resolve) => {
      setTimeout(() => {
        const games = this.getGames();
        if (!query || query.trim() === '') {
          console.log('Empty query, returning all games');
          resolve(games);
        } else {
          const filteredGames = games.filter(game =>
            game.title.toLowerCase().includes(query.toLowerCase()) ||
            game.category.toLowerCase().includes(query.toLowerCase()) ||
            game.description.toLowerCase().includes(query.toLowerCase())
          );
          console.log('Search completed, found', filteredGames.length, 'games matching query');
          resolve(filteredGames);
        }
      }, 100);
    });
  }

  static async purchaseGame(userEmail: string, gameId: string): Promise<{ success: boolean; message: string; statusCode: number }> {
    console.log('Calling PURCHASE GAME endpoint for user:', userEmail, 'game:', gameId);

    const games = this.getGames();
    const game = games.find(g => g.id === gameId);
    if (!game) {
      console.log('Purchase failed: Game not found');
      return { success: false, message: 'Juego no encontrado', statusCode: 404 };
    }

    const purchased = this.getPurchasedGames(userEmail);
    if (purchased.includes(gameId)) {
      console.log('Purchase failed: Game already purchased');
      return { success: false, message: 'Juego ya comprado', statusCode: 409 };
    }

    purchased.push(gameId);
    this.savePurchasedGames(userEmail, purchased);
    console.log('Game purchased successfully:', game.title);
    return { success: true, message: 'Juego comprado exitosamente', statusCode: 200 };
  }

  static async getUserPurchasedGames(userEmail: string): Promise<GameItem[]> {
    console.log('Calling GET PURCHASED GAMES endpoint for user:', userEmail);
    return new Promise((resolve) => {
      setTimeout(() => {
        const purchasedIds = this.getPurchasedGames(userEmail);
        const games = this.getGames();
        const purchasedGames = games.filter(game => purchasedIds.includes(game.id));
        console.log('Purchased games retrieved successfully, count:', purchasedGames.length);
        resolve(purchasedGames);
      }, 100);
    });
  }

  static async createGame(gameData: Omit<GameItem, 'id' | 'createdAt'>): Promise<GameItem> {
    console.log('Calling CREATE GAME endpoint with data:', gameData);

    const games = this.getGames();
    const newItem: GameItem = {
      ...gameData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    games.unshift(newItem);
    this.saveGames(games);
    console.log('Game created successfully:', newItem.title);
    return newItem;
  }

  static async deleteGame(id: string): Promise<void> {
    console.log('Calling DELETE GAME endpoint for game:', id);

    const games = this.getGames();
    const filteredGames = games.filter(game => game.id !== id);
    this.saveGames(filteredGames);
    console.log('Game deleted successfully');
  }
}
