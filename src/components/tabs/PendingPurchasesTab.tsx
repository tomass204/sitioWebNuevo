  import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { User } from '../../services/AuthService';

interface PurchaseItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  purchaseDate: string;
  total: number;
  status: string;
  downloadUrl?: string;
  type?: string;
}

interface PendingPurchasesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

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

const PendingPurchasesTab: React.FC<PendingPurchasesTabProps> = ({ currentUser, currentRole }) => {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    loadPurchases();
  }, [currentUser]);

  const loadPurchases = async () => {
    if (!currentUser) return;

    console.log('Calling GET PURCHASES endpoint');
    const purchasesData = JSON.parse(storage.getItem(`gaminghub_pending_purchases_${currentUser.email}`) || '[]');

    // Define download URLs for games
    const downloadUrls: { [key: string]: string } = {
      'Brawl Stars': 'https://es.ldplayer.net/games/brawl-stars-on-pc.html',
      'Minecraft': 'https://www.minecraft.net/es-es/download',
      'The Witcher': 'https://gofile.io/d/c9Ca1I',
      'Cyberpunk 2077': 'https://gofile.io/d/2x3fiN',
      'Among Us': 'https://www.mediafire.com/file/yt0yti8x2dfl9th',
      'Batman': 'https://www.mediafire.com/file/tkd94t6fuatq1y1',
      'Batman: Arkham': 'https://gofile.io/d/bTU5vk',
      'Valorant': 'https://playvalorant.com/es-es/download/',
      'Assassin\'s Creed Valhalla': 'https://www.malavida.com/es/soft/assassins-creed-valhalla/',
      'FIFA 23': 'https://gofile.io/d/t94dji',
      'Hades': 'https://www.megajuegosfree.com/hades-full-espanol-mega/',
      'Call of Duty: Modern Warfare': 'https://gofile.io/d/fWunW0',
      'Genshin Impact': 'https://genshin-impact.uptodown.com/windows',
      'Apex Legends': 'https://es.ccm.net/descargas/videojuegos/7760-apex-legends-para-pc/',
      'PUBG': 'https://es.ccm.net/descargas/videojuegos/7758-pubg-battlegrounds-para-pc/',
      'Rocket League': 'https://gofile.io/d/IDcwdk',
      'The Sims 4': 'https://www.malavida.com/es/soft/los-sims-4/',
      'Animal Crossing': 'https://www.bluestacks.com/es/apps/simulation/animal-crossing-pocket-camp-on-pc.html',
      'Pokémon': 'https://pokemon-project.com/descargas/juegos',
      'The Legend of Zelda': 'https://legend-of-zelda-links-awakening.uptodown.com/windows',
      'Resident Evil': 'https://gofile.io/d/GApmTu',
      'The Last of Us': 'https://gofile.io/d/lEHzIG',
      'God of War': 'https://gofile.io/d/TT3Vej',
      'Spider-Man': 'https://www.mediafire.com/file/2zzvt86fx7q2siu',
      'Outlast': 'https://www.mediafire.com/file/fegmcom5rc3pbod',
      'Outlast Trials': 'https://es.ccm.net/descargas/videojuegos/11294-the-outlast-trials/',
      'Fallout': 'https://www.mediafire.com/file/jri4y8qvwvakbfo',
      'The Elder Scrolls V: Skyrim': 'https://www.mediafire.com/file/j7in6edqwm6iit0',
      'Horizon Zero Dawn': 'https://www.mediafire.com/file/mgv2gbeoll5f7dg/Horizon_Zero_Dawn.rar/file',
      'Uncharted': 'https://www.mediafire.com/file/p55otozty7reh9i/84748C8745h85tT84E8754T.mkv/file',
      'Red Dead Redemption 2': 'https://gofile.io/d/5GYOmi',
      'Grand Theft Auto V': 'https://www.gtaday.com/',
      'Clash Royale': 'https://supercell.com/en/games/clashroyale/',
      'Fortnite': 'https://www.epicgames.com/fortnite/en-US/download',
      'Roblox': 'https://www.roblox.com/download'
    };

    // Update purchases with download URLs and ensure total is calculated
    const updatedPurchases = purchasesData.map((purchase: PurchaseItem) => {
      const updatedPurchase = { ...purchase };
      if (!purchase.downloadUrl && downloadUrls[purchase.title]) {
        updatedPurchase.downloadUrl = downloadUrls[purchase.title];
      }
      // Ensure total is calculated if missing
      if (updatedPurchase.total === undefined || updatedPurchase.total === null) {
        updatedPurchase.total = (updatedPurchase.price || 0) * (updatedPurchase.quantity || 1);
      }
      return updatedPurchase;
    });

    console.log('Purchase list retrieved successfully, status: 200');
    console.log(updatedPurchases);
    setPurchases(updatedPurchases);
  };





  return (
    <div>
      <h2>Compras</h2>

      {purchases.length === 0 ? (
        <Alert variant="info">
          No tienes compras.
        </Alert>
      ) : (
        <Row>
          <Col md={12}>
            {purchases.map((item, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </Col>
                    <Col md={4}>
                      <h5>{item.title}</h5>
                      <p className="text-muted">{item.description}</p>
                      <small>Fecha de compra: {new Date(item.purchaseDate).toLocaleString()}</small>
                    </Col>
                    <Col md={1}>
                      <span>Cantidad: {item.quantity}</span>
                    </Col>
                    <Col md={1}>
                      <span className="fw-bold">${Number(item.total || 0).toFixed(2)}</span>
                    </Col>
                    <Col md={1}>
                      <span className={`badge ${item.status === 'Completado' ? 'bg-success' : 'bg-warning'}`}>{item.status}</span>
                    </Col>
                    <Col md={3}>
                      {item.type === 'game' ? (
                        <span className="text-info">Ve a "Mis Órdenes" para descargar 😜</span>
                      ) : (
                        <span className="text-muted">Producto físico - Sin descarga</span>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PendingPurchasesTab;
