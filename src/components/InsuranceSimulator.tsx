import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const InsuranceSimulator: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    insuranceType: '',
    propertyType: '',
    propertyValue: '',
    surface: '',
    occupants: '',
    constructionYear: '',
    includesLiability: true,
    includesNaturalDisaster: true,
    includesTheft: true,
    comment: '',
  });
  
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [costBreakdown, setCostBreakdown] = useState(null);

  const handleInputChange = (id: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const calculateCost = () => {
    const { insuranceType, propertyValue, surface, occupants, constructionYear, includesLiability, includesNaturalDisaster, includesTheft } = formData;
    
    if (!insuranceType || !propertyValue || !surface) {
      toast.error('Veuillez remplir le type d\'assurance, la valeur du bien et la surface.');
      return;
    }

    const baseCost = 300;
    
    // Prix selon le type d'assurance
    const insuranceTypeMultiplier = {
      'home': 1,
      'condo': 0.6,
      'liability': 0.3,
      'multi-risk': 1.2,
      'rental': 0.8,
    };
    
    const multiplier = insuranceTypeMultiplier[insuranceType] || 1;
    
    // Prix selon la valeur du bien (taux d'assurance ~0.3% par an)
    const propertyValueNum = parseFloat(propertyValue);
    const annualCoverageRate = propertyValueNum * 0.003; // 0.3% de la valeur du bien
    const valueBasedCost = annualCoverageRate * multiplier;

    // Coûts additionnels selon la surface (assurance à l'intérieur)
    const surfaceCost = parseFloat(surface) * 5;
    
    // Multiplicateur selon le nombre d'occupants
    const occupantsMultiplier = parseFloat(occupants) * 50;

    // Réductions ou suppléments
    let supplements = 0;
    if (!includesLiability) supplements -= 50;
    if (includesNaturalDisaster) supplements += 80;
    if (includesTheft) supplements += 100;

    const totalCost = baseCost + valueBasedCost + surfaceCost + occupantsMultiplier + supplements;

    setEstimatedCost(totalCost);
    setCostBreakdown([
      { name: 'Coût de base', value: baseCost },
      { name: 'Couverture bien', value: valueBasedCost },
      { name: 'Couverture surface', value: surfaceCost },
      { name: 'Multiplicateur occupants', value: occupantsMultiplier },
      { name: 'Suppléments', value: supplements },
    ]);
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
      insuranceType: '',
      propertyType: '',
      propertyValue: '',
      surface: '',
      occupants: '',
      constructionYear: '',
      includesLiability: true,
      includesNaturalDisaster: true,
      includesTheft: true,
      comment: '',
    });
    setEstimatedCost(null);
    setCostBreakdown(null);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF'];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Estimation gratuite d'assurance</CardTitle>
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
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Caractéristiques du bien</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceType">Type d'assurance</Label>
                <Select onValueChange={(value) => handleInputChange('insuranceType', value)} defaultValue={formData.insuranceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Habitation principale</SelectItem>
                    <SelectItem value="condo">Résidence secondaire</SelectItem>
                    <SelectItem value="liability">Responsabilité civile</SelectItem>
                    <SelectItem value="multi-risk">Multirisque habitation</SelectItem>
                    <SelectItem value="rental">Locataire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyValue">Valeur du bien (€)</Label>
                <Input 
                  id="propertyValue" 
                  type="number" 
                  value={formData.propertyValue} 
                  onChange={(e) => handleInputChange('propertyValue', e.target.value)} 
                  placeholder="e.g., 350000" 
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
                <Label htmlFor="occupants">Nombre d'occupants</Label>
                <Input 
                  id="occupants" 
                  type="number" 
                  value={formData.occupants} 
                  onChange={(e) => handleInputChange('occupants', e.target.value)} 
                  placeholder="e.g., 3" 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Options de couverture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesLiability" 
                  checked={formData.includesLiability} 
                  onCheckedChange={(checked) => handleInputChange('includesLiability', checked)} 
                />
                <Label htmlFor="includesLiability">Responsabilité civile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesNaturalDisaster" 
                  checked={formData.includesNaturalDisaster} 
                  onCheckedChange={(checked) => handleInputChange('includesNaturalDisaster', checked)} 
                />
                <Label htmlFor="includesNaturalDisaster">Catastrophes naturelles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesTheft" 
                  checked={formData.includesTheft} 
                  onCheckedChange={(checked) => handleInputChange('includesTheft', checked)} 
                />
                <Label htmlFor="includesTheft">Vol et cambriolage</Label>
              </div>
            </div>
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

          {estimatedCost && (
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold">Estimation du coût</h2>
              <div className="bg-teal-50 p-6 rounded-lg">
                <p className="text-3xl font-bold text-teal-800">
                  {estimatedCost.toFixed(2)} €
                </p>
                <p className="text-sm text-teal-600 mt-2">
                  Prix indicatif annuel. Un conseiller vous contactera pour un devis personnalisé.
                </p>
              </div>

              {costBreakdown && (
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

export default InsuranceSimulator;

