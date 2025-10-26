
import MissingImagePlaceholder from '@/components/ui/MissingImagePlaceholder';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyGalleryProps {
  images?: string[];
  title?: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="mb-8">
        <div className="rounded-lg overflow-hidden">
          <MissingImagePlaceholder className="w-full h-[500px] object-cover" />
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mb-8">
      <div className="relative rounded-lg overflow-hidden group">
        <img 
          src={images[currentImageIndex]} 
          alt={title}
          className="w-full h-[500px] object-cover cursor-pointer"
          onClick={openModal}
        />
        
        {/* Photo counter */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentImageIndex + 1}/{images.length}
        </div>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      {/* Thumbnail grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`rounded-lg overflow-hidden cursor-pointer transition-all ${
                index === currentImageIndex ? 'ring-2 ring-teal-500' : 'hover:opacity-80'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img 
                src={img} 
                alt={`${title} ${index + 1}`}
                className="w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal for full-size image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black bg-opacity-40 hover:bg-opacity-60 text-white z-10"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            <img 
              src={images[currentImageIndex]} 
              alt={title}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentImageIndex + 1}/{images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
