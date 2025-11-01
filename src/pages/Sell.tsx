import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertyTypeStep from "@/components/property/add/PropertyTypeStep";
import AddPropertyStep1 from "@/components/property/add/AddPropertyStep1";
import AddPropertyStep2 from "@/components/property/add/AddPropertyStep2";
import AddPropertyStep3 from "@/components/property/add/AddPropertyStep3";
import AddPropertyStep4 from "@/components/property/add/AddPropertyStep4";
import StepsIndicator from "@/components/property/add/StepsIndicator";
import { CreatePropertyInput, createProperty } from "@/lib/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/client";
import { startProUpgradeCheckout } from "@/lib/billing";
import { toast } from "sonner";
import { useAuth } from "@/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

const SellPage = () => {
  const steps = [
    { number: 1, label: "Authentification" },
    { number: 2, label: "Type d'annonce" },
    { number: 3, label: "Informations de base" },
    { number: 4, label: "Caractéristiques" },
    { number: 5, label: "Localisation" },
    { number: 6, label: "Publier" }
  ];

  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePropertyInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState(0);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [userProfile, setUserProfile] = useState<{ user_type?: string; max_listings?: number } | null>(null);
  const [authFormData, setAuthFormData] = useState({
    user_type: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    profession: "",
    siret: "",
    instagram: "",
    twitter: "",
    facebook: ""
  });
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [currentMaxListings, setCurrentMaxListings] = useState<number | null>(null);
  const [monthlyCount, setMonthlyCount] = useState<number>(0);

  // Load profile for logged-in users to know type and current quota
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, max_listings')
        .eq('user_id', user.id)
        .single();
      if (!error) setUserProfile(data);
    };
    loadProfile();
  }, [user]);

  // Load count of properties created this month for the user
  useEffect(() => {
    const loadMonthlyCount = async () => {
      if (!user) {
        setMonthlyCount(0);
        return;
      }
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count, error } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', now.toISOString());
      if (!error) setMonthlyCount(count || 0);
    };
    loadMonthlyCount();
  }, [user]);

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [id]: value }));
  };

  const resetAuthForm = () => {
    setAuthFormData({ 
      user_type: "",
      email: "", 
      password: "", 
      phone: "", 
      address: "", 
      profession: "",
      siret: "",
      instagram: "", 
      twitter: "", 
      facebook: "" 
    });
    setSignupStep(0);
    setShowTypeSelection(false);
    setSignupNoticeEmail(null);
  };

  const handleTypeSelection = (userType: string) => {
    setAuthFormData(prev => ({ ...prev, user_type: userType }));
    setShowTypeSelection(true);
    setSignupStep(0);
  };

  const [signupNoticeEmail, setSignupNoticeEmail] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const nextStep = async () => {
    // Si on est à l'étape 2 (réseaux sociaux), créer le compte avant de passer à l'étape de confirmation
    if (signupStep === 2) {
      if (isSigningUp) return; // ignore double submit
      setIsSigningUp(true);
      const { email, password, ...profileData } = authFormData;
      const success = await signUpWithEmail(email, password, profileData);
      if (success) {
        setSignupNoticeEmail(email);
        toast.success('Vérifiez votre boîte mail pour confirmer votre adresse.');
        setSignupStep(4); // Passer directement à l'étape de confirmation (étape 4)
      }
      setIsSigningUp(false);
    } else {
      setSignupStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setSignupStep(prev => prev - 1);
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
    resetAuthForm();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signInWithEmail(authFormData.email, authFormData.password);

    if (success) {
      setIsAuthDialogOpen(false);
      resetAuthForm();
      toast.success("Connexion réussie");
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Le formulaire ne devrait plus être soumis directement, la création se fait dans nextStep
    // Mais on garde cette fonction au cas où
    return;
  };

  const handleFinalSubmit = async (data: Partial<CreatePropertyInput>) => {
    try {
      setIsSubmitting(true);
      const finalData = {
        ...formData,
        ...data,
      };
      console.log('Final property data:', finalData);
      await createProperty(finalData as CreatePropertyInput);
      setFormData({});
      setStep(1);
      toast.success("Annonce publiée avec succès");
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (error?.code === 'LISTING_LIMIT_REACHED') {
        setCurrentMaxListings(typeof error.maxListings === 'number' ? error.maxListings : null);
        setShowUpgradeDialog(true);
      } else {
        toast.error("Erreur lors de la publication de l'annonce");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAuthStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">{"Commencer"}</h2>
      <p className="text-center text-gray-600">
        {user
          ? "Prêt à publier votre annonce ?"
          : "Connectez-vous ou créez un compte pour continuer."}
      </p>

      {user ? (
        <div className="space-y-4">
          <p className="text-center">{"Bienvenue"} : {user.email || "User"}!</p>
          {userProfile?.user_type === 'Professionnelle' && (
            <div className="rounded-md border border-amber-200 p-4 bg-amber-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-amber-900">Quota d'annonces mensuel</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{monthlyCount}/{userProfile?.max_listings ?? 50}</Badge>
                    <span className="text-sm text-amber-700">{Math.max(0, (userProfile?.max_listings ?? 50) - monthlyCount)} restantes</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={Math.min(100, Math.round((monthlyCount / (userProfile?.max_listings ?? 50)) * 100))} />
                  </div>
                  {(userProfile?.max_listings ?? 50) < 500 && (
                    <p className="text-sm text-amber-700 mt-1">Passez à Pro+ pour publier jusqu'à 500 annonces (29,99 € / mois).</p>
                  )}
                </div>
                {(userProfile?.max_listings ?? 50) < 500 && (
                  <Button onClick={async () => {
                    try { await startProUpgradeCheckout(); } catch (e: any) { toast.error(e?.message || 'Impossible de démarrer le paiement'); }
                  }} className="bg-amber-600 hover:bg-amber-700">Passer à Pro+ (29,99 € / mois)</Button>
                )}
              </div>
            </div>
          )}
          <Button
            className="w-full bg-teal-500 hover:bg-teal-600"
            onClick={() => setStep(2)}
          >
            {"Continuer vers les détails de la propriété"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {"Connectez-vous avec votre email"}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              resetAuthForm();
              setAuthMode("login");
              setIsAuthDialogOpen(true);
            }}
          >
            {"Se connecter"}
          </Button>

          <Button
            variant="ghost"
            className="w-full text-teal-600 hover:text-teal-700"
            onClick={() => {
              resetAuthForm();
              setAuthMode("signup");
              setIsAuthDialogOpen(true);
            }}
          >
            {"Créer un compte"}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative py-16 bg-estate-800">
          <div className="container text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              {"Publier une annonce immobilière"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-200">
              {"Remplissez les informations ci-dessous pour publier votre annonce."}
            </p>
          </div>
        </section>

        <section className="py-8 bg-white border-b">
          <div className="container">
            <StepsIndicator currentStep={step} steps={steps} />
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-md">
                <CardContent className="p-6 md:p-8">
                  {step === 1 && renderAuthStep()}

                  {step === 2 && (
                    <PropertyTypeStep
                      onBack={user ? () => setStep(1) : undefined}
                      onNext={(data) => {
                        console.log('PropertyTypeStep data:', data);
                        setFormData(prev => ({ ...prev, ...(data as unknown as Partial<CreatePropertyInput>) }));
                        setStep(3);
                      }}
                    />
                  )}

                  {step === 3 && (
                    <AddPropertyStep1
                      onBack={() => setStep(2)}
                      onNext={(data) => {
                        console.log('AddPropertyStep1 data:', data);
                        setFormData(prev => ({ ...prev, ...(data as unknown as Partial<CreatePropertyInput>) }));
                        setStep(4);
                      }}
                    />
                  )}

                  {step === 4 && (
                    <AddPropertyStep2
                      onBack={() => setStep(3)}
                      onNext={(data) => {
                        console.log('AddPropertyStep2 data:', data);
                        setFormData(prev => ({ ...prev, ...(data as unknown as Partial<CreatePropertyInput>) }));
                        setStep(5);
                      }}
                    />
                  )}

                  {step === 5 && (
                    <AddPropertyStep3
                      onBack={() => setStep(4)}
                      onNext={(data) => {
                        console.log('AddPropertyStep3 data:', data);
                        setFormData(prev => ({ ...prev, ...(data as unknown as Partial<CreatePropertyInput>) }));
                        setStep(6);
                      }}
                    />
                  )}

                  {step === 6 && (
                    <AddPropertyStep4
                      onBack={() => setStep(5)}
                      initialData={formData}
                      isSubmitting={isSubmitting}
                      onNext={handleFinalSubmit}
                      maxListings={userProfile?.user_type === 'Professionnelle' ? (userProfile?.max_listings ?? 50) : undefined}
                      monthlyCount={userProfile?.user_type === 'Professionnelle' ? monthlyCount : undefined}
                      onUpgrade={async () => {
                        try { await startProUpgradeCheckout(); } catch (e: any) { toast.error(e?.message || 'Impossible de démarrer le paiement'); }
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />

      {/* Auth Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={(open) => {
        setIsAuthDialogOpen(open);
        if (open) {
          // Reset form when dialog opens
          resetAuthForm();
        }
      }}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
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
              <Step1 formData={authFormData} handleInputChange={handleAuthInputChange} />
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
              <Button
                type="button"
                variant="ghost"
                onClick={toggleAuthMode}
                className="w-full h-11 text-slate-600 hover:text-slate-800"
              >
                Déjà un compte ? Se connecter
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {signupStep > 0 && <StepIndicator currentStep={signupStep} totalSteps={4} />}
              
              {signupStep === 0 ? (
                // Première étape après sélection du type : Email/Mot de passe (sans StepIndicator)
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <Step1 formData={authFormData} handleInputChange={handleAuthInputChange} onEnterKey={nextStep} />
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md w-full"
                    >
                      Suivant
                    </Button>
                  </div>
                </form>
              ) : signupStep === 4 ? (
                // Étape de confirmation (pas de formulaire)
                <Step4 email={authFormData.email} />
              ) : (
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  {signupStep === 1 && <Step2 formData={authFormData} handleInputChange={handleAuthInputChange} setFormData={setAuthFormData} onEnterKey={nextStep} />}
                  {signupStep === 2 && <Step3 formData={authFormData} handleInputChange={handleAuthInputChange} />}
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      className="h-11"
                      disabled={isSigningUp}
                    >
                      Précédent
                    </Button>
                    
                    {signupStep < 2 ? (
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

          {authMode === 'login' && (
            <div className="text-center text-sm mt-4">
              <p className="text-slate-600">
                Pas encore de compte ?{' '}
                <button type="button" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline" onClick={toggleAuthMode}>
                  S'inscrire
                </button>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upgrade Dialog for professionals hitting the limit */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Augmentez votre limite d'annonces</DialogTitle>
            <DialogDescription>
              {currentMaxListings ? `Votre quota de ${currentMaxListings} annonces est atteint.` : "Votre quota d'annonces est atteint."} Passez à l'offre Pro+ pour publier jusqu'à 500 annonces pour 29,99 € / mois.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>Plus tard</Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={async () => {
              try {
                await startProUpgradeCheckout();
              } catch (e: any) {
                toast.error(e?.message || 'Impossible de démarrer le paiement');
              }
            }}>Passer à Pro+</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellPage;
