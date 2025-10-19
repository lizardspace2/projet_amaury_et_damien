import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const interestRates: { [key: number]: number } = {
  7: 3.24,
  10: 3.38,
  15: 3.48,
  20: 3.58,
  25: 3.68,
};

const Capacite = () => {
  const [income, setIncome] = useState(2000);
  const [otherLoans, setOtherLoans] = useState(2);

  const maxMonthlyPayment = useMemo(() => {
    return (income * 0.33) - otherLoans;
  }, [income, otherLoans]);

  const borrowingCapacity = useMemo(() => {
    return Object.entries(interestRates).map(([years, annualRate]) => {
      const monthlyRate = annualRate / 12 / 100;
      const numberOfMonths = parseInt(years) * 12;
      const presentValue = maxMonthlyPayment * (1 - Math.pow(1 + monthlyRate, -numberOfMonths)) / monthlyRate;
      return {
        years: `${years} ans`,
        Capacité: Math.round(presentValue),
      };
    });
  }, [maxMonthlyPayment]);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Votre capacité d'emprunt</h1>
        <p className="text-lg text-slate-600 mb-8">Personnalisez la simulation en renseignant vos revenus et votre apport, afin de déterminer quel montant maximum vous pouvez emprunter auprès de la banque.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes outils</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="income">Revenus nets mensuels</Label>
                  <Input id="income" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="otherLoans">Autres crédits en cours</Label>
                  <Input id="otherLoans" type="number" value={otherLoans} onChange={(e) => setOtherLoans(Number(e.target.value))} />
                </div>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Vos mensualités</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{Math.round(maxMonthlyPayment)} €</p>
                    <p className="text-sm text-slate-500">Taux d'endettement estimé à 33.00%</p>
                </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Votre capacité d'emprunt maximum</CardTitle>
                <p className="text-sm text-slate-500">Calculée hors assurance : estimer mon assurance</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {borrowingCapacity.map((item, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-teal-600">{item.Capacité.toLocaleString()} €</p>
                      <p className="text-sm">pour un crédit sur {item.years}</p>
                      <p className="text-xs text-slate-500">(taux d'intérêt {interestRates[parseInt(item.years)]} %)</p>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={borrowingCapacity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="years" />
                        <YAxis width={80} tickFormatter={(value) => `${value.toLocaleString()} €`} />
                        <Tooltip formatter={(value: number) => `${value.toLocaleString()} €`} />
                        <Legend />
                        <Bar dataKey="Capacité" fill="#0d9488" />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Capacite;