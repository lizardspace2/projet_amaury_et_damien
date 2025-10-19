import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Home, Key, Users, CalendarDays, LogIn, LogOut, UserPlus, PlusCircle, Truck, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { signInWithEmail, signUpWithEmail, signOut } from '@/lib/api/auth';
import { supabase } from '@/lib/api/supabaseClient';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800 no-underline hover:no-underline">
    <Building className="h-7 w-7 text-teal-600" />
    <div className="flex flex-col">
        <span className="font-serif leading-tight">AnnoncesImmo</span>
        <span className="text-xs font-light text-slate-500 leading-tight">Région Lyonnaise</span>
    </div>
  </Link>
);

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors px-3 py-2 rounded-md no-underline hover:no-underline ${isActive ? 'bg-teal-100 text-teal-700' : 'text-slate-600 hover:bg-gray-100'}`}>
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
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
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
  const navigate = useNavigate();

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

    return () => subscription.unsubscribe();
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

  const mainNavLinks = [
    { name: 'Acheter', path: '/properties?type=sale' },
    { name: 'Louer', path: '/properties?type=rent' },
    { name: 'Bail Commercial', path: '/properties?type=lease' },
    { name: 'Location Journalière', path: '/properties?type=rent_by_day' },
    { name: 'Emprunter', path: '/borrow', dropdown: borrowLinks },
    { name: 'Services de déménagement', path: '/moving-services' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              {mainNavLinks.map(link => (
                <NavigationMenuItem key={link.name}>
                  {link.dropdown ? (
                    <>
                      <NavigationMenuTrigger>{link.name}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[600px] grid-cols-3 gap-4 p-4">
                          {Object.entries(link.dropdown).map(([category, links]) => (
                            <div key={category}>
                              <h3 className="font-medium text-lg mb-2">{category}</h3>
                              <ul className="flex flex-col gap-1">
                                {links.map(item => (
                                  <ListItem key={item.title} href={item.href} title={item.title} />
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <NavLink to={link.path}>{link.name}</NavLink>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User size={18} />
                  <span>Mon Compte</span>
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="flex flex-col gap-2">
                  <Button asChild variant="ghost" className="justify-start">
                    <Link to="/account">Mon Compte</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-red-500 hover:text-red-600" onClick={handleLogout}>
                    Déconnexion
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Button variant="ghost" onClick={() => { setIsAuthDialogOpen(true); setAuthMode('login'); }}>Connexion</Button>
              <Button onClick={() => { setIsAuthDialogOpen(true); setAuthMode('signup'); }}>S'inscrire</Button>
            </>
          )}
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link to="/sell">
              <PlusCircle size={18} className="mr-2" />
              Publier une annonce
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-800">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-[150%]'}`}>
        <nav className="flex flex-col gap-4 p-6">
          {mainNavLinks.map(link => <NavLink key={link.name} to={link.path}>{link.name}</NavLink>)}
          <hr className="my-4" />
          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="justify-center">
                <Link to="/account" onClick={() => setIsMenuOpen(false)}><User size={18} className="mr-2" />Mon Compte</Link>
              </Button>
              <Button variant="destructive" onClick={handleLogout}>Déconnexion</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => { setIsAuthDialogOpen(true); setAuthMode('login'); setIsMenuOpen(false); }}>Connexion</Button>
              <Button onClick={() => { setIsAuthDialogOpen(true); setAuthMode('signup'); setIsMenuOpen(false); }}>S'inscrire</Button>
            </div>
          )}
           <Button asChild className="bg-teal-600 hover:bg-teal-700 mt-4">
            <Link to="/sell">
              <PlusCircle size={18} className="mr-2" />
              Publier une annonce
            </Link>
          </Button>
        </nav>
      </div>

      {/* Auth Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {authMode === 'login' ? 'Connexion' : 'S\'inscrire'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={authMode === 'login' ? handleEmailLogin : handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Entrez votre e-mail" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="Entrez votre mot de passe" value={formData.password} onChange={handleInputChange} required />
            </div>
            {authMode === 'signup' && (
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" placeholder="Entrez votre numéro de téléphone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" type="text" placeholder="Entrez votre adresse" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" type="text" placeholder="@votrenomdutilisateur" value={formData.instagram} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" type="text" placeholder="@votrenomdutilisateur" value={formData.twitter} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input id="facebook" type="text" placeholder="Lien vers votre profil" value={formData.facebook} onChange={handleInputChange} />
                  </div>
              </div>
            )}
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">{authMode === 'login' ? 'Connexion' : 'S\'inscrire'}</Button>
          </form>
          <div className="text-center text-sm">
            {authMode === 'login' ? (
              <p>Vous n'avez pas de compte? <button type="button" className="text-teal-600 hover:underline" onClick={toggleAuthMode}>S'inscrire</button></p>
            ) : (
              <p>Vous avez déjà un compte? <button type="button" className="text-teal-600 hover:underline" onClick={toggleAuthMode}>Connexion</button></p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
