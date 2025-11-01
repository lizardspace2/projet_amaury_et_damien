import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Home, Key, Users, CalendarDays, LogIn, LogOut, UserPlus, PlusCircle, Truck, Building, Search, Phone, MapPin, BookOpen, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { signInWithEmail, signUpWithEmail, signOut } from '@/lib/api/auth';
import { supabase } from '@/lib/api/supabaseClient';
import { useAuth } from '@/AuthContext';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { startProUpgradeCheckout } from '@/lib/billing';

const Logo = () => (
  <Link to="/" className="flex items-center gap-3 text-xl font-bold text-slate-900 no-underline group">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
      <Building className="h-8 w-8 text-teal-600 relative z-10" />
    </div>
    <div className="flex flex-col">
      <span className="font-serif text-2xl leading-tight bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
        Trocadimmo
      </span>
      <span className="text-xs font-medium text-slate-500 leading-tight tracking-wide">
        RÉGION LYONNAISE
      </span>
    </div>
  </Link>
);

const MobileLogo = () => (
  <Link to="/" className="flex items-center gap-2 text-slate-900 no-underline group flex-shrink-0">
    <Building className="h-6 w-6 text-teal-600" />
    <div className="flex flex-col">
      <span className="font-serif text-lg leading-tight bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
        Trocadimmo
      </span>
      <span className="text-xs font-medium text-slate-500 leading-tight">
        Lyon
      </span>
    </div>
  </Link>
);

const NavLink = ({ to, children, onClick, isActive }: { to: string; children: React.ReactNode; onClick?: () => void; isActive: boolean }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group relative flex items-center text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg no-underline",
        isActive 
          ? "text-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 shadow-sm" 
          : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
      )}
    >
      {children}
    </Link>
  );
};

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'> & { description?: string }>(({ className, title, children, description, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'flex items-start gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-slate-50 hover:shadow-sm border border-transparent hover:border-slate-200 group cursor-pointer',
            className
          )}
          {...props}
        >
          <div className="space-y-1">
            <div className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
              {title}
            </div>
            <p className="text-sm leading-snug text-slate-600 line-clamp-2">
              {description || children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = 'ListItem'

// Composants pour les étapes d'inscription
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center justify-center space-x-2 mb-6">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          i + 1 <= currentStep
            ? 'bg-teal-500 text-white'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        {i + 1}
      </div>
    ))}
  </div>
);

const Step1 = ({ formData, handleInputChange, onEnterKey }: { formData: any; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onEnterKey?: () => void }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnterKey) {
      e.preventDefault();
      onEnterKey();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="votre@email.com" 
          value={formData.email} 
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-11"
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
        <Input 
          id="password" 
          type="password" 
          placeholder="Votre mot de passe" 
          value={formData.password} 
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-11"
          required 
        />
      </div>
    </div>
  );
};

