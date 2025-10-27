// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import PropertyDetail from "./pages/PropertyDetail";
import Properties from "./pages/Properties";
import NotFound from "./pages/NotFound";
import Sell from "./pages/Sell";
import Account from "./pages/Account";
import VerificationError from "./pages/VerificationError";
import Borrow from "./pages/Borrow";
import Credit from "./pages/borrow/Credit";
import Assurance from "./pages/borrow/Assurance";
import Capacite from "./pages/borrow/Capacite";
import Mensualites from "./pages/borrow/Mensualites";
import FraisNotaire from "./pages/borrow/FraisNotaire";
import InvestissementLocatif from "./pages/borrow/InvestissementLocatif";
import Auctions from "./pages/Auctions";
import AuctionProperties from "./pages/AuctionProperties";
import CreateAuction from "./pages/CreateAuction";
import AuctionGuide from "./pages/auctions/AuctionGuide";
import AuctionRules from "./pages/auctions/AuctionRules";
import MyAuctions from "./pages/account/MyAuctions";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import AuctionRoomPage from "./pages/auctions/AuctionRoomPage";
import MovingServicesWrapper from "./pages/MovingServices"; // Import the new component
import EditProperty from "./pages/EditProperty"; // Import EditProperty
import MapPage from "./pages/MapPage"; // Import MapPage
import SellAncillaryService from "./pages/SellAncillaryService"; // Import SellAncillaryService
import AncillaryServices from "./pages/AncillaryServices"; // Import AncillaryServices
import { supabase } from "@/lib/api/supabaseClient";
import { useEffect, useState } from "react";
import { CurrencyProvider } from './CurrencyContext';

import { Wrapper } from "@googlemaps/react-wrapper";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication state on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const apiKey = "AIzaSyAjAs9O5AqVbaCZth-QDJm4KJfoq2ZzgUI"; // Replace with your actual API key

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CurrencyProvider>
          <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/sell/ancillary-service" element={<SellAncillaryService />} />
                <Route path="/ancillary-services" element={<AncillaryServices />} />
                <Route path="/moving-services" element={<MovingServicesWrapper />} /> 
                <Route path="/borrow" element={<Borrow />} />
                <Route path="/borrow/credit" element={<Credit />} />
                <Route path="/borrow/assurance" element={<Assurance />} />
                <Route path="/borrow/capacite" element={<Capacite />} />
                <Route path="/borrow/mensualites" element={<Mensualites />} />
                <Route path="/borrow/frais-notaire" element={<FraisNotaire />} />
                <Route path="/borrow/investissement-locatif" element={<InvestissementLocatif />} />
                <Route path="/auctions" element={<AuctionProperties />} />
                <Route path="/create-auction" element={<CreateAuction />} />
                <Route path="/auctions/guide" element={<AuctionGuide />} />
                <Route path="/auctions/rules" element={<AuctionRules />} />
                <Route path="/auctions/room" element={<AuctionRoomPage />} />
                <Route path="/account/auctions" element={<MyAuctions />} />
                <Route path="/auction/:auctionId" element={<AuctionDetailPage />} />
                <Route
                  path="/account"
                  element={<Account />}
                />
                <Route path="/verification-error" element={<VerificationError />} />
                <Route path="/edit-property/:propertyId" element={
                  <Wrapper apiKey={apiKey} libraries={["places"]}>
                    <EditProperty />
                  </Wrapper>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
          </BrowserRouter>
        </CurrencyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
