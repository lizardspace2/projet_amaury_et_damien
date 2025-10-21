import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuctionRoom from '@/components/auction/AuctionRoom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Home, 
  Euro,
  Users,
  Clock,
  Play
} from 'lucide-react';

// Données de démonstration pour les enchères
const mockAuctions = [
  {
    id: '1',
    title: 'Villa moderne avec piscine - Nice',
    currentBid: 450000,
    startingBid: 300000,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 heures
    bidIncrement: 5000,
    image: '/api/placeholder/400/300',
    location: 'Nice, Alpes-Maritimes',
    rooms: '5 pièces',
    surface: '120 m²',
    participants: 156,
    status: 'live' as const,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: '2',
    title: 'Appartement haussmannien - Paris 16ème',
    currentBid: 780000,
    startingBid: 600000,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 heures
    bidIncrement: 10000,
    image: '/api/placeholder/400/300',
    location: 'Paris 16ème',
    rooms: '4 pièces',
    surface: '85 m²',
    participants: 89,
    status: 'live' as const,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: '3',
    title: 'Maison de campagne - Provence',
    currentBid: 320000,
    startingBid: 250000,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 heures
    bidIncrement: 2500,
    image: '/api/placeholder/400/300',
    location: 'Aix-en-Provence',
    rooms: '6 pièces',
    surface: '180 m²',
    participants: 67,
    status: 'live' as const,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  }
];

const Auctions = () => {
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatTimeLeft = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Terminé';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const selectedAuctionData = mockAuctions.find(auction => auction.id === selectedAuction);

  if (selectedAuctionData) {
    return (
      <div className="flex flex-col min-h-screen bg-estate-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedAuction(null)}
              className="mb-4"
            >
              ← Retour aux enchères
            </Button>
            <h1 className="text-3xl font-bold">Salle d'enchères digitale</h1>
          </div>
          
          <AuctionRoom
            auctionId={selectedAuctionData.id}
            propertyTitle={selectedAuctionData.title}
            currentBid={selectedAuctionData.currentBid}
            startingBid={selectedAuctionData.startingBid}
            endTime={selectedAuctionData.endTime}
            bidIncrement={selectedAuctionData.bidIncrement}
            streamUrl={selectedAuctionData.streamUrl}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-estate-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ventes aux enchères</h1>
            <p className="text-gray-600">
              Participez aux enchères immobilières en temps réel
            </p>
          </div>
          <Button asChild>
            <Link to="/create-auction">Créer une enchère</Link>
          </Button>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="live">En direct</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="ended">Terminées</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockAuctions.map((auction) => (
                <Card 
                  key={auction.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedAuction(auction.id)}
                >
                  <div className="relative">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      variant="destructive" 
                      className="absolute top-2 left-2 animate-pulse"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      En direct
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {auction.participants}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {auction.title}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {auction.location}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Enchère actuelle</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(auction.currentBid)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Temps restant</p>
                          <p className="font-semibold text-orange-600">
                            {formatTimeLeft(auction.endTime)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Home className="h-4 w-4" />
                          {auction.rooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {auction.surface}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAuction(auction.id);
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Rejoindre l'enchère
                      </Button>
                      <Button 
                        asChild
                        variant="outline"
                        className="w-full mt-2"
                      >
                        <Link to={`/auction/${auction.id}`}>
                          Voir les détails
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Aucune enchère à venir
              </h3>
              <p className="text-gray-500">
                Les prochaines enchères seront bientôt annoncées
              </p>
            </div>
          </TabsContent>

          <TabsContent value="ended" className="mt-6">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Aucune enchère terminée
              </h3>
              <p className="text-gray-500">
                L'historique des enchères terminées apparaîtra ici
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Auctions;