const Step2 = ({ formData, handleInputChange, setFormData, onEnterKey }: { formData: any; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; setFormData: React.Dispatch<React.SetStateAction<any>>; onEnterKey?: () => void }) => {
  const showProfessionalFields = formData.user_type === 'Professionnelle' || formData.user_type === 'Partenaire';
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnterKey) {
      e.preventDefault();
      onEnterKey();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="+33 1 23 45 67 89" 
          value={formData.phone} 
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">Adresse</Label>
        <Input 
          id="address" 
          type="text" 
          placeholder="Votre adresse complète" 
          value={formData.address} 
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-11"
        />
      </div>
      {showProfessionalFields && (
        <>
          <div className="space-y-2">
            <Label htmlFor="profession" className="text-sm font-medium">Profession</Label>
            <Select value={formData.profession} onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sélectionnez votre profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regie">Régie</SelectItem>
                <SelectItem value="service-transaction">Service transaction</SelectItem>
                <SelectItem value="service-location">Service location</SelectItem>
                <SelectItem value="agent-immobilier">Agent immobilier</SelectItem>
                <SelectItem value="mandataires">Mandataires</SelectItem>
                <SelectItem value="independants-franchises">Indépendants ou franchisés</SelectItem>
                <SelectItem value="courtier">Courtier</SelectItem>
                <SelectItem value="notaire">Notaire</SelectItem>
                <SelectItem value="banque">Banque</SelectItem>
                <SelectItem value="entreprise-travaux">Entreprise de travaux</SelectItem>
                <SelectItem value="diagnostiqueur">Diagnostiqueur</SelectItem>
                <SelectItem value="assureurs">Assureurs</SelectItem>
                <SelectItem value="demenageurs">Déménageurs</SelectItem>
                <SelectItem value="artisans">Artisans</SelectItem>
                <SelectItem value="gestionnaire-patrimoine">Gestionnaire de patrimoine</SelectItem>
                <SelectItem value="geometre">Géomètre</SelectItem>
                <SelectItem value="metreur">Métreur</SelectItem>
                <SelectItem value="architecte">Architecte</SelectItem>
                <SelectItem value="assistant-maitrise-ouvrage">Assistant maîtrise d'ouvrage</SelectItem>
                <SelectItem value="promoteur">Promoteur</SelectItem>
                <SelectItem value="lotisseur">Lotisseur</SelectItem>
                <SelectItem value="fonciere">Foncière</SelectItem>
                <SelectItem value="avocat">Avocat</SelectItem>
                <SelectItem value="expert-comptable">Expert-comptable</SelectItem>
                <SelectItem value="decorateur">Décorateur</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siret" className="text-sm font-medium">Numéro SIRET</Label>
            <Input 
              id="siret" 
              type="text" 
              placeholder="12345678901234" 
              value={formData.siret} 
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="h-11"
              maxLength={14}
            />
            <p className="text-xs text-slate-500">14 chiffres (optionnel)</p>
          </div>
        </>
      )}
    </div>
  );
};

