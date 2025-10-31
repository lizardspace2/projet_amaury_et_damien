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
import Profile from "./pages/account/Profile"; // Import Profile
import MyAds from "./pages/account/MyAds"; // Import MyAds
import Subscription from "./pages/account/Subscription";
import BillingSuccess from "./pages/billing/Success";
import BillingCancel from "./pages/billing/Cancel";
import Resources from "./pages/Resources"; // Import Resources
import { CurrencyProvider } from './CurrencyContext';
import { AuthProvider } from './AuthContext';

// Import des pages de ressources
import SimulateurRemere from "./pages/resources/SimulateurRemere";
import SimulateurVEFA from "./pages/resources/SimulateurVEFA";
import SimulateurVenteTerme from "./pages/resources/SimulateurVenteTerme";
import SimulateurRemereInverse from "./pages/resources/SimulateurRemereInverse";
import SimulateurViager from "./pages/resources/SimulateurViager";
import SimulateurBail from "./pages/resources/SimulateurBail";
import SimulateurEncheres from "./pages/resources/SimulateurEncheres";
import SimulateurBiensException from "./pages/resources/SimulateurBiensException";
import SimulateurIndivision from "./pages/resources/SimulateurIndivision";
import SimulateurBRS from "./pages/resources/SimulateurBRS";
import SimulateurDemenbrement from "./pages/resources/SimulateurDemenbrement";
import SimulateurCreditVendeur from "./pages/resources/SimulateurCreditVendeur";
import SimulateurCopropriete from "./pages/resources/SimulateurCopropriete";
import GuideRemere from "./pages/resources/GuideRemere";
import GuideVEFA from "./pages/resources/GuideVEFA";
import GuideVenteTerme from "./pages/resources/GuideVenteTerme";
import GuideRemereInverse from "./pages/resources/GuideRemereInverse";
import GuideViager from "./pages/resources/GuideViager";
import GuideBail from "./pages/resources/GuideBail";
import GuideEncheres from "./pages/resources/GuideEncheres";
import GuideBiensException from "./pages/resources/GuideBiensException";
import GuideIndivision from "./pages/resources/GuideIndivision";
import GuideBRS from "./pages/resources/GuideBRS";
import GuideDemenbrement from "./pages/resources/GuideDemenbrement";
import GuideCreditVendeur from "./pages/resources/GuideCreditVendeur";
import GuideCopropriete from "./pages/resources/GuideCopropriete";

import { Wrapper } from "@googlemaps/react-wrapper";

const queryClient = new QueryClient();

const App = () => {
  const apiKey = "AIzaSyAjAs9O5AqVbaCZth-QDJm4KJfoq2ZzgUI"; // Replace with your actual API key

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
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
                <Route path="/account" element={<Account />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="myads" element={<MyAds />} />
                  <Route path="subscription" element={<Subscription />} />
                  <Route index element={<MyAds />} />
                </Route>
                <Route path="/billing/success" element={<BillingSuccess />} />
                <Route path="/billing/cancel" element={<BillingCancel />} />
                <Route path="/verification-error" element={<VerificationError />} />
                <Route path="/edit-property/:propertyId" element={
                  <Wrapper apiKey={apiKey} libraries={["places"]}>
                    <EditProperty />
                  </Wrapper>
                } />
                {/* Routes des ressources */}
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/simulateur-remere" element={<SimulateurRemere />} />
                <Route path="/resources/simulateur-vefa" element={<SimulateurVEFA />} />
                <Route path="/resources/simulateur-vente-terme" element={<SimulateurVenteTerme />} />
                <Route path="/resources/simulateur-remere-inverse" element={<SimulateurRemereInverse />} />
                <Route path="/resources/simulateur-viager" element={<SimulateurViager />} />
                <Route path="/resources/simulateur-bail" element={<SimulateurBail />} />
                <Route path="/resources/simulateur-encheres" element={<SimulateurEncheres />} />
                <Route path="/resources/simulateur-biens-exception" element={<SimulateurBiensException />} />
                <Route path="/resources/simulateur-indivision" element={<SimulateurIndivision />} />
                <Route path="/resources/simulateur-brs" element={<SimulateurBRS />} />
                <Route path="/resources/simulateur-demenbrement" element={<SimulateurDemenbrement />} />
                <Route path="/resources/simulateur-credit-vendeur" element={<SimulateurCreditVendeur />} />
                <Route path="/resources/simulateur-copropriete" element={<SimulateurCopropriete />} />
                <Route path="/resources/guide-remere" element={<GuideRemere />} />
                <Route path="/resources/guide-vefa" element={<GuideVEFA />} />
                <Route path="/resources/guide-vente-terme" element={<GuideVenteTerme />} />
                <Route path="/resources/guide-remere-inverse" element={<GuideRemereInverse />} />
                <Route path="/resources/guide-viager" element={<GuideViager />} />
                <Route path="/resources/guide-bail" element={<GuideBail />} />
                <Route path="/resources/guide-encheres" element={<GuideEncheres />} />
                <Route path="/resources/guide-biens-exception" element={<GuideBiensException />} />
                <Route path="/resources/guide-indivision" element={<GuideIndivision />} />
                <Route path="/resources/guide-brs" element={<GuideBRS />} />
                <Route path="/resources/guide-demenbrement" element={<GuideDemenbrement />} />
                <Route path="/resources/guide-credit-vendeur" element={<GuideCreditVendeur />} />
                <Route path="/resources/guide-copropriete" element={<GuideCopropriete />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CurrencyProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
