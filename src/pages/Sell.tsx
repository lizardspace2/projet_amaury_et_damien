import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertyTypeStep from "@/components/property/add/PropertyTypeStep";
import AddPropertyStep1 from "@/components/property/add/AddPropertyStep1";
import AddPropertyStep2 from "@/components/property/add/AddPropertyStep2";
import AddPropertyStep3 from "@/components/property/add/AddPropertyStep3";
import AddPropertyStep4 from "@/components/property/add/AddPropertyStep4";
import StepsIndicator from "@/components/property/add/StepsIndicator";
import { CreatePropertyInput, createProperty } from "@/lib/api/properties";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/api/supabaseClient";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrapper } from "@googlemaps/react-wrapper";
import { signInWithEmail, signUpWithEmail } from "@/lib/api/auth";

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

const Step2 = ({ formData, handleInputChange, setFormData }: { formData: any; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; setFormData: React.Dispatch<React.SetStateAction<any>> }) => (
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
  </div>
);

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

const SellPage = () => {
  const steps = [
    { number: 1, label: "Authentification" },
    { number: 2, label: "Type d'annonce" },
    { number: 3, label: "Informations de base" },
    { number: 4, label: "Caractéristiques" },
    { number: 5, label: "Localisation" },
    { number: 6, label: "Publier" }
  ];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePropertyInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState(1);
  const [authFormData, setAuthFormData] = useState({
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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAuthFormData(prev => ({ ...prev, [id]: value }));
  };

  const resetAuthForm = () => {
    setAuthFormData({ 
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
    setSignupStep(1);
  };

  const nextStep = () => {
    setSignupStep(prev => prev + 1);
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
    const { email, password, ...profileData } = authFormData;
    const success = await signUpWithEmail(email, password, profileData);

    if (success) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('profiles')
          .update({
            phone: authFormData.phone,
            address: authFormData.address,
            profession: authFormData.profession,
            siret: authFormData.siret,
            instagram: authFormData.instagram,
            twitter: authFormData.twitter,
            facebook: authFormData.facebook,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }

      setIsAuthDialogOpen(false);
      resetAuthForm();
      toast.success("Inscription réussie");
    }
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
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erreur lors de la publication de l'annonce");
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
                        setFormData({ ...formData, ...data });
                        setStep(3);
                      }}
                    />
                  )}

                  {step === 3 && (
                    <AddPropertyStep1
                      onBack={() => setStep(2)}
                      onNext={(data) => {
                        console.log('AddPropertyStep1 data:', data);
                        setFormData({ ...formData, ...data });
                        setStep(4);
                      }}
                    />
                  )}

                  {step === 4 && (
                    <AddPropertyStep2
                      onBack={() => setStep(3)}
                      onNext={(data) => {
                        console.log('AddPropertyStep2 data:', data);
                        setFormData({ ...formData, ...data });
                        setStep(5);
                      }}
                    />
                  )}

                  {step === 5 && (
                    <AddPropertyStep3
                      onBack={() => setStep(4)}
                      onNext={(data) => {
                        console.log('AddPropertyStep3 data:', data);
                        setFormData({ ...formData, ...data });
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
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
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
          ) : (
            <div className="space-y-6">
              <StepIndicator currentStep={signupStep} totalSteps={3} />
              
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                {signupStep === 1 && <Step1 formData={authFormData} handleInputChange={handleAuthInputChange} />}
                {signupStep === 2 && <Step2 formData={authFormData} handleInputChange={handleAuthInputChange} setFormData={setAuthFormData} />}
                {signupStep === 3 && <Step3 formData={authFormData} handleInputChange={handleAuthInputChange} />}
                
                <div className="flex justify-between pt-4">
                  {signupStep > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      className="h-11"
                    >
                      Précédent
                    </Button>
                  )}
                  
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
    </div>
  );
};

const Sell = () => {
    const apiKey = "AIzaSyAjAs9O5AqVbaCZth-QDJm4KJfoq2ZzgUI";
    return (
        <Wrapper apiKey={apiKey} libraries={["places"]}>
            <SellPage />
        </Wrapper>
    )
}

export default Sell;
