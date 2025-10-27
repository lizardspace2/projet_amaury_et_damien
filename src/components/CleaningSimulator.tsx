import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CleaningSimulator: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cleaningDate: '',
    cleaningType: '',
    surface: '',
    rooms: '',
    frequency: '',
    includesDeepCleaning: false,
    includesWindows: false,
    includesCarpet: false,
    includesOffice: false,
    comment: '',
  });
  
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [costBreakdown, setCostBreakdown] = useState(null);

  const handleInputChange = (id: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const calculateCost = () => {
    const { cleaningType, surface, frequency, includesDeepCleaning, includesWindows, includesCarpet, includesOffice } = formData;
    
    if (!cleaningType || !surface) {
      toast.error('Veuillez remplir le type de nettoyage et la surface.');
      return;
    }

    const baseCost = 50;
    
    // Prix par m² selon le type de nettoyage
    const costPerSquareMeter = {
      'deep': 8,
      'regular': 5,
      'maintenance': 3,
      'window': 6,
      'carpet': 7,
      'office': 4,
    };
    
    const costPerM2 = costPerSquareMeter[cleaningType] || 5;
    const surfaceCost = parseFloat(surface) * costPerM2;

    // Multiplicateur de fréquence
    const frequencyMultiplier = {
      'one-time': 1,
      'weekly': 0.9,
      'bi-weekly': 0.85,
      'monthly': 0.8,
    };
    
    const multiplier = frequencyMultiplier[frequency] || 1;
    const frequencyAdjustedCost = (baseCost + surfaceCost) * multiplier;

    // Services additionnels
    const deepCleaningCost = includesDeepCleaning ? 80 : 0;
    const windowsCost = includesWindows ? parseFloat(surface) * 2 : 0;
    const carpetCost = includesCarpet ? parseFloat(surface) * 3 : 0;
    const officeCost = includesOffice ? 40 : 0;

    const totalCost = frequencyAdjustedCost + deepCleaningCost + windowsCost + carpetCost + officeCost;

    setEstimatedCost(totalCost);
    setCostBreakdown([
      { name: 'Coût de base', value: baseCost },
      { name: `Nettoyage ${cleaningType}`, value: surfaceCost },
      { name: 'Service nettoyage profond', value: deepCleaningCost },
      { name: 'Nettoyage vitres', value: windowsCost },
      { name: 'Nettoyage tapis', value: carpetCost },
      { name: 'Bureaux professionnels', value: officeCost },
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
      cleaningDate: '',
      cleaningType: '',
      surface: '',
      rooms: '',
      frequency: '',
      includesDeepCleaning: false,
      includesWindows: false,
      includesCarpet: false,
      includesOffice: false,
      comment: '',
    });
    setEstimatedCost(null);
    setCostBreakdown(null);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#19AFFF'];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Estimation gratuite de nettoyage</CardTitle>
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
                <Label htmlFor="cleaningDate">Date souhaitée</Label>
                <Input 
                  id="cleaningDate" 
                  type="date" 
                  value={formData.cleaningDate} 
                  onChange={(e) => handleInputChange('cleaningDate', e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Caractéristiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cleaningType">Type de nettoyage</Label>
                <Select onValueChange={(value) => handleInputChange('cleaningType', value)} defaultValue={formData.cleaningType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Nettoyage régulier</SelectItem>
                    <SelectItem value="deep">Nettoyage profond</SelectItem>
                    <SelectItem value="maintenance">Entretien courant</SelectItem>
                    <SelectItem value="window">Nettoyage vitres</SelectItem>
                    <SelectItem value="carpet">Nettoyage tapis</SelectItem>
                    <SelectItem value="office">Bureaux professionnels</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="frequency">Fréquence</Label>
                <Select onValueChange={(value) => handleInputChange('frequency', value)} defaultValue={formData.frequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">Ponctuel</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="bi-weekly">Bi-mensuel</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Options supplémentaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesDeepCleaning" 
                  checked={formData.includesDeepCleaning} 
                  onCheckedChange={(checked) => handleInputChange('includesDeepCleaning', checked)} 
                />
                <Label htmlFor="includesDeepCleaning">Nettoyage profond</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesWindows" 
                  checked={formData.includesWindows} 
                  onCheckedChange={(checked) => handleInputChange('includesWindows', checked)} 
                />
                <Label htmlFor="includesWindows">Nettoyage des vitres</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesCarpet" 
                  checked={formData.includesCarpet} 
                  onCheckedChange={(checked) => handleInputChange('includesCarpet', checked)} 
                />
                <Label htmlFor="includesCarpet">Nettoyage tapis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesOffice" 
                  checked={formData.includesOffice} 
                  onCheckedChange={(checked) => handleInputChange('includesOffice', checked)} 
                />
                <Label htmlFor="includesOffice">Bureaux professionnels</Label>
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
                  Prix indicatif. Un professionnel vous contactera pour un devis personnalisé.
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

export default CleaningSimulator;

