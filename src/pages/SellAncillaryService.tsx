import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AncillaryServiceInput {
  service_type: string;
  description: string;
  estimated_cost?: number;
  provider_name: string;
  provider_contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  start_date: string;
  end_date?: string;
  metadata?: any;
}

const SellAncillaryService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AncillaryServiceInput>({
    service_type: '',
    description: '',
    estimated_cost: undefined,
    provider_name: '',
    provider_contact: {
      phone: '',
      email: '',
      website: ''
    },
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: undefined,
    metadata: {}
  });
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }
      
      // Fetch user profile to check user_type
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();
      
      setUserProfile(profile);
    };

    loadProfile();
  }, [user]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('provider_contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        provider_contact: {
          ...prev.provider_contact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMetadataChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour publier une annonce');
      return;
    }

    if (!formData.service_type) {
      toast.error('Veuillez sélectionner un type de service');
      return;
    }

    if (!formData.description) {
      toast.error('Veuillez fournir une description');
      return;
    }

    if (!formData.provider_name) {
      toast.error('Veuillez fournir le nom du prestataire');
      return;
    }

    try {
      setIsSubmitting(true);

      // Check if profile exists, create it if it doesn't
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        // Create profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }
      }

      const serviceData = {
        service_type: formData.service_type,
        description: formData.description,
        provider_name: formData.provider_name,
        provider_contact: formData.provider_contact,
        start_date: startDate ? format(startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        requested_by: user.id,
        metadata: formData.metadata || {},
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('ancillary_services')
        .insert([serviceData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Annonce de service annexe publiée avec succès');
      navigate('/account');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Erreur lors de la publication de l\'annonce');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMetadataFields = () => {
    switch (formData.service_type) {
      case 'travaux':
        return (
          <div className="space-y-2">
            <Label htmlFor="type_travaux">Type de travaux proposé</Label>
            <Input
              id="type_travaux"
              placeholder="Ex: Peinture, Plomberie, Électricité, Rénovation"
              onChange={(e) => handleMetadataChange('type_travaux', e.target.value)}
            />
          </div>
        );
      case 'demenagement':
        return (
          <div className="space-y-2">
            <Label htmlFor="types_demenagement">Types de déménagements proposés</Label>
            <Input
              id="types_demenagement"
              placeholder="Ex: Appartements, Maisons, Locaux commerciaux"
              onChange={(e) => handleMetadataChange('types_demenagement', e.target.value)}
            />
          </div>
        );
      case 'diagnostic':
        return (
          <div className="space-y-2">
            <Label htmlFor="types_diagnostics">Types de diagnostics proposés</Label>
            <Input
              id="types_diagnostics"
              placeholder="Ex: DPE, Amiante, Électricité, Gaz"
              onChange={(e) => handleMetadataChange('types_diagnostics', e.target.value)}
            />
          </div>
        );
      case 'nettoyage':
        return (
          <div className="space-y-2">
            <Label htmlFor="types_nettoyage">Types de nettoyage proposés</Label>
            <Input
              id="types_nettoyage"
              placeholder="Ex: Nettoyage fin de chantier, Nettoyage régulier"
              onChange={(e) => handleMetadataChange('types_nettoyage', e.target.value)}
            />
          </div>
        );
      case 'assurance':
        return (
          <div className="space-y-2">
            <Label htmlFor="types_assurances">Types d'assurances proposées</Label>
            <Input
              id="types_assurances"
              placeholder="Ex: Assurance habitation, PNO, Responsabilité civile"
              onChange={(e) => handleMetadataChange('types_assurances', e.target.value)}
            />
          </div>
        );
      case 'amenagement':
        return (
          <div className="space-y-2">
            <Label htmlFor="types_amenagement">Types d'aménagement proposés</Label>
            <Input
              id="types_amenagement"
              placeholder="Ex: Cloisons, Cuisine, Salle de bain"
              onChange={(e) => handleMetadataChange('types_amenagement', e.target.value)}
            />
          </div>
        );
      case 'autre':
        return (
          <div className="space-y-2">
            <Label htmlFor="specialisation">Spécialisation</Label>
            <Input
              id="specialisation"
              placeholder="Ex: Décoration, Conseil, Design"
              onChange={(e) => handleMetadataChange('specialisation', e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-background">
        <section className="relative py-16 bg-gradient-to-r from-amber-500 to-orange-600">
          <div className="container text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              Publier un service annexe
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-white">
              Proposez vos services aux acheteurs immobiliers
            </p>
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {/* Check if user is a Particular - only Professionals and Partners can publish */}
              {userProfile?.user_type === 'Particulier' ? (
                <Card className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold text-slate-800 mb-4">
                        Publication réservée aux professionnels
                      </h2>
                      <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                        La publication de services annexes est réservée aux professionnels et partenaires.
                        En tant que particulier, vous pouvez consulter et contacter les annonces de services disponibles.
                      </p>
                      <div className="space-y-4">
                        <Button 
                          onClick={() => navigate('/ancillary-services')}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                        >
                          Consulter les annonces de services
                        </Button>
                        <div>
                          <Button 
                            onClick={() => navigate(-1)}
                            variant="outline"
                          >
                            Retour
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : !user ? (
                <Card className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold text-slate-800 mb-4">
                        Connexion requise
                      </h2>
                      <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                        Vous devez être connecté en tant que professionnel ou partenaire pour publier un service annexe.
                      </p>
                      <div className="space-y-4">
                        <Button 
                          onClick={() => navigate('/ancillary-services')}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                        >
                          Consulter les annonces
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Informations sur le service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type de service */}
                    <div className="space-y-2">
                      <Label htmlFor="service_type" className="text-sm font-medium">
                        Type de service <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.service_type}
                        onValueChange={(value) => handleSelectChange('service_type', value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Sélectionnez un type de service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="demenagement">Déménagement</SelectItem>
                          <SelectItem value="travaux">Travaux</SelectItem>
                          <SelectItem value="diagnostic">Diagnostic</SelectItem>
                          <SelectItem value="nettoyage">Nettoyage</SelectItem>
                          <SelectItem value="assurance">Assurance</SelectItem>
                          <SelectItem value="amenagement">Aménagement</SelectItem>
                          <SelectItem value="courtier">Courtier</SelectItem>
                          <SelectItem value="notaire">Notaire</SelectItem>
                          <SelectItem value="banque">Banque</SelectItem>
                          <SelectItem value="artisan">Artisan</SelectItem>
                          <SelectItem value="gestionnaire_patrimoine">Gestionnaire de patrimoine</SelectItem>
                          <SelectItem value="geometre">Géomètre</SelectItem>
                          <SelectItem value="maitre_oeuvre">Maître d’œuvre</SelectItem>
                          <SelectItem value="architecte">Architecte</SelectItem>
                          <SelectItem value="amo">Assistant maîtrise d’ouvrage</SelectItem>
                          <SelectItem value="promoteur_lotisseur">Promoteur / lotisseur</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Décrivez le service que vous proposez ou recherchez"
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    {/* Métadonnées spécifiques */}
                    {formData.service_type && (
                      <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold text-slate-700">
                          Détails spécifiques
                        </h4>
                        {renderMetadataFields()}
                      </div>
                    )}

                    {/* Informations prestataire */}
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-slate-700">Informations du prestataire</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="provider_name">
                          Nom du prestataire <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="provider_name"
                          name="provider_name"
                          value={formData.provider_name}
                          onChange={handleInputChange}
                          placeholder="Nom de l'entreprise ou du professionnel"
                          className="h-11"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="provider_contact.phone">Téléphone</Label>
                          <Input
                            id="provider_contact.phone"
                            name="provider_contact.phone"
                            type="tel"
                            value={formData.provider_contact.phone}
                            onChange={handleInputChange}
                            placeholder="+33 1 23 45 67 89"
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="provider_contact.email">Email</Label>
                          <Input
                            id="provider_contact.email"
                            name="provider_contact.email"
                            type="email"
                            value={formData.provider_contact.email}
                            onChange={handleInputChange}
                            placeholder="contact@example.com"
                            className="h-11"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="provider_contact.website">Site web</Label>
                          <Input
                            id="provider_contact.website"
                            name="provider_contact.website"
                            type="url"
                            value={formData.provider_contact.website}
                            onChange={handleInputChange}
                            placeholder="https://example.com"
                            className="h-11"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Période de validité */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Annonce valable du</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-11 justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? (
                                format(startDate, 'PPP', { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Au (optionnel)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full h-11 justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? (
                                format(endDate, 'PPP', { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              disabled={(date) => startDate ? date < startDate : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="h-11"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md"
                      >
                        {isSubmitting ? 'Publication...' : 'Publier le service'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default SellAncillaryService;

