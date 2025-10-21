import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gavel, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Euro,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const MyAuctions = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Données de démonstration
  const myAuctions = {
    active: [
      {
        id: '1',
        title: 'Villa moderne avec piscine - Nice',
        startingBid: 300000,
        currentBid: 450000,
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        participants: 156,
        status: 'live',
        image: '/api/placeholder/300/200'
      },
      {
        id: '2',
        title: 'Appartement haussmannien - Paris',
        startingBid: 600000,
        currentBid: 780000,
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        participants: 89,
        status: 'live',
        image: '/api/placeholder/300/200'
      }
    ],
    ended: [
      {
        id: '3',
        title: 'Maison de campagne - Provence',
        startingBid: 250000,
        finalBid: 320000,
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        participants: 67,
        status: 'sold',
        winner: 'Enchérisseur123',
        image: '/api/placeholder/300/200'
      }
    ],
    drafts: [
      {
        id: '4',
        title: 'Loft industriel - Lyon',
        startingBid: 400000,
        status: 'draft',
        createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        image: '/api/placeholder/300/200'
      }
    ]
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge variant="destructive" className="animate-pulse">En direct</Badge>;
      case 'sold':
        return <Badge variant="default" className="bg-green-500">Vendu</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'sold':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-estate-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes enchères</h1>
            <p className="text-gray-600">
              Gérez vos ventes aux enchères et suivez leur progression
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
            <Link to="/create-auction" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer une enchère
            </Link>
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myAuctions.active.length}</p>
                  <p className="text-sm text-gray-600">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myAuctions.ended.length}</p>
                  <p className="text-sm text-gray-600">Terminées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-gray-100">
                  <Edit className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myAuctions.drafts.length}</p>
                  <p className="text-sm text-gray-600">Brouillons</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Euro className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(myAuctions.ended.reduce((sum, auction) => sum + auction.finalBid, 0))}
                  </p>
                  <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="ended">Terminées</TabsTrigger>
            <TabsTrigger value="drafts">Brouillons</TabsTrigger>
          </TabsList>

          {/* Enchères en cours */}
          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myAuctions.active.map((auction) => (
                <Card key={auction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(auction.status)}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {auction.participants}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{auction.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
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
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                          <Link to={`/auctions/${auction.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Voir
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Enchères terminées */}
          <TabsContent value="ended" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myAuctions.ended.map((auction) => (
                <Card key={auction.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(auction.status)}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{auction.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Prix de vente</p>
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(auction.finalBid)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Gagnant</p>
                          <p className="font-semibold">{auction.winner}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                          <Link to={`/auctions/${auction.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Voir les détails
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Brouillons */}
          <TabsContent value="drafts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myAuctions.drafts.map((auction) => (
                <Card key={auction.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(auction.status)}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{auction.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Créé le {auction.createdDate.toLocaleDateString('fr-FR')}
                    </p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Mise de départ</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(auction.startingBid)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                          <Link to={`/create-auction?edit=${auction.id}`} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Modifier
                          </Link>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Message si aucune enchère */}
        {Object.values(myAuctions).every(auctions => auctions.length === 0) && (
          <div className="text-center py-12">
            <Gavel className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune enchère pour le moment
            </h3>
            <p className="text-gray-500 mb-6">
              Créez votre première enchère pour commencer à vendre vos biens
            </p>
            <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
              <Link to="/create-auction" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Créer ma première enchère
              </Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyAuctions;
