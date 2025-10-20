import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

// Taux d'intérêt moyens estimés (en l'absence de données de recherche en temps réel)
const averageRates = {
  '10': 3.5,
  '15': 3.8,
  '20': 4.0,
  '25': 4.2,
};

const CreditPage = () => {
  const [loanAmount, setLoanAmount] = useState('200000');
  const [loanDuration, setLoanDuration] = useState('20');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const durationInYears = parseInt(loanDuration, 10);
    const annualRate = averageRates[loanDuration as keyof typeof averageRates];

    if (isNaN(principal) || principal <= 0) {
      setMonthlyPayment(null);
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = durationInYears * 12;

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(payment);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous intégreriez la logique d'envoi de formulaire (par exemple, un appel API)
    console.log({ name, email, phone, message });
    alert('Votre demande a été envoyée. Un courtier vous contactera bientôt.');
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Simulateur de Crédit */}
          <Card>
            <CardHeader>
              <CardTitle>Simulateur de Crédit Immobilier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="loanAmount">Montant du prêt (€)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="Ex: 250000"
                  />
                </div>
                <div>
                  <Label htmlFor="loanDuration">Durée du prêt (années)</Label>
                  <Select value={loanDuration} onValueChange={setLoanDuration}>
                    <SelectTrigger id="loanDuration">
                      <SelectValue placeholder="Sélectionnez la durée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 ans</SelectItem>
                      <SelectItem value="15">15 ans</SelectItem>
                      <SelectItem value="20">20 ans</SelectItem>
                      <SelectItem value="25">25 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={calculateMonthlyPayment} className="w-full">
                  Calculer la mensualité
                </Button>
                {monthlyPayment !== null && (
                  <div className="text-center text-lg font-semibold mt-4">
                    <p>Votre mensualité estimée est de :</p>
                    <p className="text-2xl text-primary">{monthlyPayment.toFixed(2)} € / mois</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-2">
                  * Taux estimés : 10 ans: {averageRates['10']}%, 15 ans: {averageRates['15']}%, 20 ans: {averageRates['20']}%, 25 ans: {averageRates['25']}%. Ces calculs sont des estimations et ne constituent pas une offre de prêt.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de Contact Courtier */}
          <Card>
            <CardHeader>
              <CardTitle>Être recontacté par un courtier</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="message">Votre message (facultatif)</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">
                  Envoyer la demande
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreditPage;