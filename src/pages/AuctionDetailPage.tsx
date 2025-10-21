import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuctionDetail from '@/components/auction/AuctionDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AuctionDetailPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-estate-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
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
        </div>
        
        <AuctionDetail />
      </main>
      <Footer />
    </div>
  );
};

export default AuctionDetailPage;
