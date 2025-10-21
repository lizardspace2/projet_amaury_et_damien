import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuctionRoom from '@/components/auction/AuctionRoom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Clock, Gavel } from 'lucide-react';

const AuctionRoomPage = () => {
  const [selectedAuction, setSelectedAuction] = useState<string | null>('1');

  // Données de démonstration pour les enchères en cours
  const liveAuctions = [
    {
      id: '1',
      title: 'Villa moderne avec piscine - Nice',
      currentBid: 450000,
      startingBid: 300000,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 heures
      bidIncrement: 5000,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      participants: 156,
      status: 'live'
    },
    {
      id: '2',
      title: 'Appartement haussmannien - Paris 16ème',
      currentBid: 780000,
      startingBid: 600000,
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 heures
      bidIncrement: 10000,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      participants: 89,
      status: 'live'
    },
    {
      id: '3',
      title: 'Maison de campagne - Provence',
      currentBid: 320000,
      startingBid: 250000,
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 heures
      bidIncrement: 2500,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      participants: 67,
      status: 'live'
    }
  ];

  const selectedAuctionData = liveAuctions.find(auction => auction.id === selectedAuction);

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

  return (
    <div className="flex flex-col min-h-screen bg-estate-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            asChild
            className="mb-4"
          >
            <Link to="/auctions" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux enchères
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Salle d'enchères digitale</h1>
              <p className="text-gray-600">
                Participez aux enchères en temps réel avec flux vidéo
              </p>
            </div>
            <Badge variant="destructive" className="animate-pulse">
              <Users className="h-3 w-3 mr-1" />
              {liveAuctions.reduce((sum, auction) => sum + auction.participants, 0)} participants
            </Badge>
          </div>
        </div>

        {selectedAuctionData ? (
          <AuctionRoom
            auctionId={selectedAuctionData.id}
            propertyTitle={selectedAuctionData.title}
            currentBid={selectedAuctionData.currentBid}
            startingBid={selectedAuctionData.startingBid}
            endTime={selectedAuctionData.endTime}
            bidIncrement={selectedAuctionData.bidIncrement}
            streamUrl={selectedAuctionData.streamUrl}
          />
        ) : (
          <div className="text-center py-12">
            <Gavel className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune enchère en cours
            </h3>
            <p className="text-gray-500 mb-6">
              Revenez plus tard pour participer aux prochaines enchères
            </p>
            <Button asChild>
              <Link to="/auctions">Voir toutes les enchères</Link>
            </Button>
          </div>
        )}

        {/* Liste des autres enchères en cours */}
        {liveAuctions.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Autres enchères en cours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveAuctions
                .filter(auction => auction.id !== selectedAuction)
                .map((auction) => (
                <Card 
                  key={auction.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedAuction(auction.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg line-clamp-2">
                        {auction.title}
                      </CardTitle>
                      <Badge variant="destructive" className="animate-pulse">
                        En direct
                      </Badge>
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
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {auction.participants} participants
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTimeLeft(auction.endTime)}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAuction(auction.id);
                        }}
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Rejoindre cette enchère
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AuctionRoomPage;
