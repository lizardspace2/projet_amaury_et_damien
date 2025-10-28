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
  valeurBien: number;
  nombreParts: number;
  partsAchetées: number;
  prixPrixAchat: number;
  fraisNotaire: number;
};

export default function SimulateurIndivision() {
  const [inputs, setInputs] = useState<Inputs>({
    valeurBien: 500000,
    nombreParts: 3,
    partsAchetées: 1,
    prixPrixAchat: 166000,
    fraisNotaire: 8,
  });

  const prixPart = useMemo(() => inputs.valeurBien / inputs.nombreParts, [inputs.valeurBien, inputs.nombreParts]);
  const partValeurMarche = useMemo(() => (prixPart * inputs.partsAchetées), [prixPart, inputs.partsAchetées]);
  const fraisNotaireMontant = useMemo(() => (inputs.prixPrixAchat * inputs.fraisNotaire) / 100, [inputs.prixPrixAchat, inputs.fraisNotaire]);
  const coutTotal = useMemo(() => inputs.prixPrixAchat + fraisNotaireMontant, [inputs.prixPrixAchat, fraisNotaireMontant]);
  const economie = useMemo(() => partValeurMarche - coutTotal, [partValeurMarche, coutTotal]);
  const pourcentagePropriete = useMemo(() => (inputs.partsAchetées / inputs.nombreParts) * 100, [inputs.partsAchetées, inputs.nombreParts]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur d'indivision / nue-propriété</h1>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Valeur totale du bien (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.valeurBien}
                    onChange={(e) => setInputs({ ...inputs, valeurBien: toNumber(e.target.value, inputs.valeurBien) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nombre de parts totales</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.nombreParts}
                    onChange={(e) => setInputs({ ...inputs, nombreParts: toNumber(e.target.value, inputs.nombreParts) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Parts achetées</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.partsAchetées}
                    onChange={(e) => setInputs({ ...inputs, partsAchetées: toNumber(e.target.value, inputs.partsAchetées) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prix d'achat des parts (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.prixPrixAchat}
                    onChange={(e) => setInputs({ ...inputs, prixPrixAchat: toNumber(e.target.value, inputs.prixPrixAchat) })}
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
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>Les résultats sont des estimations pédagogiques, non des conseils financiers.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Valeur totale du bien</div>
                <div className="text-right font-medium">{fmtCurrency(inputs.valeurBien)}</div>

                <div className="text-muted-foreground">Valeur d'une part</div>
                <div className="text-right">{fmtCurrency(prixPart)}</div>

                <div className="text-muted-foreground">Part de propriété</div>
                <div className="text-right font-semibold">{pourcentagePropriete.toFixed(1)}%</div>

                <div className="text-muted-foreground">Valeur part achetée</div>
                <div className="text-right">{fmtCurrency(partValeurMarche)}</div>

                <div className="text-muted-foreground">Prix d'achat des parts</div>
                <div className="text-right">{fmtCurrency(inputs.prixPrixAchat)}</div>

                <div className="text-muted-foreground">Frais de notaire</div>
                <div className="text-right">{fmtCurrency(fraisNotaireMontant)} ({inputs.fraisNotaire}%)</div>

                <div className="text-muted-foreground">Coût total</div>
                <div className="text-right font-semibold">{fmtCurrency(coutTotal)}</div>

                <div className="text-muted-foreground">Économie réalisée</div>
                <div className="text-right font-semibold text-green-600">{fmtCurrency(economie)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notes & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>L'indivision permet d'acheter une partie d'un bien immobilier.</li>
                <li>Les parts d'un bien sont généralement vendues à prix réduit.</li>
                <li>L'achat de parts permet d'investir avec un budget limité.</li>
                <li>L'indivision nécessite l'accord des autres copropriétaires pour des décisions importantes.</li>
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

