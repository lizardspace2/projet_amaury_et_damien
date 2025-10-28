import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

const fmtCurrency = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const toNumber = (v: string, fallback = 0) => {
  const n = Number((v || "").replace(/\s/g, "").replace(",", "."));
  return isNaN(n) ? fallback : n;
};

type Inputs = {
  prixMise: number;
  prixAdjudication: number;
  fraisNotaire: number;
  fraisVente: number;
  travaux: number;
  budgetGlobal: number;
};

export default function SimulateurEncheres() {
  const [inputs, setInputs] = useState<Inputs>({
    prixMise: 200000,
    prixAdjudication: 250000,
    fraisNotaire: 8,
    fraisVente: 5,
    travaux: 30000,
    budgetGlobal: 400000,
  });

  const augmentationPrix = useMemo(() => inputs.prixAdjudication - inputs.prixMise, [inputs.prixAdjudication, inputs.prixMise]);
  const pourcentageAugmentation = useMemo(() => ((augmentationPrix / inputs.prixMise) * 100), [augmentationPrix, inputs.prixMise]);
  const fraisNotaireMontant = useMemo(() => (inputs.prixAdjudication * inputs.fraisNotaire) / 100, [inputs.prixAdjudication, inputs.fraisNotaire]);
  const fraisVenteMontant = useMemo(() => (inputs.prixAdjudication * inputs.fraisVente) / 100, [inputs.prixAdjudication, inputs.fraisVente]);
  const coutTotal = useMemo(() => inputs.prixAdjudication + fraisNotaireMontant + fraisVenteMontant + inputs.travaux, [inputs.prixAdjudication, fraisNotaireMontant, fraisVenteMontant, inputs.travaux]);
  const ecartBudget = useMemo(() => inputs.budgetGlobal - coutTotal, [inputs.budgetGlobal, coutTotal]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur d'enchères immobilières</h1>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Prix de mise à prix (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.prixMise}
                    onChange={(e) => setInputs({ ...inputs, prixMise: toNumber(e.target.value, inputs.prixMise) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prix d'adjudication (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.prixAdjudication}
                    onChange={(e) => setInputs({ ...inputs, prixAdjudication: toNumber(e.target.value, inputs.prixAdjudication) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frais de notaire (%)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.fraisNotaire}
                    onChange={(e) => setInputs({ ...inputs, fraisNotaire: toNumber(e.target.value, inputs.fraisNotaire) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frais de vente (%)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.fraisVente}
                    onChange={(e) => setInputs({ ...inputs, fraisVente: toNumber(e.target.value, inputs.fraisVente) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Travaux estimés (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.travaux}
                    onChange={(e) => setInputs({ ...inputs, travaux: toNumber(e.target.value, inputs.travaux) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Budget global (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.budgetGlobal}
                    onChange={(e) => setInputs({ ...inputs, budgetGlobal: toNumber(e.target.value, inputs.budgetGlobal) })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Les résultats sont des estimations pédagogiques, non des conseils financiers.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Résumé financier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Prix de mise à prix</div>
                <div className="text-right font-medium">{fmtCurrency(inputs.prixMise)}</div>

                <div className="text-muted-foreground">Prix d'adjudication</div>
                <div className="text-right font-medium">{fmtCurrency(inputs.prixAdjudication)}</div>

                <div className="text-muted-foreground">Augmentation du prix</div>
                <div className="text-right font-semibold text-teal-600">{fmtCurrency(augmentationPrix)} ({pourcentageAugmentation.toFixed(1)}%)</div>

                <div className="text-muted-foreground">Frais de notaire</div>
                <div className="text-right">{fmtCurrency(fraisNotaireMontant)} ({inputs.fraisNotaire}%)</div>

                <div className="text-muted-foreground">Frais de vente</div>
                <div className="text-right">{fmtCurrency(fraisVenteMontant)} ({inputs.fraisVente}%)</div>

                <div className="text-muted-foreground">Travaux</div>
                <div className="text-right">{fmtCurrency(inputs.travaux)}</div>

                <div className="text-muted-foreground">Coût total</div>
                <div className="text-right font-semibold">{fmtCurrency(coutTotal)}</div>

                <div className="text-muted-foreground">Écart avec budget</div>
                <div className={`text-right font-semibold ${ecartBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {fmtCurrency(ecartBudget)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notes & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>Les enchères immobilières offrent souvent des opportunités de bien en dessous du marché.</li>
                <li>Le prix d'adjudication peut être supérieur au prix de mise à prix de 20% à 30%.</li>
                <li>Les frais de notaire aux enchères sont généralement plus élevés (7-8% contre 2-3%).</li>
                <li>Les frais de vente incluent les frais de vente et les commissions.</li>
                <li>Prévoir un budget travaux important pour les biens en enchères.</li>
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

