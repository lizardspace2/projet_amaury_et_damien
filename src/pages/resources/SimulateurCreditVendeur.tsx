import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const fmtCurrency = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const toNumber = (v: string, fallback = 0) => {
  const n = Number((v || "").replace(/\s/g, "").replace(",", "."));
  return isNaN(n) ? fallback : n;
};

type Inputs = {
  prixBien: number;
  apport: number;
  financementVendeur: number;
  tauxInteret: number;
  dureeAnnees: number;
};

export default function SimulateurCreditVendeur() {
  const [inputs, setInputs] = useState<Inputs>({
    prixBien: 250000,
    apport: 50000,
    financementVendeur: 200000,
    tauxInteret: 3.5,
    dureeAnnees: 15,
  });

  const tauxMensuel = useMemo(() => inputs.tauxInteret / 100 / 12, [inputs.tauxInteret]);
  const nombreMois = useMemo(() => inputs.dureeAnnees * 12, [inputs.dureeAnnees]);
  
  const mensualite = useMemo(() => {
    if (tauxMensuel === 0) return inputs.financementVendeur / nombreMois;
    return (inputs.financementVendeur * tauxMensuel * Math.pow(1 + tauxMensuel, nombreMois)) / 
           (Math.pow(1 + tauxMensuel, nombreMois) - 1);
  }, [inputs.financementVendeur, tauxMensuel, nombreMois]);

  const coutTotalInteret = useMemo(() => {
    return (mensualite * nombreMois) - inputs.financementVendeur;
  }, [mensualite, nombreMois, inputs.financementVendeur]);

  const coutTotalOperation = useMemo(() => {
    return inputs.apport + inputs.financementVendeur + coutTotalInteret;
  }, [inputs.apport, inputs.financementVendeur, coutTotalInteret]);

  const dataChart = useMemo(() => {
    const points = [];
    let capitalRestant = inputs.financementVendeur;
    for (let mois = 0; mois <= nombreMois; mois++) {
      points.push({ mois, capital: capitalRestant });
      if (mois < nombreMois) {
        const interetMois = capitalRestant * tauxMensuel;
        capitalRestant -= (mensualite - interetMois);
      }
    }
    return points;
  }, [inputs.financementVendeur, nombreMois, tauxMensuel, mensualite]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de crédit-vendeur</h1>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Prix du bien (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.prixBien}
                    onChange={(e) => setInputs({ ...inputs, prixBien: toNumber(e.target.value, inputs.prixBien) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Apport (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.apport}
                    onChange={(e) => setInputs({ ...inputs, apport: toNumber(e.target.value, inputs.apport) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Financement vendeur (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.financementVendeur}
                    onChange={(e) => setInputs({ ...inputs, financementVendeur: toNumber(e.target.value, inputs.financementVendeur) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Taux d'intérêt (%)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.tauxInteret}
                    onChange={(e) => setInputs({ ...inputs, tauxInteret: toNumber(e.target.value, inputs.tauxInteret) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Durée (années)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.dureeAnnees}
                    onChange={(e) => setInputs({ ...inputs, dureeAnnees: toNumber(e.target.value, inputs.dureeAnnees) })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Les résultats sont des estimations pédagogiques, non des conseils financiers.</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Prix du bien</div>
                  <div className="text-right font-medium">{fmtCurrency(inputs.prixBien)}</div>

                  <div className="text-muted-foreground">Apport</div>
                  <div className="text-right">{fmtCurrency(inputs.apport)}</div>

                  <div className="text-muted-foreground">Financement vendeur</div>
                  <div className="text-right font-medium">{fmtCurrency(inputs.financementVendeur)}</div>

                  <div className="text-muted-foreground">Mensualité</div>
                  <div className="text-right font-semibold text-teal-600">{fmtCurrency(mensualite)}</div>

                  <div className="text-muted-foreground">Durée</div>
                  <div className="text-right">{inputs.dureeAnnees} ans ({nombreMois} mois)</div>

                  <div className="text-muted-foreground">Total intérêts</div>
                  <div className="text-right">{fmtCurrency(coutTotalInteret)}</div>

                  <div className="text-muted-foreground">Coût total</div>
                  <div className="text-right font-semibold">{fmtCurrency(coutTotalOperation)}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution du capital restant dû</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" tickFormatter={(v) => `${Math.floor(v/12)}a`} />
                    <YAxis tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                    <Tooltip formatter={(value: any) => fmtCurrency(Number(value))} labelFormatter={(l) => `${Math.floor(l/12)}a`} />
                    <Line type="monotone" dataKey="capital" stroke="#14b8a6" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notes & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>Le crédit-vendeur permet de financer l'achat directement par le vendeur.</li>
                <li>Le taux d'intérêt peut être négocié avec le vendeur.</li>
                <li>Les mensualités sont calculées selon la méthode française (décroissante).</li>
                <li>Le financement vendeur peut être une alternative au crédit bancaire.</li>
                <li>Ce simulateur est pédagogique et ne remplace pas un conseil juridique/financier personnalisé.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

