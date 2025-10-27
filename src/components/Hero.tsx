import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Autoplay from "embla-carousel-autoplay";
import { signInWithEmail, signUpWithEmail } from "@/lib/api/auth";
import { supabase } from "@/lib/api/supabaseClient";
import { toast } from "sonner";

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

const Step1 = ({ formData, handleInputChange }: { formData: any; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="space-y-4">
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
  </div>
);

const Step2 = ({ formData, handleInputChange, setFormData }: { formData: any; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; setFormData: React.Dispatch<React.SetStateAction<any>> }) => {
  const showProfessionalFields = formData.user_type === 'Professionnelle' || formData.user_type === 'Partenaire';
  
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

const Hero = () => {
  const navigate = useNavigate();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [signupStep, setSignupStep] = useState(0);
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

  const carouselImages = Array.from(
    { length: 30 },
    (_, i) => `/photohomepagecaroussel (${i + 1}).jpg`
  );

  const handleUserTypeClick = (userType: string) => {
    setSelectedUserType(userType);
    setFormData(prev => ({ ...prev, user_type: userType }));
    setIsAuthDialogOpen(true);
    setSignupStep(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    setSignupStep(prev => prev + 1);
  };

  const prevStep = () => {
    setSignupStep(prev => prev - 1);
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
    setSelectedUserType('');
    setAuthMode('signup');
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
    const success = await signUpWithEmail(email, password, {
      user_type: profileData.user_type,
      phone: profileData.phone,
      address: profileData.address,
      profession: profileData.profession,
      siret: profileData.siret,
      instagram: profileData.instagram,
      twitter: profileData.twitter,
      facebook: profileData.facebook
    });
    if (success) {
      setIsAuthDialogOpen(false);
      resetForm();
      toast.success('Compte créé avec succès !');
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch(type) {
      case 'Particulier': return 'un(e) particulier(e)';
      case 'Professionnelle': return 'un(e) professionnel(le)';
      case 'Partenaire': return 'un(e) partenaire';
      default: return type;
    }
  };

  return (
    <div className="relative bg-estate-800 py-16 md:py-24 lg:py-32 overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="absolute inset-0 w-full h-full"
      >
        <CarouselContent className="h-full">
          {carouselImages.map((src, index) => (
            <CarouselItem key={index} className="h-full">
              {/* Ensure the CarouselItem itself and this immediate child div correctly propagate height */}
              <div className="h-full"> 
                <img
                  src={src}
                  alt={`Carousel image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute inset-0 bg-black opacity-30"></div> {/* Overlay */}
      </Carousel>

      <div className="container relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Trouvez la maison de vos rêves
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Nous vous aidons à trouver la maison de vos rêves. Parcourez notre catalogue de propriétés et trouvez celle qui vous convient le mieux.
          </p>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() => handleUserTypeClick('Partenaire')}
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/50 hover:border-white px-6 py-3 text-base md:text-lg rounded-lg font-semibold"
            >
              Partenaire
            </Button>
            <Button
              onClick={() => handleUserTypeClick('Professionnelle')}
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/50 hover:border-white px-6 py-3 text-base md:text-lg rounded-lg font-semibold"
            >
              Professionnelle
            </Button>
            <Button
              onClick={() => handleUserTypeClick('Particulier')}
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/50 hover:border-white px-6 py-3 text-base md:text-lg rounded-lg font-semibold"
            >
              Particulier
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="max-w-md mx-auto space-y-4">
            <Button
              onClick={() => navigate("/sell")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg md:text-xl rounded-lg font-bold w-full"
              size="lg"
            >
              Publier une annonce
            </Button>
            
            {/* View Properties Button */}
            <Button
              onClick={() => navigate("/properties")}
              className="bg-white hover:bg-gray-50 text-teal-500 border-2 border-teal-500 px-8 py-6 text-lg md:text-xl rounded-lg font-bold w-full"
              size="lg"
            >
              Voir les annonces
            </Button>
            
            {/* View Map Button */}
            <Button
              onClick={() => navigate("/map")}
              className="bg-white hover:bg-gray-50 text-teal-500 border-2 border-teal-500 px-8 py-6 text-lg md:text-xl rounded-lg font-bold w-full"
              size="lg"
            >
              Voir la carte
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-slate-800">
              {authMode === 'login' ? 'Connexion' : 'Créer un compte'}
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600">
              {authMode === 'login' 
                ? 'Content de vous revoir ! Connectez-vous à votre compte.' 
                : <>Vous souhaitez vous inscrire en tant que <strong>{getUserTypeLabel(selectedUserType)}</strong></>}
            </DialogDescription>
          </DialogHeader>

          {authMode === 'login' ? (
            <>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Step1 formData={formData} handleInputChange={handleInputChange} />
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md"
                >
                  Se connecter
                </Button>
              </form>
              <div className="text-center text-sm mt-4">
                <p className="text-slate-600">
                  Pas encore de compte ?{' '}
                  <button type="button" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline" onClick={() => {
                    setAuthMode('signup');
                    setSignupStep(0);
                  }}>
                    S'inscrire
                  </button>
                </p>
              </div>
            </>
          ) : signupStep === 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_type" className="text-sm font-medium">Type de compte</Label>
                <Select 
                  value={selectedUserType} 
                  onValueChange={(value) => {
                    setSelectedUserType(value);
                    setFormData(prev => ({ ...prev, user_type: value }));
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sélectionnez votre profil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Particulier">Particulier</SelectItem>
                    <SelectItem value="Professionnelle">Professionnelle</SelectItem>
                    <SelectItem value="Partenaire">Partenaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={nextStep}
                className="w-full h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md"
              >
                Continuer
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setAuthMode('login');
                  setSignupStep(0);
                }}
                className="w-full h-11 text-slate-600 hover:text-slate-800"
              >
                J'ai déjà un compte
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <StepIndicator currentStep={signupStep} totalSteps={3} />
              
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                {signupStep === 1 && <Step1 formData={formData} handleInputChange={handleInputChange} />}
                {signupStep === 2 && <Step2 formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} />}
                {signupStep === 3 && <Step3 formData={formData} handleInputChange={handleInputChange} />}
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="h-11"
                  >
                    Précédent
                  </Button>
                  
                  {signupStep < 3 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md ml-auto"
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md ml-auto"
                    >
                      Créer mon compte
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hero;