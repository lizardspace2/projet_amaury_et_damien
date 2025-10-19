import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const departments = [
    { value: "01", label: "01 - Ain" },
    { value: "02", label: "02 - Aisne" },
    { value: "03", label: "03 - Allier" },
    // Add all departments...
    { value: "75", label: "75 - Paris" },
    { value: "69", label: "69 - Rhône" },
];

const FraisNotaire = () => {
  const [propertyPrice, setPropertyPrice] = useState(5966555);
  const [propertyState, setPropertyState] = useState('ancien');
  const [department, setDepartment] = useState('69');

  const notaryFees = useMemo(() => {
    const rate = propertyState === 'ancien' ? 0.08 : 0.03;
    return propertyPrice * rate;
  }, [propertyPrice, propertyState]);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Calculez vos frais de notaire</h1>
        <p className="text-lg text-slate-600 mb-8">N'oubliez pas de prendre en compte les frais de notaire dans le montant total de votre projet d'achat. Ils représentent environ 8% du prix du bien dans l'ancien et 3% dans le neuf.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Simulateur de frais de notaire</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="propertyPrice">Prix du bien</Label>
                            <Input id="propertyPrice" type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} />
                        </div>
                        <div>
                            <Label>État du bien</Label>
                            <RadioGroup value={propertyState} onValueChange={setPropertyState} className="flex gap-4 pt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ancien" id="ancien" />
                                    <Label htmlFor="ancien">Ancien</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="neuf" id="neuf" />
                                    <Label htmlFor="neuf">Neuf</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div>
                            <Label htmlFor="department">Département</Label>
                            <Select value={department} onValueChange={setDepartment}>
                                <SelectTrigger id="department">
                                    <SelectValue placeholder="Sélectionnez un département" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(dep => (
                                        <SelectItem key={dep.value} value={dep.value}>{dep.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Frais de notaire estimés</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-teal-600">{Math.round(notaryFees).toLocaleString()} €</p>
                        <p className="text-sm text-slate-500">pour un bien dans l'{propertyState}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FraisNotaire;