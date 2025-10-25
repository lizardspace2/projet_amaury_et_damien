import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewOnMapButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  children?: React.ReactNode;
}

const ViewOnMapButton = ({ 
  onClick, 
  className = "",
  size = 'md',
  variant = 'outline',
  children = "Voir sur la carte"
}: ViewOnMapButtonProps) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const baseClasses = "flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200";

  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
    >
      <MapPin className="h-4 w-4" />
      {children}
    </Button>
  );
};

export default ViewOnMapButton;
