import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface ViewOnMapButtonProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  children?: React.ReactNode;
  listingType?: string;
}

const ViewOnMapButton = ({ 
  onClick, 
  className = "",
  size = 'md',
  variant = 'outline',
  children = "Voir sur la carte",
  listingType
}: ViewOnMapButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Construire l'URL avec les paramètres de la page actuelle
      const searchParams = new URLSearchParams(location.search);
      const mapUrl = listingType ? `/map?type=${listingType}` : '/map';
      navigate(mapUrl);
    }
  };
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const baseClasses = "flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200";

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
    >
      <MapPin className="h-4 w-4" />
      {children}
    </Button>
  );
};

export default ViewOnMapButton;
