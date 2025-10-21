import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Gavel, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Heart,
  Share2,
  Bell,
  Settings
} from 'lucide-react';
import VideoStream from './VideoStream';
import AuctionTimer from './AuctionTimer';

interface Bid {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
  isWinning?: boolean;
}

interface AuctionRoomProps {
  auctionId: string;
  propertyTitle: string;
  currentBid: number;
  startingBid: number;
  endTime: Date;
  bidIncrement: number;
  streamUrl?: string;
  className?: string;
}

const AuctionRoom: React.FC<AuctionRoomProps> = ({
  auctionId,
  propertyTitle,
  currentBid,
  startingBid,
  endTime,
  bidIncrement,
  streamUrl,
  className = ""
}) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isBidding, setIsBidding] = useState(false);
  const [participantCount, setParticipantCount] = useState(156);
  const [isWatching, setIsWatching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Simuler des enchères en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && bids.length < 20) {
        const newBid: Bid = {
          id: Date.now().toString(),
          amount: currentBid + bidIncrement + Math.floor(Math.random() * bidIncrement * 2),
          bidder: `Enchérisseur ${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date(),
          isWinning: true
        };
        
        setBids(prev => {
          const updated = prev.map(bid => ({ ...bid, isWinning: false }));
          return [newBid, ...updated].slice(0, 20);
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bids.length, currentBid, bidIncrement]);

  const handleBid = async () => {
    const amount = parseFloat(bidAmount);
    if (amount <= currentBid) {
      alert('Votre enchère doit être supérieure à l\'enchère actuelle');
      return;
    }

    setIsBidding(true);
    
    // Simuler l'envoi de l'enchère
    setTimeout(() => {
      const newBid: Bid = {
        id: Date.now().toString(),
        amount,
        bidder: 'Vous',
        timestamp: new Date(),
        isWinning: true
      };
      
      setBids(prev => {
        const updated = prev.map(bid => ({ ...bid, isWinning: false }));
        return [newBid, ...updated].slice(0, 20);
      });
      
      setBidAmount('');
      setIsBidding(false);
    }, 1000);
  };

  const handleQuickBid = (increment: number) => {
    const newAmount = currentBid + increment;
    setBidAmount(newAmount.toString());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleTimeWarning = (timeLeft: number) => {
    // Notification ou action quand il reste peu de temps
    console.log(`Attention: ${timeLeft} secondes restantes`);
  };

  const handleTimeUp = () => {
    console.log('Enchère terminée !');
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {/* Colonne principale - Vidéo et informations */}
      <div className="lg:col-span-2 space-y-6">
        {/* Flux vidéo */}
        <VideoStream
          streamUrl={streamUrl}
          title={propertyTitle}
          isLive={true}
          className="w-full"
        />

        {/* Informations de l'enchère */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{propertyTitle}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {participantCount} participants
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsWatching(!isWatching)}
                >
                  {isWatching ? <Heart className="h-4 w-4 fill-red-500 text-red-500" /> : <Heart className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Enchère actuelle</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(currentBid)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mise de départ</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(startingBid)}
                </p>
              </div>
            </div>

            {/* Zone d'enchère */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">Faire une enchère</h3>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Montant de votre enchère"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleBid}
                  disabled={isBidding || !bidAmount}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isBidding ? 'Envoi...' : 'Enchérir'}
                </Button>
              </div>

              {/* Enchères rapides */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickBid(bidIncrement)}
                >
                  +{formatCurrency(bidIncrement)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickBid(bidIncrement * 2)}
                >
                  +{formatCurrency(bidIncrement * 2)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickBid(bidIncrement * 5)}
                >
                  +{formatCurrency(bidIncrement * 5)}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Colonne latérale - Timer et historique */}
      <div className="space-y-6">
        {/* Timer */}
        <AuctionTimer
          endTime={endTime}
          onTimeUp={handleTimeUp}
          onWarning={handleTimeWarning}
          warningThreshold={300}
          isPaused={isPaused}
          onPauseToggle={() => setIsPaused(!isPaused)}
        />

        {/* Historique des enchères */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Historique des enchères
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {bids.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucune enchère pour le moment
                  </p>
                ) : (
                  bids.map((bid) => (
                    <div
                      key={bid.id}
                      className={`p-3 rounded-lg border ${
                        bid.isWinning 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(bid.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {bid.bidder}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {bid.timestamp.toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {bid.isWinning && (
                            <Badge variant="default" className="text-xs">
                              En tête
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat en direct */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5" />
              Chat en direct
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 mb-4">
              <div className="space-y-2">
                <div className="p-2 bg-blue-50 rounded">
                  <p className="text-sm">
                    <span className="font-semibold">Enchérisseur123:</span> Belle propriété !
                  </p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-sm">
                    <span className="font-semibold">Acheteur456:</span> Quel est l'état du toit ?
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <p className="text-sm">
                    <span className="font-semibold">Agent789:</span> Le toit a été refait en 2020
                  </p>
                </div>
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Tapez votre message..."
                className="flex-1"
              />
              <Button size="sm">Envoyer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuctionRoom;