const Step3 = ({ formData, handleInputChange }: { formData: any; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="space-y-4">
    <h4 className="font-medium text-slate-700">Réseaux sociaux (optionnel)</h4>
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="instagram" className="text-sm">Instagram</Label>
        <Input 
          id="instagram" 
          type="text" 
          placeholder="@votrenom" 
          value={formData.instagram} 
          onChange={handleInputChange} 
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="twitter" className="text-sm">Twitter</Label>
        <Input 
          id="twitter" 
          type="text" 
          placeholder="@votrenom" 
          value={formData.twitter} 
          onChange={handleInputChange} 
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="facebook" className="text-sm">Facebook</Label>
        <Input 
          id="facebook" 
          type="text" 
          placeholder="Lien vers votre profil" 
          value={formData.facebook} 
          onChange={handleInputChange} 
          className="h-10"
        />
      </div>
    </div>
  </div>
);

const Step4 = ({ email }: { email: string }) => (
  <div className="space-y-4">
    <Alert className="border-amber-300 bg-amber-50 text-amber-900">
      <AlertTitle className="font-semibold">Confirmez votre adresse email</AlertTitle>
      <AlertDescription>
        Un email de confirmation a été envoyé à <strong>{email}</strong>. Veuillez ouvrir votre boîte mail et cliquer sur le lien pour activer votre compte.
      </AlertDescription>
    </Alert>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [signupNoticeEmail, setSignupNoticeEmail] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupStep, setSignupStep] = useState(0);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [formData, setFormData] = useState({
    user_type: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    profession: '',
    siret: '',
    instagram: '',
    twitter: '',
    facebook: ''
  });
  const { user, signOut: authSignOut } = useAuth();
  const isLoggedIn = !!user;
  const userEmail = user?.email || '';
  const [scrolled, setScrolled] = useState(false);
  const [profileMaxListings, setProfileMaxListings] = useState<number | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [monthlyCount, setMonthlyCount] = useState<number>(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load profile and monthly count when user changes
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        setProfileMaxListings(null);
        setUserType(null);
        setMonthlyCount(0);
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (profileError) {
          console.error('[Navbar] profiles fetch error', profileError);
        } else {
          setProfileMaxListings((profile as any)?.max_listings ?? 50);
          setUserType((profile as any)?.user_type ?? null);
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const { count, error: countError } = await supabase
          .from('properties')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', now.toISOString());
        if (countError) {
          console.error('[Navbar] properties count error', countError);
        } else {
          setMonthlyCount(count || 0);
        }
      } catch (err) {
        console.error('[Navbar] loadProfileData failed', err);
      }
    };

    loadProfileData();
  }, [user]);

  // Listen for auth state changes to close dialog on sign in
  useEffect(() => {
    if (isLoggedIn && isAuthDialogOpen) {
      setIsAuthDialogOpen(false);
    }
  }, [isLoggedIn, isAuthDialogOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signInWithEmail(formData.email, formData.password);
    if (success) {
      setIsAuthDialogOpen(false);
      resetForm();
      toast.success('Connecté avec succès');
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Le formulaire ne devrait plus être soumis directement, la création se fait dans nextStep
    // Mais on garde cette fonction au cas où
    return;
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      console.warn('[Navbar] handleLogout: ignored duplicate click');
      return;
    }
    setIsLoggingOut(true);
    console.log('[Navbar] handleLogout: click -> calling signOut');
    try {
      await authSignOut();
      // Also call the auth module signOut for cleanup
      await signOut();
      setIsMenuOpen(false);
      setIsAuthDialogOpen(false);
      toast.success('Déconnecté avec succès');
      // Redirect to home after logout
      console.log('[Navbar] handleLogout: navigating to /');
      navigate('/');
    } catch (e) {
      console.error('[Navbar] handleLogout: exception while signing out', e);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      user_type: '',
      email: '', 
      password: '', 
      phone: '', 
      address: '', 
      profession: '',
      siret: '',
      instagram: '', 
      twitter: '', 
      facebook: '' 
    });
    setSignupStep(0);
    setShowTypeSelection(false);
    setSignupNoticeEmail(null);
  };

  const handleTypeSelection = (userType: string) => {
    setFormData(prev => ({ ...prev, user_type: userType }));
    setShowTypeSelection(true);
    setSignupStep(0);
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
    resetForm();
  };

  const nextStep = async () => {
    // Si on est à l'étape 3 (réseaux sociaux), créer le compte avant de passer à l'étape suivante (confirmation)
    if (signupStep === 3) {
      if (isSigningUp) return; // ignore double submit
      setIsSigningUp(true);
      const { email, password, ...profileData } = formData;
      const success = await signUpWithEmail(email, password, profileData);
      if (success) {
        setSignupNoticeEmail(email);
        toast.success('Vérifiez votre boîte mail pour confirmer votre adresse.');
        setSignupStep(prev => prev + 1); // Passer à l'étape de confirmation
      }
      setIsSigningUp(false);
    } else {
      setSignupStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setSignupStep(prev => prev - 1);
  };

  const buyLinks = {
    "Types de vente": [
        { title: "À vendre", description: "Achat classique de biens immobiliers", href: "/properties?type=sale" },
        { title: "Bail à céder", description: "Reprendre un bail commercial existant", href: "/properties?type=lease" },
        { title: "Enchères", description: "Acheter aux enchères publiques", href: "/properties?type=auction" },
        { title: "Viager", description: "Achat avec rente viagère", href: "/properties?type=viager" },
        { title: "Biens d'exception", description: "Propriétés de luxe et prestige", href: "/properties?type=exceptional_property" },
        { title: "Réméré", description: "Achat avec option de rachat", href: "/properties?type=remere" },
    ],
    "Ventes spécialisées": [
        { title: "VEFA", description: "Vente en l'état futur d'achèvement", href: "/properties?type=vefa" },
        { title: "Vente à terme", description: "Achat avec paiement différé", href: "/properties?type=vente_a_terme" },
        { title: "Réméré inversé", description: "Vente avec option de rachat inversée", href: "/properties?type=remere_inverse" },
        { title: "Indivision/Nue-propriété", description: "Achat en parts ou nue-propriété", href: "/properties?type=indivision_nue_propriete" },
        { title: "BRS", description: "Bail réel solidaire", href: "/properties?type=brs" },
        { title: "Démembrement temporaire", description: "Achat avec démembrement de propriété", href: "/properties?type=demenbrement_temporaire" },
    ],
    "Financement": [
        { title: "Crédit-vendeur", description: "Achat avec financement par le vendeur", href: "/properties?type=credit_vendeur" },
        { title: "Copropriété/Lot de volume", description: "Achat en copropriété ou lot de volume", href: "/properties?type=copropriete_lot_volume" },
    ]
  };

  const rentLinks = {
    "Types de location": [
        { title: "À louer", description: "Location classique de biens immobiliers", href: "/properties?type=rent" },
        { title: "Location journalière", description: "Location courte durée et séjours", href: "/properties?type=rent_by_day" },
    ]
  };

  const borrowLinks = {
    Emprunt: [
        { title: "Votre crédit : comparez les offres", href: "/borrow/credit" },
        { title: "Assurance de prêt : en savoir plus", href: "/borrow/assurance" },
    ],
    Outils: [
        { title: "Votre capacité d'emprunt", href: "/borrow/capacite" },
        { title: "Calculez vos mensualités", href: "/borrow/mensualites" },
        { title: "Estimez vos frais de notaire", href: "/borrow/frais-notaire" },
    ],
    Investir: [
        { title: "Investissement locatif", href: "/borrow/investissement-locatif" },
    ]
  };

  const auctionLinks = {
    Enchères: [
        { title: "Consulter les enchères", href: "/auctions" },
        { title: "Salle d'enchères digitale", href: "/auctions/room" },
    ],
    Créer: [
        { title: "Créer une enchère", href: "/create-auction" },
        { title: "Mes enchères", href: "/account/auctions" },
    ],
    Participer: [
        { title: "Comment ça marche", href: "/auctions/guide" },
        { title: "Règles et conditions", href: "/auctions/rules" },
    ]
  };

  const resourcesLinks = {
    Simulateurs: [
        { title: "Simulateur de réméré", description: "Calculez votre réméré immobilier", href: "/resources/simulateur-remere" },
        { title: "Simulateur de VEFA", description: "Vente en l'état futur d'achèvement", href: "/resources/simulateur-vefa" },
        { title: "Simulateur de vente à terme", description: "Achat avec paiement différé", href: "/resources/simulateur-vente-terme" },
        { title: "Simulateur de réméré inversé", description: "Vente avec option de rachat inversée", href: "/resources/simulateur-remere-inverse" },
        { title: "Simulateur de viager", description: "Achat avec rente viagère", href: "/resources/simulateur-viager" },
        { title: "Simulateur de bail commercial", description: "Reprendre un bail commercial existant", href: "/resources/simulateur-bail" },
        { title: "Simulateur d'enchères", description: "Acheter aux enchères publiques", href: "/resources/simulateur-encheres" },
        { title: "Simulateur de biens d'exception", description: "Propriétés de luxe et prestige", href: "/resources/simulateur-biens-exception" },
        { title: "Simulateur d'indivision", description: "Achat en parts ou nue-propriété", href: "/resources/simulateur-indivision" },
        { title: "Simulateur de BRS", description: "Bail réel solidaire", href: "/resources/simulateur-brs" },
        { title: "Simulateur de démembrement", description: "Achat avec démembrement de propriété", href: "/resources/simulateur-demenbrement" },
        { title: "Simulateur de crédit-vendeur", description: "Achat avec financement par le vendeur", href: "/resources/simulateur-credit-vendeur" },
        { title: "Simulateur de copropriété", description: "Achat en copropriété ou lot de volume", href: "/resources/simulateur-copropriete" },
    ],
    "Guides - opérations": [
        { title: "Guide du réméré", description: "Tout savoir sur le réméré immobilier", href: "/resources/guide-remere" },
        { title: "Guide du VEFA", description: "Comprendre la vente en l'état futur d'achèvement", href: "/resources/guide-vefa" },
        { title: "Guide de la vente à terme", description: "Expliquer la vente à terme", href: "/resources/guide-vente-terme" },
        { title: "Guide du réméré inversé", description: "Comprendre le réméré inversé", href: "/resources/guide-remere-inverse" },
        { title: "Guide du viager", description: "Tout savoir sur le viager immobilier", href: "/resources/guide-viager" },
        { title: "Guide du bail commercial", description: "Reprendre un bail commercial", href: "/resources/guide-bail" },
        { title: "Guide des enchères immobilières", description: "Acheter aux enchères publiques", href: "/resources/guide-encheres" },
        { title: "Guide des biens d'exception", description: "Investir dans le luxe", href: "/resources/guide-biens-exception" },
    ],
    "Guides - copropriété & financement": [
        { title: "Guide de l'indivision", description: "Achat en parts ou nue-propriété", href: "/resources/guide-indivision" },
        { title: "Guide du BRS", description: "Comprendre le bail réel solidaire", href: "/resources/guide-brs" },
        { title: "Guide du démembrement", description: "Achat avec démembrement de propriété", href: "/resources/guide-demenbrement" },
        { title: "Guide du crédit-vendeur", description: "Financement par le vendeur", href: "/resources/guide-credit-vendeur" },
        { title: "Guide de la copropriété", description: "Achat en copropriété ou lot de volume", href: "/resources/guide-copropriete" },
    ]
  };

  // Fonction pour déterminer l'état actif basée sur le type
  const getActiveState = (linkType: string) => {
    const searchParams = new URLSearchParams(location.search);
    const currentType = searchParams.get('type');
    
    // Si on est sur la page des propriétés, on vérifie le type
    if (location.pathname === '/properties') {
      return currentType === linkType;
    }
    
    // Pour les autres pages, on utilise la logique normale
    return false;
  };

  // Définition cohérente des liens de navigation
  const propertyTypeLinks = [
    { 
      name: 'Acheter', 
      path: '/properties?type=sale',
      type: 'sale',
      mobileIcon: <Home size={18} />,
      dropdown: buyLinks
    },
    { 
      name: 'Louer', 
      path: '/properties?type=rent',
      type: 'rent',
      mobileIcon: <Key size={18} />,
      dropdown: rentLinks
    },
  ];

  const ancillaryServicesLinks = {
    "Vie pratique": [
      { title: "Tous les services annexes", href: "/ancillary-services" },
      { title: "Déménagement", href: "/ancillary-services?type=demenagement" },
      { title: "Aménagement", href: "/ancillary-services?type=amenagement" },
      { title: "Nettoyage", href: "/ancillary-services?type=nettoyage" },
      { title: "Diagnostic", href: "/ancillary-services?type=diagnostic" },
      { title: "Autre", href: "/ancillary-services?type=autre" },
    ],
    "Bâtiment et maîtrise d’œuvre": [
      { title: "Travaux", href: "/ancillary-services?type=travaux" },
      { title: "Artisan", href: "/ancillary-services?type=artisan" },
      { title: "Maître d’œuvre", href: "/ancillary-services?type=maitre_oeuvre" },
      { title: "Architecte", href: "/ancillary-services?type=architecte" },
      { title: "Assistant maîtrise d’ouvrage", href: "/ancillary-services?type=amo" },
      { title: "Géomètre", href: "/ancillary-services?type=geometre" },
    ],
    "Finance et juridique": [
      { title: "Courtier", href: "/ancillary-services?type=courtier" },
      { title: "Banque", href: "/ancillary-services?type=banque" },
      { title: "Assurance", href: "/ancillary-services?type=assurance" },
      { title: "Notaire", href: "/ancillary-services?type=notaire" },
      { title: "Gestionnaire de patrimoine", href: "/ancillary-services?type=gestionnaire_patrimoine" },
      { title: "Promoteur / lotisseur", href: "/ancillary-services?type=promoteur_lotisseur" },
    ],
  };

  const otherLinks = [
    { 
      name: 'Emprunter', 
      path: '/borrow', 
      dropdown: borrowLinks,
      mobileIcon: <Search size={18} />
    },
    { 
      name: 'Services annexes', 
      path: '/ancillary-services',
      dropdown: ancillaryServicesLinks,
      mobileIcon: <Truck size={18} />
    },
    { 
      name: 'Ventes aux enchères', 
      path: '/auctions',
      dropdown: auctionLinks,
      mobileIcon: <Users size={18} />
    },
    { 
      name: 'Ressources', 
      path: '/resources',
      dropdown: resourcesLinks,
      mobileIcon: <BookOpen size={18} />
    },
  ];

  const getUserInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  // Fonction pour fermer le menu mobile
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  // Fonction pour gérer le clic sur les liens mobiles
  const handleMobileLinkClick = (link: any) => {
    closeMobileMenu();
    navigate(link.path);
  };

  return (
    <header className={cn(
      "sticky top-0 z-[2000] transition-all duration-300 backdrop-blur-lg",
      scrolled 
        ? "bg-white/95 shadow-lg border-b border-slate-200/60" 
        : "bg-white/80 shadow-sm border-b border-slate-200/40"
    )}>
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="container py-3 flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Liens de type propriété - logique exclusive */}
                {propertyTypeLinks.map(link => (
                  <NavigationMenuItem key={link.name}>
                    {link.dropdown ? (
                      <>
                        <NavigationMenuTrigger className="group data-[state=open]:bg-teal-50 data-[state=open]:text-teal-700">
                          {link.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[600px] grid-cols-3 gap-6 p-6">
                            {Object.entries(link.dropdown).map(([category, links]) => (
                              <div key={category} className="space-y-3">
                                <h3 className="font-semibold text-slate-800 text-lg border-b border-slate-200 pb-2">
                                  {category}
                                </h3>
                                <ul className="flex flex-col gap-2">
                                  {links.map((item: any) => (
                                    <ListItem 
                                      key={item.title} 
                                      href={item.href} 
                                      title={item.title}
                                      description={item.description}
                                    />
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <NavLink 
                          to={link.path} 
                          isActive={getActiveState(link.type)}
                        >
                          {link.name}
                        </NavLink>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
                
                {/* Autres liens avec dropdown */}
                {otherLinks.map(link => (
                  <NavigationMenuItem key={link.name}>
                    {link.dropdown ? (
                      <>
                        <NavigationMenuTrigger className="group data-[state=open]:bg-teal-50 data-[state=open]:text-teal-700">
                          {link.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className={`grid gap-6 p-6 ${
                            link.name === 'Ventes aux enchères' ? 'w-[500px] grid-cols-3' : 
                            link.name === 'Louer' ? 'w-[300px] grid-cols-1' : 
                            link.name === 'Ressources' ? 'w-[900px] grid-cols-3' :
                            'w-[600px] grid-cols-3'
                          }`}>
                            {Object.entries(link.dropdown).map(([category, links]) => (
                              <div key={category} className="space-y-3">
                                <h3 className="font-semibold text-slate-800 text-lg border-b border-slate-200 pb-2">
                                  {category}
                                </h3>
                                <ul className="flex flex-col gap-2">
                                  {links.map((item: any) => (
                                    <ListItem 
                                      key={item.title} 
                                      href={item.href} 
                                      title={item.title}
                                      description={item.description}
                                    />
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <NavLink 
                          to={link.path} 
                          isActive={location.pathname === link.path}
                        >
                          {link.name}
                        </NavLink>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-slate-100 transition-colors">
                    <Avatar className="h-8 w-8 border-2 border-teal-200">
                      <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-semibold">
                        {getUserInitials(userEmail)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-slate-700">Mon compte</span>
                      <span className="text-xs text-slate-500">{userEmail}</span>
                    </div>
                    <ChevronDown size={16} className="text-slate-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="end">
                  <div className="flex flex-col gap-1">
                    <div className="p-2 rounded-md bg-amber-50 border border-amber-200 mb-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-900">Déjà Publié ce mois</span>
                        <Badge variant="secondary">{monthlyCount ?? 0}/{profileMaxListings ?? 50}</Badge>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full mt-2 h-8">
                        <Link to="/account/subscription">Abonnement</Link>
                      </Button>
                    </div>
                    <Button asChild variant="ghost" className="justify-start h-10 rounded-lg">
                      <Link to="/account/profile" className="flex items-center gap-3">
                        <User size={18} className="text-slate-600" />
                        <span>Mon profil</span>
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start h-10 rounded-lg">
                      <Link to="/account/myads" className="flex items-center gap-3">
                        <Home size={18} className="text-slate-600" />
                        <span>Mes annonces</span>
                      </Link>
                    </Button>
                    <Separator className="my-2" />
                    <Button 
                      variant="ghost" 
                      className="justify-start h-10 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} className="mr-3" />
                      Déconnexion
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => { 
                    resetForm();
                    setIsAuthDialogOpen(true); 
                    setAuthMode('login'); 
                  }}
                  className="text-slate-700 hover:text-teal-600"
                >
                  Connexion
                </Button>
                <Button 
                  onClick={() => { 
                    resetForm();
                    setIsAuthDialogOpen(true); 
                    setAuthMode('signup'); 
                  }}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
                >
                  S'inscrire
                </Button>
              </div>
            )}
            {isLoggedIn && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {monthlyCount}/{profileMaxListings ?? 50}
                </Badge>
                <Button asChild variant="outline" className="h-9">
                  <Link to="/account/subscription">Abonnement</Link>
                </Button>
              </div>
            )}
            <Button 
              onClick={() => setIsPublishDialogOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all px-4 flex items-center gap-2 font-semibold"
            >
              <PlusCircle size={18} />
              Publier
              <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0 text-xs">
                Gratuit
              </Badge>
              {(() => { const show = isLoggedIn && userType === 'Professionnelle'; console.log('[Navbar] render.desktop.publishBadge show=', show, 'userType=', userType); return show; })() && (
                <Badge variant="outline" className="ml-2 bg-white/90 text-slate-800 border-slate-300 text-xs">
                  {Math.max(0, (profileMaxListings ?? 50) - (monthlyCount ?? 0))}/{profileMaxListings ?? 50}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="container py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MobileLogo />
            {/* Bouton Publier visible sur mobile */}
            <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all px-2 py-1.5 h-8 whitespace-nowrap flex-shrink-0">
              <Link to="/sell" className="flex items-center gap-1 text-xs font-semibold">
                <PlusCircle size={12} />
                Publier
                <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0 text-[9px] h-3 px-1">
                  Gratuit
                </Badge>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-xl border-t border-slate-200 transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="flex flex-col gap-0.5 p-3 max-h-[80vh] overflow-y-auto">
          {/* Liens de type propriété - logique exclusive */}
          {propertyTypeLinks.map(link => (
            <button
              key={link.name}
              onClick={() => handleMobileLinkClick(link)}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-all duration-200 px-3 py-2.5 rounded-lg no-underline w-full text-left",
                getActiveState(link.type)
                  ? "text-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 shadow-sm" 
                  : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
              )}
            >
              <span className={cn(
                "transition-colors",
                getActiveState(link.type) ? "text-teal-600" : "text-slate-400 group-hover:text-teal-500"
              )}>
                {link.mobileIcon}
              </span>
              {link.name}
            </button>
          ))}
          
          {/* Autres liens */}
          {otherLinks.map(link => (
            <button
              key={link.name}
              onClick={() => handleMobileLinkClick(link)}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-all duration-200 px-3 py-2.5 rounded-lg no-underline w-full text-left",
                location.pathname === link.path
                  ? "text-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 shadow-sm" 
                  : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
              )}
            >
              <span className={cn(
                "transition-colors",
                location.pathname === link.path ? "text-teal-600" : "text-slate-400 group-hover:text-teal-500"
              )}>
                {link.mobileIcon}
              </span>
              {link.name}
            </button>
          ))}
          
          <Separator className="my-2" />
          
          {isLoggedIn ? (
            <div className="flex flex-col gap-1.5 p-2">
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg mb-1">
                <Avatar className="h-8 w-8 border-2 border-teal-200">
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs">
                    {getUserInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">Mon compte</p>
                  <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                </div>
              </div>
              <div className="p-2 rounded-md bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-900">Déjà Publié ce mois</span>
                  <Badge variant="secondary" className="text-xs">{monthlyCount ?? 0}/{profileMaxListings ?? 50}</Badge>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full mt-2 h-8" onClick={closeMobileMenu}>
                  <Link to="/account/subscription">Abonnement</Link>
                </Button>
              </div>
              <Button asChild variant="ghost" className="justify-start h-10 rounded-lg text-sm">
                <Link to="/account/profile" onClick={closeMobileMenu}>
                  <User size={16} className="mr-2" />
                  Mon profil
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start h-10 rounded-lg text-sm">
                <Link to="/account/myads" onClick={closeMobileMenu}>
                  <Home size={16} className="mr-2" />
                  Mes annonces
                </Link>
              </Button>
              <Button variant="destructive" onClick={() => { handleLogout(); closeMobileMenu(); }} className="h-10 rounded-lg mt-1 text-sm">
                <LogOut size={16} className="mr-2" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 p-2">
              <Button 
                variant="outline" 
                onClick={() => { 
                  resetForm();
                  setIsAuthDialogOpen(true); 
                  setAuthMode('login'); 
                  closeMobileMenu(); 
                }}
                className="h-10 rounded-lg text-sm"
              >
                <LogIn size={16} className="mr-2" />
                Connexion
              </Button>
              <Button 
                onClick={() => { 
                  resetForm();
                  setIsAuthDialogOpen(true); 
                  setAuthMode('signup'); 
                  closeMobileMenu(); 
                }}
                className="h-10 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-sm"
              >
                <UserPlus size={16} className="mr-2" />
                S'inscrire
              </Button>
            </div>
          )}
          
          <Button 
            onClick={() => {
              setIsPublishDialogOpen(true);
              closeMobileMenu();
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 h-10 rounded-lg mt-1 font-semibold text-sm"
          >
            <PlusCircle size={16} className="mr-2" />
            Publier une annonce
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0 text-xs">
              Gratuit
            </Badge>
          </Button>
        </nav>
      </div>

      {/* Auth Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={(open) => {
        setIsAuthDialogOpen(open);
        if (open) {
          // Reset form when dialog opens
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 mx-auto mb-4">
              {authMode === 'login' ? <LogIn className="text-white" size={24} /> : <UserPlus className="text-white" size={24} />}
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-slate-800">
              {authMode === 'login' ? 'Connexion' : 'Créer un compte'}
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              {authMode === 'login' 
                ? 'Content de vous revoir ! Connectez-vous à votre compte.' 
                : 'Rejoignez Trocadimmo et commencez dès aujourd\'hui.'}
            </DialogDescription>
          </DialogHeader>
          
          {authMode === 'login' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Step1 formData={formData} handleInputChange={handleInputChange} />
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md"
                >
                  Se connecter
                </Button>
            </form>
          ) : !showTypeSelection ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  onClick={() => handleTypeSelection('Particulier')}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-teal-50 hover:border-teal-500"
                >
                  <span className="text-2xl">👤</span>
                  <span className="font-semibold">Particulier</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => handleTypeSelection('Professionnelle')}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-teal-50 hover:border-teal-500"
                >
                  <span className="text-2xl">💼</span>
                  <span className="font-semibold">Professionnelle</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => handleTypeSelection('Partenaire')}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-teal-50 hover:border-teal-500"
                >
                  <span className="text-2xl">🤝</span>
                  <span className="font-semibold">Partenaire</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <StepIndicator currentStep={signupStep + 1} totalSteps={4} />
              
              {signupStep === 4 ? (
                // Étape de confirmation (pas de formulaire)
                <Step4 email={formData.email} />
              ) : (
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  {signupStep === 1 && <Step1 formData={formData} handleInputChange={handleInputChange} onEnterKey={nextStep} />}
                  {signupStep === 2 && <Step2 formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} onEnterKey={nextStep} />}
                  {signupStep === 3 && <Step3 formData={formData} handleInputChange={handleInputChange} />}
                  
                  <div className="flex justify-between pt-4">
                    {signupStep > 0 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        className="h-11"
                        disabled={isSigningUp}
                      >
                        Précédent
                      </Button>
                    )}
                    
                    {signupStep < 3 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md ml-auto"
                        disabled={isSigningUp}
                      >
                        Suivant
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md ml-auto"
                        disabled={isSigningUp}
                      >
                        {isSigningUp ? 'Création…' : 'Créer mon compte'}
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}
          
          <div className="text-center text-sm">
            {authMode === 'login' ? (
              <p className="text-slate-600">
                Pas encore de compte ?{' '}
                <button type="button" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline" onClick={toggleAuthMode}>
                  S'inscrire
                </button>
              </p>
            ) : (
              <p className="text-slate-600">
                Déjà un compte ?{' '}
                <button type="button" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline" onClick={toggleAuthMode}>
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Type Selection Dialog */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-slate-800">
              Publier une annonce
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              Choisissez le type d'annonce que vous souhaitez publier
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-6">
            <Button
              onClick={() => {
                navigate("/sell");
                setIsPublishDialogOpen(false);
              }}
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-3 hover:bg-teal-50 hover:border-teal-500 border-2"
            >
              <Building size={32} className="text-teal-600" />
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Annonce immobilière</span>
                <span className="text-sm text-slate-500">Vente, location, baux commerciaux</span>
              </div>
            </Button>

            <Button
              onClick={() => {
                navigate("/sell/ancillary-service");
                setIsPublishDialogOpen(false);
              }}
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-3 hover:bg-amber-50 hover:border-amber-500 border-2"
            >
              <Truck size={32} className="text-amber-600" />
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Services annexes</span>
                <span className="text-sm text-slate-500">Déménagement, travaux, diagnostics</span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;