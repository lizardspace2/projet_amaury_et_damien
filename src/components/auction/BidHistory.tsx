import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Gavel, 
  TrendingUp, 
  Clock, 
  User, 
  Euro,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

interface Bid {
  id: string;
  lotId: string;
  lotTitle: string;
  amount: number;
  bidder: string;
  bidderId: string;
  timestamp: Date;
  isWinning: boolean;
  isOutbid: boolean;
  increment: number;
}

interface BidHistoryProps {
  auctionId: string;
  lotId?: string;
  className?: string;
}

const BidHistory: React.FC<BidHistoryProps> = ({
  auctionId,
  lotId,
  className = ""
}) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [filter, setFilter] = useState<'all' | 'winning' | 'outbid'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Données de démonstration
  useEffect(() => {
    const mockBids: Bid[] = [
      {
        id: '1',
        lotId: '1',
        lotTitle: 'Villa moderne avec piscine - Nice',
        amount: 950000,
        bidder: 'Enchérisseur123',
        bidderId: 'user123',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isWinning: true,
        isOutbid: false,
        increment: 25000
      },
      {
        id: '2',
        lotId: '1',
        lotTitle: 'Villa moderne avec piscine - Nice',
        amount: 925000,
        bidder: 'Acheteur456',
        bidderId: 'user456',
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        isWinning: false,
        isOutbid: true,
        increment: 25000
      },
      {
        id: '3',
        lotId: '1',
        lotTitle: 'Villa moderne avec piscine - Nice',
        amount: 900000,
        bidder: 'Investisseur789',
        bidderId: 'user789',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        isWinning: false,
        isOutbid: true,
        increment: 25000
      },
      {
        id: '4',
        lotId: '3',
        lotTitle: 'Maison de campagne - Provence',
        amount: 520000,
        bidder: 'Collectionneur101',
        bidderId: 'user101',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isWinning: true,
        isOutbid: false,
        increment: 10000
      },
      {
        id: '5',
        lotId: '3',
        lotTitle: 'Maison de campagne - Provence',
        amount: 510000,
        bidder: 'Acheteur202',
        bidderId: 'user202',
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        isWinning: false,
        isOutbid: true,
        increment: 10000
      }
    ];

    setBids(mockBids);
  }, [auctionId, lotId]);

  // Simuler les nouvelles enchères en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newBid: Bid = {
          id: Date.now().toString(),
          lotId: '1',
          lotTitle: 'Villa moderne avec piscine - Nice',
          amount: 950000 + Math.floor(Math.random() * 50000) + 25000,
          bidder: `Enchérisseur${Math.floor(Math.random() * 1000)}`,
          bidderId: `user${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date(),
          isWinning: true,
          isOutbid: false,
          increment: 25000
        };

        setBids(prev => {
          const updated = prev.map(bid => 
            bid.lotId === newBid.lotId ? { ...bid, isWinning: false, isOutbid: true } : bid
          );
          return [newBid, ...updated];
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const filteredBids = bids.filter(bid => {
    if (lotId && bid.lotId !== lotId) return false;
    
    switch (filter) {
      case 'winning': return bid.isWinning;
      case 'outbid': return bid.isOutbid;
      default: return true;
    }
  });

  const getBidStatusColor = (bid: Bid) => {
    if (bid.isWinning) return 'bg-green-100 border-green-200 text-green-800';
    if (bid.isOutbid) return 'bg-red-100 border-red-200 text-red-800';
    return 'bg-gray-100 border-gray-200 text-gray-800';
  };

  const getBidStatusText = (bid: Bid) => {
    if (bid.isWinning) return 'En tête';
    if (bid.isOutbid) return 'Sur-enchéri';
    return 'Enchère';
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Fonctionnalité d'export des enchères
    console.log('Export des enchères...');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-teal-600" />
            Historique des enchères
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Toutes
            </Button>
            <Button
              size="sm"
              variant={filter === 'winning' ? 'default' : 'outline'}
              onClick={() => setFilter('winning')}
            >
              En tête
            </Button>
            <Button
              size="sm"
              variant={filter === 'outbid' ? 'default' : 'outline'}
              onClick={() => setFilter('outbid')}
            >
              Sur-enchéri
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          {filteredBids.length === 0 ? (
            <div className="text-center py-8">
              <Gavel className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'Aucune enchère pour le moment'
                  : `Aucune enchère ${filter === 'winning' ? 'en tête' : 'sur-enchérie'}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBids.map((bid, index) => (
                <div key={bid.id}>
                  <div className={`p-4 rounded-lg border ${getBidStatusColor(bid)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{bid.lotTitle}</h4>
                          <Badge variant="outline" className="text-xs">
                            Lot #{bid.lotId}
                          </Badge>
                        </div>
                        <p className="text-xs opacity-75">
                          Enchérisseur: {bid.bidder}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            bid.isWinning 
                              ? 'bg-green-200 text-green-800' 
                              : bid.isOutbid 
                                ? 'bg-red-200 text-red-800'
                                : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {getBidStatusText(bid)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4" />
                          <span className="text-lg font-bold">
                            {formatCurrency(bid.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs opacity-75">
                          <TrendingUp className="h-3 w-3" />
                          +{formatCurrency(bid.increment)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs opacity-75">
                        <Clock className="h-3 w-3" />
                        {formatTime(bid.timestamp)}
                      </div>
                    </div>
                  </div>
                  {index < filteredBids.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Statistiques */}
        {filteredBids.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-teal-600">
                  {filteredBids.length}
                </p>
                <p className="text-xs text-gray-600">Enchères</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.max(...filteredBids.map(b => b.amount)))}
                </p>
                <p className="text-xs text-gray-600">Plus haute</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(filteredBids.map(b => b.bidderId)).size}
                </p>
                <p className="text-xs text-gray-600">Enchérisseurs</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BidHistory;
