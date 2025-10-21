import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Eye, 
  Euro, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

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

interface LotCardProps {
  lot: Lot;
  isSelected?: boolean;
  onClick?: () => void;
  onWatchToggle?: (isWatched: boolean) => void;
  onZoom?: () => void;
  className?: string;
}

const LotCard: React.FC<LotCardProps> = ({
  lot,
  isSelected = false,
  onClick,
  onWatchToggle,
  onZoom,
  className = ""
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'active': return 'bg-red-500';
      case 'sold': return 'bg-green-500';
      case 'passed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'active': return 'En cours';
      case 'sold': return 'Vendu';
      case 'passed': return 'Non vendu';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-3 w-3" />;
      case 'active': return <Play className="h-3 w-3" />;
      case 'sold': return <CheckCircle className="h-3 w-3" />;
      case 'passed': return <Pause className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const handleWatchToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatchToggle?.(!lot.isWatched);
  };

  const handleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    onZoom?.();
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-teal-500 bg-teal-50' : 'hover:bg-gray-50'
      } ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image du lot */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <img
              src={lot.images[0]}
              alt={lot.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-1 left-1">
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(lot.status)} text-white text-xs px-2 py-1`}
              >
                {getStatusIcon(lot.status)}
                <span className="ml-1">{getStatusText(lot.status)}</span>
              </Badge>
            </div>
            {lot.isWatched && (
              <div className="absolute top-1 right-1">
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </div>
            )}
          </div>

          {/* Contenu du lot */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                {lot.title}
              </h3>
              <Badge variant="outline" className="ml-2 text-xs">
                #{lot.id}
              </Badge>
            </div>

            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
              {lot.description}
            </p>

            {/* Informations financières */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Départ:</span>
                <span className="font-semibold">{formatCurrency(lot.startingPrice)}</span>
              </div>
              
              {lot.currentBid > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Actuel:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(lot.currentBid)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Estimation:</span>
                <span className="text-gray-600">
                  {formatCurrency(lot.estimate.min)} - {formatCurrency(lot.estimate.max)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 mt-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleWatchToggle}
                className={`h-6 px-2 text-xs ${
                  lot.isWatched 
                    ? 'text-red-600 hover:text-red-700' 
                    : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                <Heart className={`h-3 w-3 mr-1 ${lot.isWatched ? 'fill-current' : ''}`} />
                {lot.isWatched ? 'Suivi' : 'Suivre'}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleZoom}
                className="h-6 px-2 text-xs text-gray-600 hover:text-gray-700"
              >
                <Eye className="h-3 w-3 mr-1" />
                Zoom
              </Button>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires pour les lots sélectionnés */}
        {isSelected && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-xs">
              {lot.dimensions && (
                <div>
                  <span className="text-gray-500">Dimensions:</span>
                  <p className="font-medium">{lot.dimensions}</p>
                </div>
              )}
              {lot.condition && (
                <div>
                  <span className="text-gray-500">État:</span>
                  <p className="font-medium">{lot.condition}</p>
                </div>
              )}
              {lot.provenance && (
                <div className="col-span-2">
                  <span className="text-gray-500">Provenance:</span>
                  <p className="font-medium">{lot.provenance}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LotCard;
