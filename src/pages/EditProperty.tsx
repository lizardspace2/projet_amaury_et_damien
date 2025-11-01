import { Loader2 } from "lucide-react"; // Added Loader2 import
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPropertyById, updateProperty, CreatePropertyInput } from '@/lib/properties';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Property } from '@/types/property';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertyTypeStep from "@/components/property/add/PropertyTypeStep";
import AddPropertyStep1 from "@/components/property/add/AddPropertyStep1";
import AddPropertyStep2 from "@/components/property/add/AddPropertyStep2";
import AddPropertyStep3 from "@/components/property/add/AddPropertyStep3";
import AddPropertyStep4 from "@/components/property/add/AddPropertyStep4";
import StepsIndicator from "@/components/property/add/StepsIndicator";
import { useAuth } from '@/AuthContext';

const EditProperty = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading, initialized } = useAuth();

  const steps = [
    { number: 1, label: "Type d'annonce" },
    { number: 2, label: "Informations de base" },
    { number: 3, label: "Caractéristiques" },
    { number: 4, label: "Localisation" },
    { number: 5, label: "Publier" }
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePropertyInput>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (initialized && !authLoading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, initialized, navigate]);

  const { data: fetchedProperty, isLoading, isError, error } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyById(propertyId!),
    enabled: !!propertyId,
  });

  useEffect(() => {
    if (fetchedProperty) {
      setFormData({
        ...fetchedProperty,
        existingImageUrls: fetchedProperty.images,
      });
    } else if (isError) {
      toast.error("Failed to load property for editing.");
      console.error("Error fetching property:", error);
      navigate('/account'); // Redirect if property not found or error
    }
  }, [fetchedProperty, isError, error, navigate]);

  const updatePropertyMutation = useMutation({
    mutationFn: (data: { propertyId: string, input: Partial<CreatePropertyInput> }) =>
      updateProperty(data.propertyId, data.input),
    onSuccess: () => {
      toast.success("Annonce immobilière mise à jour avec succès !");
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      navigate('/account');
    },
    onError: (err) => {
      toast.error("Échec de la mise à jour de l'annonce immobilière.");
      console.error("Error updating property:", err);
    },
  });

  const handleNext = (data: Partial<CreatePropertyInput> & { existingImageUrls?: string[], removedImageUrls?: string[] }) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      images: data.images || prev.images,
      existingImageUrls: data.existingImageUrls || prev.existingImageUrls,
      removedImageUrls: data.removedImageUrls || prev.removedImageUrls,
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleFinalSubmit = async (data: Partial<CreatePropertyInput> & { existingImageUrls?: string[], removedImageUrls?: string[] }) => {
    if (!propertyId) {
      toast.error("Property ID is missing.");
      return;
    }

    const finalFormData = {
      ...formData,
      ...data,
    };

    updatePropertyMutation.mutate({ propertyId, input: finalFormData });
  };

  // Show loading state while checking authentication
  if (authLoading || !initialized) {
    return (
      <div>
        <Navbar />
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Chargement...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container py-8 text-center">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Chargement des détails de la propriété...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!fetchedProperty) {
    return (
      <div>
        <Navbar />
        <div className="container py-8 text-center">
          <p>Property not found or an error occurred.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative py-16 bg-estate-800">
          <div className="container text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              {"Modifier l'annonce immobilière"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-slate-200">
              {"Mettez à jour les informations de votre annonce."}
            </p>
          </div>
        </section>

        <section className="py-8 bg-white border-b">
          <div className="container">
            <StepsIndicator currentStep={currentStep} steps={steps} />
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-md">
                <CardContent className="p-6 md:p-8">
                  {currentStep === 1 && (
                    <PropertyTypeStep
                      initialData={formData}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 2 && (
                    <AddPropertyStep1
                      initialData={formData}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 3 && (
                    <AddPropertyStep2
                      initialData={formData}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 4 && (
                    <AddPropertyStep3
                      initialData={formData}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 5 && (
                    <AddPropertyStep4
                      initialData={formData}
                      onBack={handleBack}
                      isSubmitting={updatePropertyMutation.isPending}
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

export default EditProperty;
