import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuctionRoom from '@/components/auction/AuctionRoom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  MapPin, 
  Home, 
  Euro,
  Users,
  Clock,
  Play,
  Search,
  Filter,
  TrendingUp,
  Award,
  Zap,
  Star,
  Eye,
  Heart,
  Share2,
  Gavel,
  Timer,
  Building2,
  Sparkles,
  Plus,
  Bell
} from 'lucide-react';
import MapModal from '@/components/MapModal';
import ViewOnMapButton from '@/components/ViewOnMapButton';

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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    featured: true,
    pricePerM2: 3750,
    views: 1240,
    likes: 89
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    featured: false,
    pricePerM2: 9176,
    views: 892,
    likes: 67
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
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    featured: false,
    pricePerM2: 1778,
    views: 456,
    likes: 34
  },
  {
    id: '4',
    title: 'Loft industriel rénové - Lyon',
    currentBid: 280000,
    startingBid: 200000,
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 heure
    bidIncrement: 2000,
    image: '/api/placeholder/400/300',
    location: 'Lyon 3ème',
    rooms: '3 pièces',
    surface: '95 m²',
    participants: 45,
    status: 'live' as const,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    featured: true,
    pricePerM2: 2947,
    views: 678,
    likes: 52
  },
  {
    id: '5',
    title: 'Château historique - Dordogne',
    currentBid: 1200000,
    startingBid: 800000,
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 heures
    bidIncrement: 25000,
    image: '/api/placeholder/400/300',
    location: 'Périgueux, Dordogne',
    rooms: '12 pièces',
    surface: '450 m²',
    participants: 234,
    status: 'live' as const,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    featured: true,
    pricePerM2: 2667,
    views: 2156,
    likes: 178
  },
  {
    id: '6',
    title: 'Penthouse avec terrasse - Monaco',
    currentBid: 2500000,
    startingBid: 1800000,
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 heures
    bidIncrement: 50000,
    image: '/api/placeholder/400/300',
    location: 'Monaco',
    rooms: '3 pièces',
    surface: '120 m²',
    participants: 89,
    status: 'live' as const,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    featured: false,
    pricePerM2: 20833,
    views: 3456,
    likes: 234
  }
];

