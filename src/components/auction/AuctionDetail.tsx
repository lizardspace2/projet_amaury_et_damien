import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  Gavel, 
  MapPin,
  Building,
  User,
  Phone,
  Mail,
  Bell,
  Heart,
  Share2,
  Eye,
  Euro,
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';
import VideoStream from './VideoStream';
import AuctionTimer from './AuctionTimer';
import LotCard from './LotCard';
import BidHistory from './BidHistory';
import UserActions from './UserActions';

interface AuctionDetailProps {
  className?: string;
}

interface Lot {
  id: string;
  title: string;
  description: string;
  images: string[];
  startingPrice: number;
  currentBid: number;
  estimate: {
    min: number;
    max: number;
  };
  status: 'upcoming' | 'active' | 'sold' | 'passed';
  category: string;
  dimensions?: string;
  condition?: string;
  provenance?: string;
  isWatched?: boolean;
}

interface AuctionData {
  id: string;
  title: string;
  description: string;
  auctioneer: {
    name: string;
    company: string;
    phone: string;
    email: string;
    avatar?: string;
  };
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'live' | 'ended';
  streamUrl?: string;
  totalLots: number;
  participants: number;
  location: string;
  lots: Lot[];
}

const AuctionDetail: React.FC<AuctionDetailProps> = ({ className = "" }) => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [activeTab, setActiveTab] = useState('lots');

  // Données de démonstration
  useEffect(() => {
    const mockAuction: AuctionData = {
      id: auctionId || '1',
      title: 'Vente aux enchères - Collection d\'art moderne et contemporain',
      description: 'Une sélection exceptionnelle d\'œuvres d\'art moderne et contemporain provenant de collections privées. Cette vente présente des pièces rares et de grande qualité, allant de la peinture à la sculpture en passant par les œuvres sur papier.',
      auctioneer: {
        name: 'Marie Dubois',
        company: 'Étude Dubois & Associés',
        phone: '+33 1 42 36 78 90',
        email: 'marie.dubois@etude-dubois.fr',
        avatar: '/api/placeholder/100/100'
      },
      startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 heures
      status: 'upcoming',
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      totalLots: 45,
      participants: 234,
      location: 'Hôtel Drouot, Paris',
      lots: [
        {
          id: '1',
          title: 'Villa moderne avec piscine - Nice',
          description: 'Magnifique villa contemporaine de 200m² avec piscine privée, située dans un quartier résidentiel calme de Nice. La propriété dispose de 4 chambres, 3 salles de bain, un grand salon avec cheminée, une cuisine équipée et un garage pour 2 voitures.',
          images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
          startingPrice: 800000,
          currentBid: 950000,
          estimate: { min: 800000, max: 1200000 },
          status: 'upcoming',
          category: 'Immobilier',
          dimensions: '200 m²',
          condition: 'Excellent état',
          provenance: 'Succession',
          isWatched: false
        },
        {
          id: '2',
          title: 'Appartement haussmannien - Paris 16ème',
          description: 'Superbe appartement de 120m² dans un immeuble haussmannien rénové, avec vue sur la Seine. 3 chambres, 2 salles de bain, salon avec balcon, cuisine ouverte et cave.',
          images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
          startingPrice: 1200000,
          currentBid: 0,
          estimate: { min: 1200000, max: 1500000 },
          status: 'upcoming',
          category: 'Immobilier',
          dimensions: '120 m²',
          condition: 'Rénové',
          provenance: 'Vente privée',
          isWatched: true
        },
        {
          id: '3',
          title: 'Maison de campagne - Provence',
          description: 'Charmante maison de campagne provençale de 180m² avec jardin de 2000m². 4 chambres, 2 salles de bain, salon avec cheminée, cuisine provençale et piscine.',
          images: ['/api/placeholder/600/400'],
          startingPrice: 450000,
          currentBid: 520000,
          estimate: { min: 450000, max: 600000 },
          status: 'active',
          category: 'Immobilier',
          dimensions: '180 m² + 2000 m² terrain',
          condition: 'Bon état',
          provenance: 'Vente judiciaire',
          isWatched: false
        }
      ]
    };

    setAuction(mockAuction);
    setSelectedLot(mockAuction.lots[0]);
  }, [auctionId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'live': return 'bg-red-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'live': return 'En direct';
      case 'ended': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  if (!auction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p>Chargement de la vente aux enchères...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header de la vente */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  variant="destructive" 
                  className={`${getStatusColor(auction.status)} text-white animate-pulse`}
                >
                  {getStatusText(auction.status)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {auction.participants} participants
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Gavel className="h-3 w-3" />
                  {auction.totalLots} lots
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
              <p className="text-gray-600 mb-6">{auction.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{formatDate(auction.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Heure</p>
                    <p className="font-semibold">{formatTime(auction.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Lieu</p>
                    <p className="font-semibold">{auction.location}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                variant={isWatching ? "default" : "outline"}
                onClick={() => setIsWatching(!isWatching)}
                className="flex items-center gap-2"
              >
                {isWatching ? <Heart className="h-4 w-4 fill-red-500 text-red-500" /> : <Heart className="h-4 w-4" />}
                {isWatching ? 'Suivi' : 'Suivre'}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifier
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Informations du commissaire-priseur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-teal-600" />
            Commissaire-priseur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{auction.auctioneer.name}</h3>
              <p className="text-gray-600 mb-3">{auction.auctioneer.company}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {auction.auctioneer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {auction.auctioneer.email}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer et flux vidéo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {auction.status === 'live' ? (
            <VideoStream
              streamUrl={auction.streamUrl}
              title={auction.title}
              isLive={true}
              className="w-full"
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Play className="h-16 w-16 mx-auto text-teal-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Vente à venir</h3>
                  <p className="text-gray-600">
                    Le flux vidéo sera disponible au début de la vente
                  </p>
                </div>
                <AuctionTimer
                  endTime={auction.startTime}
                  onTimeUp={() => console.log('Vente commencée')}
                  warningThreshold={300}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <AuctionTimer
            endTime={auction.endTime}
            onTimeUp={() => console.log('Vente terminée')}
            warningThreshold={600}
          />
          
          <UserActions
            auctionId={auction.id}
            isRegistered={isRegistered}
            onRegister={() => setIsRegistered(true)}
            onUnregister={() => setIsRegistered(false)}
          />
        </div>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lots">Lots ({auction.lots.length})</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>

        <TabsContent value="lots" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste des lots */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Lots de la vente</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {auction.lots.map((lot) => (
                  <LotCard
                    key={lot.id}
                    lot={lot}
                    isSelected={selectedLot?.id === lot.id}
                    onClick={() => setSelectedLot(lot)}
                    onWatchToggle={(isWatched) => {
                      // Mettre à jour l'état du lot
                      setAuction(prev => prev ? {
                        ...prev,
                        lots: prev.lots.map(l => 
                          l.id === lot.id ? { ...l, isWatched } : l
                        )
                      } : null);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Détail du lot sélectionné */}
            <div>
              {selectedLot ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{selectedLot.title}</CardTitle>
                      <Badge variant="outline">
                        Lot #{selectedLot.id}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Images */}
                      <div className="grid grid-cols-2 gap-2">
                        {selectedLot.images.map((image, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`${selectedLot.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Informations du lot */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-gray-600 text-sm">{selectedLot.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Prix de départ</p>
                            <p className="font-semibold">{formatCurrency(selectedLot.startingPrice)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Estimation</p>
                            <p className="font-semibold">
                              {formatCurrency(selectedLot.estimate.min)} - {formatCurrency(selectedLot.estimate.max)}
                            </p>
                          </div>
                        </div>

                        {selectedLot.currentBid > 0 && (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-600">Enchère actuelle</p>
                            <p className="text-2xl font-bold text-green-700">
                              {formatCurrency(selectedLot.currentBid)}
                            </p>
                          </div>
                        )}

                        {/* Actions sur le lot */}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setAuction(prev => prev ? {
                                ...prev,
                                lots: prev.lots.map(l => 
                                  l.id === selectedLot.id ? { ...l, isWatched: !l.isWatched } : l
                                )
                              } : null);
                            }}
                          >
                            {selectedLot.isWatched ? (
                              <>
                                <Heart className="h-4 w-4 fill-red-500 text-red-500 mr-2" />
                                Suivi
                              </>
                            ) : (
                              <>
                                <Heart className="h-4 w-4 mr-2" />
                                Suivre
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Zoom
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Sélectionnez un lot pour voir les détails</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <BidHistory auctionId={auction.id} />
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conditions de vente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Frais de vente</h4>
                    <p className="text-gray-600">25% TTC en sus du prix d'adjudication</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Paiement</h4>
                    <p className="text-gray-600">Comptant le jour de la vente ou sous 7 jours</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Enlèvement</h4>
                    <p className="text-gray-600">Sous 15 jours après la vente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Exposition</h4>
                    <p className="text-gray-600">Du 15 au 17 octobre, 10h-18h</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Expertise</h4>
                    <p className="text-gray-600">Expert agréé disponible sur rendez-vous</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <p className="text-gray-600">+33 1 42 36 78 90</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuctionDetail;
