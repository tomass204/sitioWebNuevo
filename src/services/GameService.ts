export interface GameItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  author: string;
  price: number;
  createdAt: string;
  downloadUrl?: string;
}

export interface PurchaseDetail {
  gameId: string;
  purchaseDate: string;
  quantity: number;
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

  private static getPurchaseDetails(userEmail: string): PurchaseDetail[] {
    return JSON.parse(localStorage.getItem(`gaminghub_purchase_details_${userEmail}`) || '[]');
  }

  private static savePurchaseDetails(userEmail: string, details: PurchaseDetail[]): void {
    localStorage.setItem(`gaminghub_purchase_details_${userEmail}`, JSON.stringify(details));
  }

  static async getAllGames(): Promise<GameItem[]> {
    console.log('Calling GET ALL GAMES endpoint');
    return new Promise((resolve) => {
      setTimeout(() => {
        let games = this.getGames();
        if (games.length === 0) {
          const defaultGames: GameItem[] = [
            {
              id: '1',
              title: 'Clash Royale',
              category: 'strategy',
              description: 'Juego de estrategia en tiempo real.',
              image: '/img/C.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://clashroyale.com/download'
            },
            {
              id: '2',
              title: 'Fortnite',
              category: 'action',
              description: 'Battle royale con construcción.',
              image: '/img/cf.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.fortnite.com/download?lang=es-ES'
            },
            {
              id: '3',
              title: 'Roblox',
              category: 'adventure',
              description: 'Plataforma de juegos creados por usuarios.',
              image: '/img/R.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.roblox.com/download'
            },
            {
              id: '4',
              title: 'Batman',
              category: 'action',
              description: 'Juego de acción y aventura con el Caballero Oscuro.',
              image: '/img/Batman.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/tkd94t6fuatq1y1'
            },
            {
              id: '5',
              title: 'Brawl Stars',
              category: 'action',
              description: 'Juego de acción multijugador.',
              image: '/img/B.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://es.ldplayer.net/games/brawl-stars-on-pc.html'
            },
            {
              id: '6',
              title: 'Minecraft',
              category: 'adventure',
              description: 'Mundo de bloques y aventuras.',
              image: '/img/M.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.minecraft.net/es-es/download'
            },
            {
              id: '7',
              title: 'Outlast Trials',
              category: 'horror',
              description: 'Juego de horror cooperativo en primera persona.',
              image: '/img/Outlast3.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/example/outlasttrials.zip'
            },
            {
              id: '8',
              title: 'The Witcher 3',
              category: 'rpg',
              description: 'Épica aventura de rol con mundo abierto.',
              image: '/img/witcher3.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/c9Ca1I'
            },
            {
              id: '9',
              title: 'Cyberpunk 2077',
              category: 'action',
              description: 'Juego de acción en un futuro distópico.',
              image: '/img/cyberpunk.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/2x3fiN'
            },
            {
              id: '10',
              title: 'Among Us',
              category: 'party',
              description: 'Juego de fiesta multijugador con traidores.',
              image: '/img/amongus.png',
              author: 'influencer@gaminghub.com',
              price: 4.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/yt0yti8x2dfl9th'
            },
            {
              id: '11',
              title: 'League of Legends',
              category: 'strategy',
              description: 'MOBA competitivo con equipos de 5.',
              image: '/img/lol.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.leagueoflegends.com/es-es/download/'
            },
            {
              id: '12',
              title: 'Valorant',
              category: 'fps',
              description: 'Shooter táctico con personajes únicos.',
              image: '/img/valorant.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://playvalorant.com/es-es/download/'
            },
            {
              id: '13',
              title: 'Assassin\'s Creed Valhalla',
              category: 'action',
              description: 'Aventura histórica con vikingos.',
              image: '/img/acvalhalla.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.malavida.com/es/soft/assassins-creed-valhalla/'
            },
            {
              id: '14',
              title: 'FIFA 23',
              category: 'sports',
              description: 'Simulador de fútbol con equipos reales.',
              image: '/img/fifa23.png',
              author: 'influencer@gaminghub.com',
              price: 69.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/t94dji'
            },
            {
              id: '15',
              title: 'Hades',
              category: 'rpg',
              description: 'Roguelike con mitología griega.',
              image: '/img/hades.png',
              author: 'influencer@gaminghub.com',
              price: 24.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.megajuegosfree.com/hades-full-espanol-mega/'
            },
            {
              id: '16',
              title: 'Call of Duty: Modern Warfare 3',
              category: 'fps',
              description: 'Shooter en primera persona con campaña intensa.',
              image: '/img/codmw.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/fWunW0'
            },
            {
              id: '17',
              title: 'Genshin Impact',
              category: 'rpg',
              description: 'RPG de mundo abierto con elementos.',
              image: '/img/genshinimpact.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://genshin-impact.uptodown.com/windows'
            },
            {
              id: '18',
              title: 'Apex Legends',
              category: 'fps',
              description: 'Battle royale con personajes legendarios.',
              image: '/img/apexlegends.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://es.ccm.net/descargas/videojuegos/7760-apex-legends-para-pc/'
            },
            {
              id: '19',
              title: 'PUBG',
              category: 'fps',
              description: 'Battle royale realista.',
              image: '/img/pubg.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://es.ccm.net/descargas/videojuegos/7758-pubg-battlegrounds-para-pc/'
            },
            {
              id: '20',
              title: 'Rocket League',
              category: 'sports',
              description: 'Fútbol con autos voladores.',
              image: '/img/rocketleague.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/IDcwdk'
            },
            {
              id: '21',
              title: 'The Sims 4',
              category: 'simulation',
              description: 'Simulador de vida con construcción.',
              image: '/img/thesims4.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.malavida.com/es/soft/los-sims-4/'
            },
            {
              id: '22',
              title: 'Animal Crossing',
              category: 'simulation',
              description: 'Vida relajada en una isla paradisíaca.',
              image: '/img/animalcrossing.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.bluestacks.com/es/apps/simulation/animal-crossing-pocket-camp-on-pc.html'
            },
            {
              id: '23',
              title: 'Pokémon',
              category: 'rpg',
              description: 'Atrapa y entrena criaturas fantásticas.',
              image: '/img/pokemon.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://pokemon-project.com/descargas/juegos'
            },
            {
              id: '24',
              title: 'The Legend of Zelda',
              category: 'adventure',
              description: 'Aventura épica con Link.',
              image: '/img/zelda.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://legend-of-zelda-links-awakening.uptodown.com/windows'
            },
            {
              id: '25',
              title: 'Resident Evil',
              category: 'horror',
              description: 'Sobrevive a zombis y horrores.',
              image: '/img/residentevil.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/GApmTu'
            },
            {
              id: '26',
              title: 'The Last of Us',
              category: 'adventure',
              description: 'Historia emocional en un mundo post-apocalíptico.',
              image: '/img/thelastofus.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/lEHzIG'
            },
            {
              id: '27',
              title: 'God of War',
              category: 'action',
              description: 'Viaje mítico con Kratos.',
              image: '/img/godofwar.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/TT3Vej'
            },
            {
              id: '28',
              title: 'Spider-Man',
              category: 'action',
              description: 'Balancea por Nueva York como el Hombre Araña.',
              image: '/img/spiderman.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/2zzvt86fx7q2siu'
            },
            {
              id: '29',
              title: 'Batman: Arkham',
              category: 'action',
              description: 'Investiga crímenes como Batman.',
              image: '/img/batmanarkham.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/bTU5vk'
            },
            {
              id: '30',
              title: 'Outlast',
              category: 'horror',
              description: 'Terror psicológico en primera persona.',
              image: '/img/outlast.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/fegmcom5rc3pbod'
            },
            {
              id: '31',
              title: 'Fallout',
              category: 'rpg',
              description: 'Sobrevive en un mundo post-nuclear.',
              image: '/img/fallout.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/jri4y8qvwvakbfo'
            },
            {
              id: '32',
              title: 'The Elder Scrolls V: Skyrim',
              category: 'rpg',
              description: 'Mundo abierto con dragones y magia.',
              image: '/img/skyrim.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/j7in6edqwm6iit0'
            },
            {
              id: '33',
              title: 'Horizon Zero Dawn',
              category: 'action',
              description: 'Explora un mundo con máquinas antiguas.',
              image: '/img/horizon.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/mgv2gbeoll5f7dg/Horizon_Zero_Dawn.rar/file'
            },
            {
              id: '34',
              title: 'Uncharted',
              category: 'adventure',
              description: 'Aventuras de exploración con Nathan Drake.',
              image: '/img/uncharted.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/p55otozty7reh9i/84748C8745h85tT84E8754T.mkv/file'
            },
            {
              id: '35',
              title: 'Red Dead Redemption 2',
              category: 'action',
              description: 'Épica del viejo oeste.',
              image: '/img/reddeadredemption.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/5GYOmi'
            },
            {
              id: '36',
              title: 'Grand Theft Auto V',
              category: 'action',
              description: 'Mundo abierto con crimen y caos.',
              image: '/img/grandtheftauto.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.gtaday.com/'
            }
          ];
          this.saveGames(defaultGames);
          console.log('Games initialized with default data');
          console.log('Games:', defaultGames);
          resolve(defaultGames.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
        } else {
          // Add missing default games if not present
          const defaultGamesToAdd = [
            {
              id: '1',
              title: 'Clash Royale',
              category: 'strategy',
              description: 'Juego de estrategia en tiempo real.',
              image: '/img/C.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.filehorse.com/es/download-clash-royale/'
            },
            {
              id: '2',
              title: 'Fortnite',
              category: 'action',
              description: 'Battle royale con construcción.',
              image: '/img/cf.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.fortnite.com/download?lang=es-ES'
            },
            {
              id: '3',
              title: 'Roblox',
              category: 'adventure',
              description: 'Plataforma de juegos creados por usuarios.',
              image: '/img/R.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.roblox.com/download'
            },
            {
              id: '4',
              title: 'Batman',
              category: 'action',
              description: 'Juego de acción y aventura con el Caballero Oscuro.',
              image: '/img/Batman3.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/tkd94t6fuatq1y1'
            },
            {
              id: '5',
              title: 'Brawl Stars',
              category: 'action',
              description: 'Juego de acción multijugador.',
              image: '/img/BrawlStars3.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://es.ldplayer.net/games/brawl-stars-on-pc.html'
            },
            {
              id: '6',
              title: 'Minecraft',
              category: 'adventure',
              description: 'Mundo de bloques y aventuras.',
              image: '/img/Minecraft3.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.minecraft.net/es-es/download'
            },
            {
              id: '7',
              title: 'Outlast Trials',
              category: 'horror',
              description: 'Juego de horror cooperativo en primera persona.',
              image: '/img/Outlast3.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/example/outlasttrials.zip'
            },
            {
              id: '8',
              title: 'The Witcher 3',
              category: 'rpg',
              description: 'Épica aventura de rol con mundo abierto.',
              image: '/img/witcher3.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/c9Ca1I'
            },
            {
              id: '9',
              title: 'Cyberpunk 2077',
              category: 'action',
              description: 'Juego de acción en un futuro distópico.',
              image: '/img/cyberpunk.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/2x3fiN'
            },
            {
              id: '10',
              title: 'Among Us',
              category: 'party',
              description: 'Juego de fiesta multijugador con traidores.',
              image: '/img/amongus.png',
              author: 'influencer@gaminghub.com',
              price: 4.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/yt0yti8x2dfl9th'
            },
            {
              id: '11',
              title: 'League of Legends',
              category: 'strategy',
              description: 'MOBA competitivo con equipos de 5.',
              image: '/img/lol.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.leagueoflegends.com/es-es/download/'
            },
            {
              id: '12',
              title: 'Valorant',
              category: 'fps',
              description: 'Shooter táctico con personajes únicos.',
              image: '/img/valorant.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://playvalorant.com/es-es/download/'
            },
            {
              id: '13',
              title: 'Assassin\'s Creed Valhalla',
              category: 'action',
              description: 'Aventura histórica con vikingos.',
              image: '/img/acvalhalla.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.malavida.com/es/soft/assassins-creed-valhalla/'
            },
            {
              id: '14',
              title: 'FIFA 23',
              category: 'sports',
              description: 'Simulador de fútbol con equipos reales.',
              image: '/img/fifa23.png',
              author: 'influencer@gaminghub.com',
              price: 69.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/t94dji'
            },
            {
              id: '15',
              title: 'Hades',
              category: 'rpg',
              description: 'Roguelike con mitología griega.',
              image: '/img/hades.png',
              author: 'influencer@gaminghub.com',
              price: 24.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.megajuegosfree.com/hades-full-espanol-mega/'
            },
            {
              id: '16',
              title: 'Call of Duty: Modern Warfare',
              category: 'fps',
              description: 'Shooter en primera persona con campaña intensa.',
              image: '/img/codmw.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/fWunW0'
            },
            {
              id: '17',
              title: 'Genshin Impact',
              category: 'rpg',
              description: 'RPG de mundo abierto con elementos.',
              image: '/img/genshinimpact.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://genshin-impact.uptodown.com/windows'
            },
            {
              id: '18',
              title: 'Apex Legends',
              category: 'fps',
              description: 'Battle royale con personajes legendarios.',
              image: '/img/apexlegends.png',
              author: 'influencer@gaminghub.com',
              price: 0,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://es.ccm.net/descargas/videojuegos/7760-apex-legends-para-pc/'
            },
            {
              id: '19',
              title: 'PUBG',
              category: 'fps',
              description: 'Battle royale realista.',
              image: '/img/pubg.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://es.ccm.net/descargas/videojuegos/7758-pubg-battlegrounds-para-pc/'
            },
            {
              id: '20',
              title: 'Rocket League',
              category: 'sports',
              description: 'Fútbol con autos voladores.',
              image: '/img/rocketleague.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/IDcwdk'
            },
            {
              id: '21',
              title: 'The Sims 4',
              category: 'simulation',
              description: 'Simulador de vida con construcción.',
              image: '/img/thesims4.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.malavida.com/es/soft/los-sims-4/'
            },
            {
              id: '22',
              title: 'Animal Crossing',
              category: 'simulation',
              description: 'Vida relajada en una isla paradisíaca.',
              image: '/img/animalcrossing.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.bluestacks.com/es/apps/simulation/animal-crossing-pocket-camp-on-pc.html'
            },
            {
              id: '23',
              title: 'Pokémon',
              category: 'rpg',
              description: 'Atrapa y entrena criaturas fantásticas.',
              image: '/img/pokemon.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://pokemon-project.com/descargas/juegos'
            },
            {
              id: '24',
              title: 'The Legend of Zelda',
              category: 'adventure',
              description: 'Aventura épica con Link.',
              image: '/img/zelda.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://legend-of-zelda-links-awakening.uptodown.com/windows'
            },
            {
              id: '25',
              title: 'Resident Evil',
              category: 'horror',
              description: 'Sobrevive a zombis y horrores.',
              image: '/img/residentevil.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/GApmTu'
            },
            {
              id: '26',
              title: 'The Last of Us',
              category: 'adventure',
              description: 'Historia emocional en un mundo post-apocalíptico.',
              image: '/img/thelastofus.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/lEHzIG'
            },
            {
              id: '27',
              title: 'God of War',
              category: 'action',
              description: 'Viaje mítico con Kratos.',
              image: '/img/godofwar.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/TT3Vej'
            },
            {
              id: '28',
              title: 'Spider-Man',
              category: 'action',
              description: 'Balancea por Nueva York como el Hombre Araña.',
              image: '/img/spiderman.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/2zzvt86fx7q2siu'
            },
            {
              id: '29',
              title: 'Batman: Arkham',
              category: 'action',
              description: 'Investiga crímenes como Batman.',
              image: '/img/batmanarkham.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/bTU5vk'
            },
            {
              id: '30',
              title: 'Outlast',
              category: 'horror',
              description: 'Terror psicológico en primera persona.',
              image: '/img/outlast.png',
              author: 'influencer@gaminghub.com',
              price: 19.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/fegmcom5rc3pbod'
            },
            {
              id: '31',
              title: 'Fallout',
              category: 'rpg',
              description: 'Sobrevive en un mundo post-nuclear.',
              image: '/img/fallout.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/jri4y8qvwvakbfo'
            },
            {
              id: '32',
              title: 'The Elder Scrolls V: Skyrim',
              category: 'rpg',
              description: 'Mundo abierto con dragones y magia.',
              image: '/img/skyrim.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/j7in6edqwm6iit0'
            },
            {
              id: '33',
              title: 'Horizon Zero Dawn',
              category: 'action',
              description: 'Explora un mundo con máquinas antiguas.',
              image: '/img/horizon.png',
              author: 'influencer@gaminghub.com',
              price: 49.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/mgv2gbeoll5f7dg/Horizon_Zero_Dawn.rar/file'
            },
            {
              id: '34',
              title: 'Uncharted',
              category: 'adventure',
              description: 'Aventuras de exploración con Nathan Drake.',
              image: '/img/uncharted.png',
              author: 'influencer@gaminghub.com',
              price: 39.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.mediafire.com/file/p55otozty7reh9i/84748C8745h85tT84E8754T.mkv/file'
            },
            {
              id: '35',
              title: 'Red Dead Redemption 2',
              category: 'action',
              description: 'Épica del viejo oeste.',
              image: '/img/reddeadredemption.png',
              author: 'influencer@gaminghub.com',
              price: 59.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://gofile.io/d/5GYOmi'
            },
            {
              id: '36',
              title: 'Grand Theft Auto V',
              category: 'action',
              description: 'Mundo abierto con crimen y caos.',
              image: '/img/grandtheftauto.png',
              author: 'influencer@gaminghub.com',
              price: 29.99,
              createdAt: new Date().toISOString(),
              downloadUrl: 'https://www.gtaday.com/'
            }
          ];

          const existingTitles = games.map(g => g.title);
          const gamesToAdd = defaultGamesToAdd.filter(dg => !existingTitles.includes(dg.title));
          if (gamesToAdd.length > 0) {
            games.push(...gamesToAdd);
            this.saveGames(games);
            console.log('Added missing default games, new count:', games.length);
          }
          const sortedGames = games.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          console.log('Games retrieved successfully, count:', sortedGames.length);
          console.log('Games:', sortedGames);
          resolve(sortedGames);
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

    // Record purchase details
    const details = this.getPurchaseDetails(userEmail);
    details.push({
      gameId,
      purchaseDate: new Date().toISOString(),
      quantity: 1
    });
    this.savePurchaseDetails(userEmail, details);

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

  static async addComment(gameId: string, commentData: Omit<Comment, 'id' | 'likes' | 'liked' | 'favorite' | 'createdAt'>): Promise<void> {
    console.log('Calling ADD COMMENT endpoint for game:', gameId, 'with data:', commentData);

    // Add to global comments for moderation
    const globalComments = JSON.parse(localStorage.getItem('gaminghub_comments') || '[]');
    const newComment = {
      id: Date.now().toString(),
      userEmail: commentData.author,
      username: commentData.author.split('@')[0], // Extract username from email
      content: commentData.text,
      timestamp: new Date().toISOString(),
      gameId: gameId,
      type: 'game'
    };
    globalComments.push(newComment);
    localStorage.setItem('gaminghub_comments', JSON.stringify(globalComments));

    console.log('Comment added successfully to game:', gameId);
  }

  static async deleteGame(id: string): Promise<void> {
    console.log('Calling DELETE GAME endpoint for game:', id);

    const games = this.getGames();
    const filteredGames = games.filter(game => game.id !== id);
    this.saveGames(filteredGames);
    console.log('Game deleted successfully');
  }

  static async getUsersByPurchasedGame(gameId: string): Promise<{ email: string; username: string; purchaseDate: string; quantity: number }[]> {
    console.log('Calling GET USERS BY PURCHASED GAME endpoint for game:', gameId);

    const users = JSON.parse(localStorage.getItem('gaminghub_users') || '{}');
    const result: { email: string; username: string; purchaseDate: string; quantity: number }[] = [];

    for (const email in users) {
      const user = users[email];
      const details = this.getPurchaseDetails(email);
      const purchase = details.find(d => d.gameId === gameId);
      if (purchase) {
        result.push({
          email: user.email,
          username: user.username,
          purchaseDate: purchase.purchaseDate,
          quantity: purchase.quantity
        });
      }
    }

    console.log('Users retrieved successfully, count:', result.length);
    return result;
  }

  static async getAllUsersWithPurchases(): Promise<{ user: { email: string; username: string; status: string; totalPrice: number }; purchases: { gameId: string; gameTitle: string; purchaseDate: string; quantity: number; price: number }[] }[]> {
    console.log('GET /api/GamingHub/v1/Users/Purchases - Status: 200 - Lista de usuarios con sus compras');

    const users = JSON.parse(localStorage.getItem('gaminghub_users') || '{}');
    const games = this.getGames();
    const result: { user: { email: string; username: string; status: string; totalPrice: number }; purchases: { gameId: string; gameTitle: string; purchaseDate: string; quantity: number; price: number }[] }[] = [];

    for (const email in users) {
      const user = users[email];
      const details = this.getPurchaseDetails(email);
      let totalPrice = 0;
      const purchases = details.map(detail => {
        const game = games.find(g => g.id === detail.gameId);
        const price = game ? game.price : 0;
        totalPrice += price * detail.quantity;
        return {
          gameId: detail.gameId,
          gameTitle: game ? game.title : 'Unknown Game',
          purchaseDate: detail.purchaseDate,
          quantity: detail.quantity,
          price: price
        };
      });

      if (purchases.length > 0) {
        console.log(`Usuario: ${user.username} (${user.email}) - Estado: ${user.status || 'active'} - Compras:`, purchases);
        result.push({
          user: {
            email: user.email,
            username: user.username,
            status: user.status || 'active',
            totalPrice: totalPrice
          },
          purchases
        });
      }
    }

    console.log('All users with purchases retrieved successfully, count:', result.length);
    return result;
  }
}