// Composant pour les enchères vedettes
const FeaturedAuctionCard = ({ auction, onSelect, formatCurrency, formatTimeLeft }: any) => (
  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-yellow-200 hover:border-yellow-300 bg-gradient-to-br from-white to-yellow-50">
    <div className="relative">
      <img
        src={auction.image}
        alt={auction.title}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute top-4 left-4 flex gap-2">
        <Badge className="bg-red-500 text-white animate-pulse">
          <Play className="h-3 w-3 mr-1" />
          En direct
        </Badge>
        <Badge className="bg-yellow-500 text-black">
          <Star className="h-3 w-3 mr-1" />
          Vedette
        </Badge>
      </div>
      <div className="absolute top-4 right-4 flex gap-2">
        <Badge variant="secondary" className="bg-white/90">
          <Users className="h-3 w-3 mr-1" />
          {auction.participants}
        </Badge>
        <Badge variant="secondary" className="bg-white/90">
          <Eye className="h-3 w-3 mr-1" />
          {auction.views}
        </Badge>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">{auction.title}</h3>
        <div className="flex items-center gap-1 text-yellow-200">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{auction.location}</span>
        </div>
      </div>
    </div>
    
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-600">Enchère actuelle</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(auction.currentBid)}
            </p>
            <p className="text-xs text-slate-500">
              {formatCurrency(auction.pricePerM2)}/m²
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Temps restant</p>
            <p className="text-lg font-bold text-orange-600 flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {formatTimeLeft(auction.endTime)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              {auction.rooms}
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {auction.surface}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {auction.likes}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(auction.id);
            }}
          >
            <Play className="h-4 w-4 mr-2" />
            Rejoindre l'enchère
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant pour les enchères régulières
const RegularAuctionCard = ({ auction, onSelect, formatCurrency, formatTimeLeft }: any) => (
  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
    <div className="relative">
      <img
        src={auction.image}
        alt={auction.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-3 left-3 flex gap-2">
        <Badge className="bg-red-500 text-white animate-pulse">
          <Play className="h-3 w-3 mr-1" />
          En direct
        </Badge>
      </div>
      <div className="absolute top-3 right-3">
        <Badge variant="secondary" className="bg-white/90">
          <Users className="h-3 w-3 mr-1" />
          {auction.participants}
        </Badge>
      </div>
    </div>
    
    <CardHeader className="pb-3">
      <CardTitle className="text-lg line-clamp-2 group-hover:text-teal-600 transition-colors">
        {auction.title}
      </CardTitle>
      <div className="flex items-center gap-1 text-sm text-slate-600">
        <MapPin className="h-4 w-4" />
        {auction.location}
      </div>
    </CardHeader>
    
    <CardContent className="pt-0">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-600">Enchère actuelle</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(auction.currentBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Temps restant</p>
            <p className="font-semibold text-orange-600">
              {formatTimeLeft(auction.endTime)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            {auction.rooms}
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {auction.surface}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {auction.likes}
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(auction.id);
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          Rejoindre l'enchère
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Auctions = () => {
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('endTime');
  const [priceRange, setPriceRange] = useState('all');
  const [location, setLocation] = useState('all');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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

  const filteredAuctions = mockAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auction.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'low' && auction.currentBid < 500000) ||
      (priceRange === 'medium' && auction.currentBid >= 500000 && auction.currentBid < 1000000) ||
      (priceRange === 'high' && auction.currentBid >= 1000000);
    
    const matchesLocation = location === 'all' || 
      auction.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesPrice && matchesLocation;
  });

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.currentBid - a.currentBid;
      case 'participants':
        return b.participants - a.participants;
      case 'endTime':
        return a.endTime.getTime() - b.endTime.getTime();
      default:
        return 0;
    }
  });

  const featuredAuctions = sortedAuctions.filter(auction => auction.featured);
  const regularAuctions = sortedAuctions.filter(auction => !auction.featured);

  const selectedAuctionData = mockAuctions.find(auction => auction.id === selectedAuction);

  // Convertir les enchères en propriétés pour la carte
  const auctionProperties = mockAuctions.map(auction => ({
    id: auction.id,
    title: auction.title,
    price: auction.currentBid,
    address_city: auction.location,
    lat: getLatitudeFromLocation(auction.location),
    lng: getLongitudeFromLocation(auction.location),
    listing_type: 'auction' as const,
    property_type: 'house' as const,
    m2: parseInt(auction.surface),
    beds: parseInt(auction.rooms),
    baths: 2,
    images: [auction.image]
  }));

  // Fonctions pour obtenir les coordonnées (simulation)
  function getLatitudeFromLocation(location: string): number {
    const locations: { [key: string]: number } = {
      'Nice, Alpes-Maritimes': 43.7102,
      'Paris 16ème': 48.8566,
      'Aix-en-Provence': 43.5297,
      'Lyon 3ème': 45.7640,
      'Périgueux, Dordogne': 45.1885,
      'Monaco': 43.7384
    };
    return locations[location] || 46.2276;
  }

  function getLongitudeFromLocation(location: string): number {
    const locations: { [key: string]: number } = {
      'Nice, Alpes-Maritimes': 7.2620,
      'Paris 16ème': 2.3522,
      'Aix-en-Provence': 5.4474,
      'Lyon 3ème': 4.8357,
      'Périgueux, Dordogne': 0.7182,
      'Monaco': 7.4246
    };
    return locations[location] || 2.2137;
  }

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gavel className="h-8 w-8 text-yellow-300" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                Ventes aux enchères
              </h1>
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-xl md:text-2xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Découvrez des biens immobiliers exceptionnels et participez aux enchères en temps réel
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">{mockAuctions.length}</div>
                <div className="text-sm text-teal-100">Enchères en cours</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">
                  {mockAuctions.reduce((sum, auction) => sum + auction.participants, 0)}
                </div>
                <div className="text-sm text-teal-100">Participants actifs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">
                  {formatCurrency(Math.max(...mockAuctions.map(a => a.currentBid)))}
                </div>
                <div className="text-sm text-teal-100">Enchère la plus élevée</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">100%</div>
                <div className="text-sm text-teal-100">Sécurisé</div>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3">
              <Link to="/create-auction" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Créer une enchère
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Rechercher par titre ou localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endTime">Temps restant</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="participants">Participants</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue placeholder="Prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  <SelectItem value="low">- 500k€</SelectItem>
                  <SelectItem value="medium">500k€ - 1M€</SelectItem>
                  <SelectItem value="high">+ 1M€</SelectItem>
                </SelectContent>
              </Select>
              <ViewOnMapButton
                onClick={() => setIsMapModalOpen(true)}
                size="lg"
              />
              <Button variant="outline" className="h-12 px-6">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="live" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Play className="h-4 w-4 mr-2" />
              En direct
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Calendar className="h-4 w-4 mr-2" />
              À venir
            </TabsTrigger>
            <TabsTrigger value="ended" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Clock className="h-4 w-4 mr-2" />
              Terminées
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-8">
            {/* Featured Auctions */}
            {featuredAuctions.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-slate-800">Enchères vedettes</h2>
                  <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredAuctions.map((auction) => (
                    <FeaturedAuctionCard key={auction.id} auction={auction} onSelect={setSelectedAuction} formatCurrency={formatCurrency} formatTimeLeft={formatTimeLeft} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Auctions */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Toutes les enchères</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {regularAuctions.map((auction) => (
                  <RegularAuctionCard 
                    key={auction.id} 
                    auction={auction} 
                    onSelect={setSelectedAuction} 
                    formatCurrency={formatCurrency} 
                    formatTimeLeft={formatTimeLeft} 
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-8">
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-lg">
                <Calendar className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Aucune enchère à venir
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Les prochaines enchères seront bientôt annoncées. Restez connecté pour ne rien manquer !
              </p>
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <Bell className="h-4 w-4 mr-2" />
                M'alerter des nouvelles enchères
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ended" className="mt-8">
            <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200">
              <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-lg">
                <Clock className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Aucune enchère terminée
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                L'historique des enchères terminées apparaîtra ici pour consultation.
              </p>
              <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50">
                <TrendingUp className="h-4 w-4 mr-2" />
                Voir les statistiques
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Modal de la carte */}
      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        properties={auctionProperties}
        onPropertyClick={(property) => {
          // Rediriger vers l'enchère sélectionnée
          setSelectedAuction(property.id);
        }}
        title="Enchères sur la carte"
      />
      
      <Footer />
    </div>
  );
};

export default Auctions;
