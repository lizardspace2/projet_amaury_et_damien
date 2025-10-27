import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Autocomplete from '@/components/Autocomplete';

const WorksSimulator: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    workDate: '',
    workType: '',
    surface: '',
    rooms: '',
    floor: '',
    hasElevator: false,
    address: '',
    needsPermit: false,
    includesElectricity: false,
    includesPlumbing: false,
    includesPainting: false,
    includesFlooring: false,
    comment: '',
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

  const calculateCost = () => {
    const { workType, surface, rooms, includesElectricity, includesPlumbing, includesPainting, includesFlooring } = formData;
    
    if (!workType || !surface) {
      toast.error('Veuillez remplir le type de travaux et la surface.');
      return;
    }

    const baseCost = 300;
    const costPerSquareMeter = {
      'renovation': 80,
      'painting': 25,
      'plumbing': 60,
      'electricity': 50,
      'flooring': 40,
      'bathroom': 120,
      'kitchen': 100,
      'full-renovation': 90,
    };
    
    const costPerM2 = costPerSquareMeter[workType] || 50;
    const surfaceCost = parseFloat(surface) * costPerM2;
    const roomsMultiplier = parseFloat(rooms) * 50;

    // Additional work costs
    const electricityCost = includesElectricity ? parseFloat(surface) * 15 : 0;
    const plumbingCost = includesPlumbing ? parseFloat(surface) * 20 : 0;
    const paintingCost = includesPainting ? parseFloat(surface) * 10 : 0;
    const flooringCost = includesFlooring ? parseFloat(surface) * 35 : 0;

    const totalCost = baseCost + surfaceCost + roomsMultiplier + electricityCost + plumbingCost + paintingCost + flooringCost;

    setEstimatedCost(totalCost);
    setCostBreakdown([
      { name: 'Coût de base', value: baseCost },
      { name: `Coût ${workType}`, value: surfaceCost },
      { name: 'Multiplicateur pièces', value: roomsMultiplier },
      { name: 'Électricité', value: electricityCost },
      { name: 'Plomberie', value: plumbingCost },
      { name: 'Peinture', value: paintingCost },
      { name: 'Sol', value: flooringCost },
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
      workDate: '',
      workType: '',
      surface: '',
      rooms: '',
      floor: '',
      hasElevator: false,
      address: '',
      needsPermit: false,
      includesElectricity: false,
      includesPlumbing: false,
      includesPainting: false,
      includesFlooring: false,
      comment: '',
    });
    setEstimatedCost(null);
    setCostBreakdown(null);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#19AFFF'];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Estimation gratuite de travaux</CardTitle>
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
                <Label htmlFor="workDate">Date souhaitée pour les travaux</Label>
                <Input 
                  id="workDate" 
                  type="date" 
                  value={formData.workDate} 
                  onChange={(e) => handleInputChange('workDate', e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Caractéristiques de votre bien</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Autocomplete
                  label=""
                  placeholder="Entrez votre adresse"
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
                <Label htmlFor="rooms">Nombre de pièces</Label>
                <Select onValueChange={(value) => handleInputChange('rooms', value)} defaultValue={formData.rooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nombre de pièces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 pièce</SelectItem>
                    <SelectItem value="2">2 pièces</SelectItem>
                    <SelectItem value="3">3 pièces</SelectItem>
                    <SelectItem value="4">4 pièces</SelectItem>
                    <SelectItem value="5">5 pièces</SelectItem>
                    <SelectItem value="6+">6+ pièces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Étage</Label>
                <Select onValueChange={(value) => handleInputChange('floor', value)} defaultValue={formData.floor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un étage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maison">Maison</SelectItem>
                    <SelectItem value="Rez-de-chaussée">Rez-de-chaussée</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5+">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="hasElevator" 
                  checked={formData.hasElevator} 
                  onCheckedChange={(checked) => handleInputChange('hasElevator', checked)} 
                />
                <Label htmlFor="hasElevator">Ascenseur</Label>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Type de travaux souhaités</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workType">Type de travaux</Label>
                <Select onValueChange={(value) => handleInputChange('workType', value)} defaultValue={formData.workType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type de travaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renovation">Rénovation complète</SelectItem>
                    <SelectItem value="painting">Peinture</SelectItem>
                    <SelectItem value="plumbing">Plomberie</SelectItem>
                    <SelectItem value="electricity">Électricité</SelectItem>
                    <SelectItem value="flooring">Sol/Carrelage</SelectItem>
                    <SelectItem value="bathroom">Salle de bain</SelectItem>
                    <SelectItem value="kitchen">Cuisine</SelectItem>
                    <SelectItem value="full-renovation">Rénovation complète + électricité + plomberie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Commentaires (optionnel)</Label>
                <Input 
                  id="comment" 
                  value={formData.comment} 
                  onChange={(e) => handleInputChange('comment', e.target.value)} 
                  placeholder="Spécifications supplémentaires..."
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Travaux supplémentaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesElectricity" 
                  checked={formData.includesElectricity} 
                  onCheckedChange={(checked) => handleInputChange('includesElectricity', checked)} 
                />
                <Label htmlFor="includesElectricity">Travaux électriques</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesPlumbing" 
                  checked={formData.includesPlumbing} 
                  onCheckedChange={(checked) => handleInputChange('includesPlumbing', checked)} 
                />
                <Label htmlFor="includesPlumbing">Travaux de plomberie</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesPainting" 
                  checked={formData.includesPainting} 
                  onCheckedChange={(checked) => handleInputChange('includesPainting', checked)} 
                />
                <Label htmlFor="includesPainting">Peinture</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesFlooring" 
                  checked={formData.includesFlooring} 
                  onCheckedChange={(checked) => handleInputChange('includesFlooring', checked)} 
                />
                <Label htmlFor="includesFlooring">Sol/Carrelage</Label>
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

export default WorksSimulator;

