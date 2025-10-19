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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrapper } from "@googlemaps/react-wrapper";

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
  const [authFormData, setAuthFormData] = useState({
    email: "",
    password: "",
    phone: "",
    address: "",
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signInWithEmail(authFormData.email, authFormData.password);

    if (success) {
      setIsAuthDialogOpen(false);
      setAuthFormData({
        email: "",
        password: "",
        phone: "",
        address: "",
        instagram: "",
        twitter: "",
        facebook: ""
      });
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
            instagram: authFormData.instagram,
            twitter: authFormData.twitter,
            facebook: authFormData.facebook,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }

      setIsAuthDialogOpen(false);
      setAuthFormData({
        email: "",
        password: "",
        phone: "",
        address: "",
        instagram: "",
        twitter: "",
        facebook: ""
      });
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
            <DialogTitle className="text-2xl font-bold text-estate-800">
              {authMode === "login" ? "Se connecter" : "Créer un compte"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <form onSubmit={authMode === "login" ? handleEmailLogin : handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{"Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={authFormData.email}
                  onChange={handleAuthInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{"Mot de passe"}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={authFormData.password}
                  onChange={handleAuthInputChange}
                  required
                />
              </div>

              {authMode === "signup" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{"Téléphone"}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Entrez votre numéro de téléphone"
                      value={authFormData.phone}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{"Adresse"}</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Entrez votre adresse"
                      value={authFormData.address}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">{"Instagram"}</Label>
                    <Input
                      id="instagram"
                      type="text"
                      placeholder="@yourusername"
                      value={authFormData.instagram}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">{"Twitter"}</Label>
                    <Input
                      id="twitter"
                      type="text"
                      placeholder="@yourusername"
                      value={authFormData.twitter}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">{"Facebook"}</Label>
                    <Input
                      id="facebook"
                      type="text"
                      placeholder="Lien vers votre profil"
                      value={authFormData.facebook}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
                {authMode === "login" ? "Se connecter" : "S'inscrire"}
              </Button>
            </form>

            <div className="text-center text-sm">
              {authMode === "login" ? (
                <>
                  {"Vous n'avez pas de compte ?"}{" "}
                  <button
                    type="button"
                    className="text-teal-600 hover:underline"
                    onClick={() => setAuthMode("signup")}
                  >
                    {"S'inscrire"}
                  </button>
                </>
              ) : (
                <>
                  {"Vous avez déjà un compte ?"}{" "}
                  <button
                    type="button"
                    className="text-teal-600 hover:underline"
                    onClick={() => setAuthMode("login")}
                  >
                    {"Se connecter"}
                  </button>
                </>
              )}
            </div>
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
