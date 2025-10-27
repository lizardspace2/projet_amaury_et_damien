import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Autocomplete from '@/components/Autocomplete';

const DiagnosticsSimulator: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    requestedDate: '',
    address: '',
    surface: '',
    constructionYear: '',
    propertyType: '',
    hasCollectiveSewer: true,
    isInTermiteZone: false,
    isInNoiseZone: false,
  });
  
  // Diagnostic selection
  const [selectedDiagnostics, setSelectedDiagnostics] = useState({
    DPE: true,
    Amiante: false,
    Plomb: false,
    Electricite: false,
    Gaz: false,
    ERP: true,
    Termites: false,
    Assainissement: false,
    Bruit: false,
  });

  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [costBreakdown, setCostBreakdown] = useState(null);

  const handleInputChange = (id: string, value: string | google.maps.places.PlaceResult | boolean) => {
    if (typeof value === 'string' || typeof value === 'boolean') {
      setFormData(prev => ({ ...prev, [id]: value }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value.formatted_address }));
    }
  };

  const handleDiagnosticChange = (diagnostic: string, checked: boolean) => {
    setSelectedDiagnostics(prev => ({ ...prev, [diagnostic]: checked }));
  };

  const calculateCost = () => {
    const { surface, constructionYear, isInTermiteZone, hasCollectiveSewer, isInNoiseZone } = formData;
    
    if (!surface || !constructionYear) {
      toast.error('Veuillez remplir la surface et l\'année de construction.');
      return;
    }

    // Prix des diagnostics en euros (prix indicatifs moyens)
    const diagnosticPrices = {
      DPE: 100,
      Amiante: 150,
      Plomb: 150,
      Electricite: 120,
      Gaz: 120,
      ERP: 15,
      Termites: 100,
      Assainissement: 150,
      Bruit: 80,
    };

    // Multiplicateurs selon la surface
    const getSurfaceMultiplier = (surface: number) => {
      if (surface < 50) return 0.8;
      if (surface < 100) return 1;
      if (surface < 150) return 1.2;
      return 1.5;
    };

    const surfaceMultiplier = getSurfaceMultiplier(parseFloat(surface));
    const baseBreakdown = [];

    // DPE - Toujours obligatoire
    if (selectedDiagnostics.DPE) {
      baseBreakdown.push({ 
        name: 'DPE - Diagnostic de performance énergétique', 
        value: diagnosticPrices.DPE * surfaceMultiplier 
      });
    }

    // Amiante - Si logement construit avant 1997
    if (selectedDiagnostics.Amiante && parseInt(constructionYear) < 1997) {
      baseBreakdown.push({ 
        name: 'Diagnostic Amiante', 
        value: diagnosticPrices.Amiante * surfaceMultiplier 
      });
    }

    // Plomb - Si logement construit avant 1949
    if (selectedDiagnostics.Plomb && parseInt(constructionYear) < 1949) {
      baseBreakdown.push({ 
        name: 'CREP - Diagnostic Plomb', 
        value: diagnosticPrices.Plomb 
      });
    }

    // Électricité
    if (selectedDiagnostics.Electricite) {
      baseBreakdown.push({ 
        name: 'Diagnostic Électricité', 
        value: diagnosticPrices.Electricite 
      });
    }

    // Gaz
    if (selectedDiagnostics.Gaz) {
      baseBreakdown.push({ 
        name: 'Diagnostic Gaz', 
        value: diagnosticPrices.Gaz 
      });
    }

    // ERP - Toujours obligatoire
    if (selectedDiagnostics.ERP) {
      baseBreakdown.push({ 
        name: 'ERP - État des Risques et Pollutions', 
        value: diagnosticPrices.ERP 
      });
    }

    // Termites - Si dans zone infestée
    if (selectedDiagnostics.Termites && isInTermiteZone) {
      baseBreakdown.push({ 
        name: 'Diagnostic Termites', 
        value: diagnosticPrices.Termites 
      });
    }

    // Assainissement - Si pas raccordé au tout-à-l'égout
    if (selectedDiagnostics.Assainissement && !hasCollectiveSewer) {
      baseBreakdown.push({ 
        name: 'Diagnostic Assainissement', 
        value: diagnosticPrices.Assainissement 
      });
    }

    // Bruit - Si zone de bruit aérien
    if (selectedDiagnostics.Bruit && isInNoiseZone) {
      baseBreakdown.push({ 
        name: 'Diagnostic Bruit', 
        value: diagnosticPrices.Bruit 
      });
    }

    const totalCost = baseBreakdown.reduce((sum, item) => sum + item.value, 0);

    setEstimatedCost(totalCost);
    setCostBreakdown(baseBreakdown);
  };

  const handleRequestCallback = () => {
    if (!formData.phone && !formData.email) {
      toast.error('Veuillez entrer votre numéro de téléphone ou votre email.');
      return;
    }
    toast.success('Votre demande de rappel a été envoyée avec succès !');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      requestedDate: '',
      address: '',
      surface: '',
      constructionYear: '',
      propertyType: '',
      hasCollectiveSewer: true,
      isInTermiteZone: false,
      isInNoiseZone: false,
    });
    setSelectedDiagnostics({
      DPE: true,
      Amiante: false,
      Plomb: false,
      Electricite: false,
      Gaz: false,
      ERP: true,
      Termites: false,
      Assainissement: false,
      Bruit: false,
    });
    setEstimatedCost(null);
    setCostBreakdown(null);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#19AFFF', '#FFC119'];

  // Auto-select diagnostics based on property characteristics
  useEffect(() => {
    const year = parseInt(formData.constructionYear);
    if (year) {
      const newDiagnostics = { ...selectedDiagnostics };
      
      // Auto-select Amiante if built before 1997
      if (year < 1997) {
        newDiagnostics.Amiante = true;
      }
      
      // Auto-select Plomb if built before 1949
      if (year < 1949) {
        newDiagnostics.Plomb = true;
      }
      
      // Auto-select Électricité and Gaz if older than 15 years
      const age = new Date().getFullYear() - year;
      if (age > 15) {
        newDiagnostics.Electricite = true;
        newDiagnostics.Gaz = true;
      }
      
      setSelectedDiagnostics(newDiagnostics);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.constructionYear]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Estimation gratuite des diagnostics immobiliers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Informations générales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={(e) => handleInputChange('firstName', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={(e) => handleInputChange('lastName', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedDate">Date souhaitée</Label>
                <Input 
                  id="requestedDate" 
                  type="date" 
                  value={formData.requestedDate} 
                  onChange={(e) => handleInputChange('requestedDate', e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Caractéristiques du bien</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse du bien</Label>
                <Autocomplete
                  label=""
                  placeholder="Entrez l'adresse du bien"
                  onPlaceChanged={(place) => handleInputChange('address', place)}
                  value={formData.address}
                  onChange={(value) => handleInputChange('address', value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surface">Surface (m²)</Label>
                <Input 
                  id="surface" 
                  type="number" 
                  value={formData.surface} 
                  onChange={(e) => handleInputChange('surface', e.target.value)} 
                  placeholder="e.g., 75" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="constructionYear">Année de construction</Label>
                <Input 
                  id="constructionYear" 
                  type="number" 
                  value={formData.constructionYear} 
                  onChange={(e) => handleInputChange('constructionYear', e.target.value)} 
                  placeholder="e.g., 1990" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Type de logement</Label>
                <Select onValueChange={(value) => handleInputChange('propertyType', value)} defaultValue={formData.propertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de logement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="maison">Maison</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Informations spécifiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="hasCollectiveSewer" 
                  checked={formData.hasCollectiveSewer} 
                  onCheckedChange={(checked) => handleInputChange('hasCollectiveSewer', checked)} 
                />
                <Label htmlFor="hasCollectiveSewer">Raccordé au tout-à-l'égout</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isInTermiteZone" 
                  checked={formData.isInTermiteZone} 
                  onCheckedChange={(checked) => handleInputChange('isInTermiteZone', checked)} 
                />
                <Label htmlFor="isInTermiteZone">En zone infestée (termites)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isInNoiseZone" 
                  checked={formData.isInNoiseZone} 
                  onCheckedChange={(checked) => handleInputChange('isInNoiseZone', checked)} 
                />
                <Label htmlFor="isInNoiseZone">En zone de bruit aérien</Label>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Diagnostics obligatoires détectés :</h3>
            <ul className="text-sm space-y-1">
              <li>✓ DPE - Obligatoire pour tous les logements (10 ans)</li>
              <li>✓ ERP - Obligatoire pour tous les logements (6 mois)</li>
              {parseInt(formData.constructionYear) < 1997 && (
                <li>✓ Amiante - Obligatoire si construit avant 1997</li>
              )}
              {parseInt(formData.constructionYear) < 1949 && (
                <li>✓ Plomb - Obligatoire si construit avant 1949</li>
              )}
            </ul>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={calculateCost}>
              Estimer le coût
            </Button>
            <Button 
              onClick={handleRequestCallback}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              Demander un rappel
            </Button>
          </div>

          {estimatedCost !== null && estimatedCost > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold">Estimation du coût des diagnostics</h2>
              <div className="bg-teal-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-teal-800">
                  {estimatedCost.toFixed(2)} €
                </p>
                <p className="text-sm text-teal-600 mt-2">
                  Prix indicatif. Un professionnel certifié vous contactera pour confirmer les diagnostics nécessaires.
                </p>
              </div>

              {costBreakdown && costBreakdown.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Répartition des coûts</h3>
                    <div className="space-y-2">
                      {costBreakdown.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-slate-600">{item.name}</span>
                          <span className="font-semibold">{item.value.toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <PieChart width={300} height={300}>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toFixed(2)} €`} />
                      <Legend />
                    </PieChart>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticsSimulator;

