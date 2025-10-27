import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const FurnishingSimulator: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    furnishingType: '',
    projectDate: '',
    surface: '',
    rooms: '',
    includesKitchen: false,
    includesBathroom: false,
    includesBedroom: false,
    includesLivingRoom: false,
    includesStorage: false,
    comment: '',
  });
  
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [costBreakdown, setCostBreakdown] = useState(null);

  const handleInputChange = (id: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const calculateCost = () => {
    const { furnishingType, surface, rooms, includesKitchen, includesBathroom, includesBedroom, includesLivingRoom, includesStorage } = formData;
    
    if (!furnishingType || !surface) {
      toast.error('Veuillez remplir le type d\'aménagement et la surface.');
      return;
    }

    const baseCost = 500;
    
    // Prix par m² selon le type d'aménagement
    const costPerSquareMeter = {
      'custom-furniture': 200,
      'design': 250,
      'maximize-space': 180,
      'open-plan': 160,
      'storage': 150,
      'functional': 140,
    };
    
    const costPerM2 = costPerSquareMeter[furnishingType] || 160;
    const surfaceCost = parseFloat(surface) * costPerM2;

    // Multiplicateur selon le nombre de pièces
    const roomsMultiplier = parseFloat(rooms) * 300;

    // Services par pièce
    const kitchenCost = includesKitchen ? 800 : 0;
    const bathroomCost = includesBathroom ? 600 : 0;
    const bedroomCost = includesBedroom ? 500 : 0;
    const livingRoomCost = includesLivingRoom ? 400 : 0;
    const storageCost = includesStorage ? 300 : 0;

    const totalCost = baseCost + surfaceCost + roomsMultiplier + kitchenCost + bathroomCost + bedroomCost + livingRoomCost + storageCost;

    setEstimatedCost(totalCost);
    setCostBreakdown([
      { name: 'Coût de base', value: baseCost },
      { name: 'Aménagement surface', value: surfaceCost },
      { name: 'Multiplicateur pièces', value: roomsMultiplier },
      { name: 'Cuisine', value: kitchenCost },
      { name: 'Salle de bain', value: bathroomCost },
      { name: 'Chambre', value: bedroomCost },
      { name: 'Salon', value: livingRoomCost },
      { name: 'Rangements', value: storageCost },
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
      furnishingType: '',
      projectDate: '',
      surface: '',
      rooms: '',
      includesKitchen: false,
      includesBathroom: false,
      includesBedroom: false,
      includesLivingRoom: false,
      includesStorage: false,
      comment: '',
    });
    setEstimatedCost(null);
    setCostBreakdown(null);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#19AFFF', '#FFC119'];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Estimation gratuite d'aménagement</CardTitle>
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
                <Label htmlFor="projectDate">Date souhaitée pour le projet</Label>
                <Input 
                  id="projectDate" 
                  type="date" 
                  value={formData.projectDate} 
                  onChange={(e) => handleInputChange('projectDate', e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Caractéristiques du projet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="furnishingType">Type d'aménagement</Label>
                <Select onValueChange={(value) => handleInputChange('furnishingType', value)} defaultValue={formData.furnishingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom-furniture">Meubles sur mesure</SelectItem>
                    <SelectItem value="design">Design intérieur</SelectItem>
                    <SelectItem value="maximize-space">Optimisation de l'espace</SelectItem>
                    <SelectItem value="open-plan">Aménagement ouvert</SelectItem>
                    <SelectItem value="storage">Rangements optimisés</SelectItem>
                    <SelectItem value="functional">Aménagement fonctionnel</SelectItem>
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
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Pièces à aménager</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesKitchen" 
                  checked={formData.includesKitchen} 
                  onCheckedChange={(checked) => handleInputChange('includesKitchen', checked)} 
                />
                <Label htmlFor="includesKitchen">Cuisine</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesBathroom" 
                  checked={formData.includesBathroom} 
                  onCheckedChange={(checked) => handleInputChange('includesBathroom', checked)} 
                />
                <Label htmlFor="includesBathroom">Salle de bain</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesBedroom" 
                  checked={formData.includesBedroom} 
                  onCheckedChange={(checked) => handleInputChange('includesBedroom', checked)} 
                />
                <Label htmlFor="includesBedroom">Chambre(s)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesLivingRoom" 
                  checked={formData.includesLivingRoom} 
                  onCheckedChange={(checked) => handleInputChange('includesLivingRoom', checked)} 
                />
                <Label htmlFor="includesLivingRoom">Salon/Séjour</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includesStorage" 
                  checked={formData.includesStorage} 
                  onCheckedChange={(checked) => handleInputChange('includesStorage', checked)} 
                />
                <Label htmlFor="includesStorage">Rangements/Dressing</Label>
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

export default FurnishingSimulator;

