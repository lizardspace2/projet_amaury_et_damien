import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertyTypeStep from "@/components/property/add/PropertyTypeStep";
import AddPropertyStep1 from "@/components/property/add/AddPropertyStep1";
import AddPropertyStep2 from "@/components/property/add/AddPropertyStep2";
import AddPropertyStep3 from "@/components/property/add/AddPropertyStep3";
import AddPropertyStep4 from "@/components/property/add/AddPropertyStep4";
import StepsIndicator from "@/components/property/add/StepsIndicator";
import { CreatePropertyInput, createProperty } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/AuthContext";
import { Wrapper } from "@googlemaps/react-wrapper";

const CreateAuctionPage = () => {
  const steps = [
    { number: 1, label: "Type de propriété" },
    { number: 2, label: "Informations de base" },
    { number: 3, label: "Caractéristiques" },
    { number: 4, label: "Localisation" },
    { number: 5, label: "Publier" }
  ];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePropertyInput>>({ listing_type: 'auction' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer une vente aux enchères.");
      navigate("/");
    }
  }, [user, navigate]);

  const handleFinalSubmit = async (data: Partial<CreatePropertyInput>) => {
    try {
      setIsSubmitting(true);
      const finalData = {
        ...formData,
        ...data,
      };
      await createProperty(finalData as CreatePropertyInput);
      toast.success("Annonce de vente aux enchères créée avec succès !");
      navigate("/auctions");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Erreur lors de la création de l'annonce.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative py-16 bg-estate-800">
          <div className="container text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              Créer une vente aux enchères
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-200">
              Remplissez les informations ci-dessous pour publier votre annonce.
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
                  {step === 1 && (
                    <PropertyTypeStep
                      fixedListingType="auction"
                      onNext={(data) => {
                        setFormData({ ...formData, ...data });
                        setStep(2);
                      }}
                    />
                  )}

                  {step === 2 && (
                    <AddPropertyStep1
                      onBack={() => setStep(1)}
                      onNext={(data) => {
                        setFormData({ ...formData, ...data });
                        setStep(3);
                      }}
                    />
                  )}

                  {step === 3 && (
                    <AddPropertyStep2
                      onBack={() => setStep(2)}
                      onNext={(data) => {
                        setFormData({ ...formData, ...data });
                        setStep(4);
                      }}
                    />
                  )}

                  {step === 4 && (
                    <AddPropertyStep3
                      onBack={() => setStep(3)}
                      onNext={(data) => {
                        setFormData({ ...formData, ...data });
                        setStep(5);
                      }}
                    />
                  )}

                  {step === 5 && (
                    <AddPropertyStep4
                      onBack={() => setStep(4)}
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
    </div>
  );
};

const CreateAuction = () => {
    const apiKey = "AIzaSyAjAs9O5AqVbaCZth-QDJm4KJfoq2ZzgUI";
    return (
        <Wrapper apiKey={apiKey} libraries={["places"]}>
            <CreateAuctionPage />
        </Wrapper>
    )
}

export default CreateAuction;
