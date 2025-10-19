import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const loanDuration = 20; // years
const annualInterestRate = 3.58; // %
const notaryFeesRate = 0.075; // 7.5%

const COLORS = ['#0d9488', '#0f766e', '#115e59', '#134e4a'];

const Mensualites = () => {
  const [propertyPrice, setPropertyPrice] = useState(5966555);
  const [worksCost, setWorksCost] = useState(0);
  const [personalContribution, setPersonalContribution] = useState(0);

  const notaryFees = useMemo(() => {
    return propertyPrice * notaryFeesRate;
  }, [propertyPrice]);

  const amountToBorrow = useMemo(() => {
    return propertyPrice + notaryFees + worksCost - personalContribution;
  }, [propertyPrice, notaryFees, worksCost, personalContribution]);

  const monthlyPayment = useMemo(() => {
    if (amountToBorrow <= 0) return 0;
    const monthlyRate = annualInterestRate / 12 / 100;
    const numberOfMonths = loanDuration * 12;
    const p = amountToBorrow * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    return p;
  }, [amountToBorrow]);

  const totalCost = useMemo(() => {
      if (amountToBorrow <= 0) return propertyPrice;
      return monthlyPayment * loanDuration * 12;
  }, [monthlyPayment, propertyPrice]);

  const totalInterest = useMemo(() => {
      if (amountToBorrow <= 0) return 0;
      return totalCost - amountToBorrow;
  }, [totalCost, amountToBorrow]);

  const costDetailsData = [
    { name: 'Prix du bien', value: propertyPrice },
    { name: 'Frais de notaire', value: Math.round(notaryFees) },
    { name: 'Travaux', value: worksCost },
    { name: 'Intérêts d\'emprunt', value: Math.round(totalInterest) },
  ];

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Mon financement</h1>
        <p className="text-lg text-slate-600 mb-8">Calculez le coût total de votre projet, en prenant en compte tous les éléments : frais de notaire, travaux, montant des intérêts ... Puis personnalisez vos résultats avec votre situation personnelle.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Simulateur de mensualités</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="propertyPrice">Prix du bien</Label>
                            <Input id="propertyPrice" type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} />
                        </div>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Ajouter mes revenus et mon apport</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <div>
                                        <Label htmlFor="worksCost">Coût des travaux</Label>
                                        <Input id="worksCost" type="number" value={worksCost} onChange={(e) => setWorksCost(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <Label htmlFor="personalContribution">Apport personnel</Label>
                                        <Input id="personalContribution" type="number" value={personalContribution} onChange={(e) => setPersonalContribution(Number(e.target.value))} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Mensualités estimées</CardTitle>
                        <p className="text-sm text-slate-500">sur {loanDuration} ans - taux d'intérêt {annualInterestRate} %</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-teal-600">{Math.round(monthlyPayment).toLocaleString()} €<span className="text-lg font-normal text-slate-500">/mois</span></p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Coût total de votre projet</CardTitle>
                        <p className="text-sm text-slate-500">sur {loanDuration} ans - taux d'intérêt {annualInterestRate} %</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{Math.round(totalCost).toLocaleString()} €</p>
                        <Accordion type="single" collapsible className="w-full mt-4">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Afficher le détails des coûts</AccordionTrigger>
                                <AccordionContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={costDetailsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                                {costDetailsData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => `${value.toLocaleString()} €`} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Comment réduire vos mensualités ?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Économisez sur le coût de votre emprunt grâce à notre courtier partenaire Pretto.</p>
                <Button asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">Faire une simulation Pretto</a>
                </Button>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Mensualites;