import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Home, Key, Users, CalendarDays, LogIn, LogOut, UserPlus, PlusCircle, Truck, Building, Search, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { signInWithEmail, signUpWithEmail, signOut } from '@/lib/api/auth';
import { supabase } from '@/lib/api/supabaseClient';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Logo = () => (
  <Link to="/" className="flex items-center gap-3 text-xl font-bold text-slate-900 no-underline group">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
      <Building className="h-8 w-8 text-teal-600 relative z-10" />
    </div>
    <div className="flex flex-col">
      <span className="font-serif text-2xl leading-tight bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
        AnnoncesImmo
      </span>
      <span className="text-xs font-medium text-slate-500 leading-tight tracking-wide">
        RÉGION LYONNAISE
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

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(({ className, title, children, ...props }, ref) => {
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
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = 'ListItem'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    address: '',
    instagram: '',
    twitter: '',
    facebook: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setUserEmail(user?.email || '');
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
      setUserEmail(session?.user?.email || '');
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      subscription.unsubscribe();
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
    const { email, password, ...profileData } = formData;
    const success = await signUpWithEmail(email, password, profileData);
    if (success) {
      setIsAuthDialogOpen(false);
      resetForm();
      toast.success('Compte créé avec succès !');
    }
  };

  const handleLogout = async () => {
    const success = await signOut();
    if (success) {
      toast.success('Déconnecté avec succès');
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', phone: '', address: '', instagram: '', twitter: '', facebook: '' });
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
    resetForm();
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
      mobileIcon: <Home size={18} />
    },
    { 
      name: 'Louer', 
      path: '/properties?type=rent',
      type: 'rent',
      mobileIcon: <Key size={18} />
    },
    { 
      name: 'Bail Commercial', 
      path: '/properties?type=lease',
      type: 'lease',
      mobileIcon: <Building size={18} />
    },
    { 
      name: 'Location Journalière', 
      path: '/properties?type=rent_by_day',
      type: 'rent_by_day',
      mobileIcon: <CalendarDays size={18} />
    },
  ];

  const otherLinks = [
    { 
      name: 'Emprunter', 
      path: '/borrow', 
      dropdown: borrowLinks,
      mobileIcon: <Search size={18} />
    },
    { 
      name: 'Services de déménagement', 
      path: '/moving-services',
      mobileIcon: <Truck size={18} />
    },
    { 
      name: 'Ventes aux enchères', 
      path: '/auctions',
      mobileIcon: <Users size={18} />
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
      "sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg",
      scrolled 
        ? "bg-white/95 shadow-lg border-b border-slate-200/60" 
        : "bg-white/80 shadow-sm border-b border-slate-200/40"
    )}>
      <div className="container py-3 flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Liens de type propriété - logique exclusive */}
              {propertyTypeLinks.map(link => (
                <NavigationMenuItem key={link.name}>
                  <NavigationMenuLink asChild>
                    <NavLink 
                      to={link.path} 
                      isActive={getActiveState(link.type)}
                    >
                      {link.name}
                    </NavLink>
                  </NavigationMenuLink>
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
                                  >
                                    {item.title}
                                  </ListItem>
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

        <div className="hidden lg:flex items-center gap-3">
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
                  <Button asChild variant="ghost" className="justify-start h-10 rounded-lg">
                    <Link to="/account" className="flex items-center gap-3">
                      <User size={18} className="text-slate-600" />
                      <span>Mon profil</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-10 rounded-lg">
                    <Link to="/account/properties" className="flex items-center gap-3">
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
                onClick={() => { setIsAuthDialogOpen(true); setAuthMode('login'); }}
                className="text-slate-700 hover:text-teal-600"
              >
                Connexion
              </Button>
              <Button 
                onClick={() => { setIsAuthDialogOpen(true); setAuthMode('signup'); }}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
              >
                S'inscrire
              </Button>
            </div>
          )}
          <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all px-4">
            <Link to="/sell" className="flex items-center gap-2 font-semibold">
              <PlusCircle size={18} />
              Publier
              <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0 text-xs">
                Gratuit
              </Badge>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-xl border-t border-slate-200 transition-all duration-300 ease-in-out overflow-hidden",
        isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )}>
        <nav className="flex flex-col gap-1 p-4">
          {/* Liens de type propriété - logique exclusive */}
          {propertyTypeLinks.map(link => (
            <button
              key={link.name}
              onClick={() => handleMobileLinkClick(link)}
              className={cn(
                "flex items-center gap-3 text-sm font-medium transition-all duration-200 px-4 py-3 rounded-lg no-underline w-full text-left",
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
                "flex items-center gap-3 text-sm font-medium transition-all duration-200 px-4 py-3 rounded-lg no-underline w-full text-left",
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
          
          <Separator className="my-3" />
          
          {isLoggedIn ? (
            <div className="flex flex-col gap-2 p-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-2">
                <Avatar className="h-10 w-10 border-2 border-teal-200">
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
                    {getUserInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">Mon compte</p>
                  <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                </div>
              </div>
              <Button asChild variant="ghost" className="justify-start h-12 rounded-lg">
                <Link to="/account" onClick={closeMobileMenu}>
                  <User size={18} className="mr-3" />
                  Mon profil
                </Link>
              </Button>
              <Button variant="destructive" onClick={() => { handleLogout(); closeMobileMenu(); }} className="h-12 rounded-lg">
                <LogOut size={18} className="mr-3" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              <Button 
                variant="outline" 
                onClick={() => { setIsAuthDialogOpen(true); setAuthMode('login'); closeMobileMenu(); }}
                className="h-12 rounded-lg"
              >
                <LogIn size={18} className="mr-3" />
                Connexion
              </Button>
              <Button 
                onClick={() => { setIsAuthDialogOpen(true); setAuthMode('signup'); closeMobileMenu(); }}
                className="h-12 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
              >
                <UserPlus size={18} className="mr-3" />
                S'inscrire
              </Button>
            </div>
          )}
          
          <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 h-12 rounded-lg mt-2 font-semibold">
            <Link to="/sell" onClick={closeMobileMenu}>
              <PlusCircle size={18} className="mr-3" />
              Publier une annonce
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-0">
                Gratuit
              </Badge>
            </Link>
          </Button>
        </nav>
      </div>

      {/* Auth Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
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
                : 'Rejoignez AnnoncesImmo et commencez dès aujourd\'hui.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={authMode === 'login' ? handleEmailLogin : handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="votre@email.com" 
                value={formData.email} 
                onChange={handleInputChange} 
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
                className="h-11"
                required 
              />
            </div>
            
            {authMode === 'signup' && (
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Téléphone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+33 1 23 45 67 89" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
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
                      className="h-11"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700">Réseaux sociaux (optionnel)</h4>
                  <div className="grid grid-cols-1 gap-3">
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
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md"
            >
              {authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </Button>
          </form>
          
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
    </header>
  );
};

export default Navbar;