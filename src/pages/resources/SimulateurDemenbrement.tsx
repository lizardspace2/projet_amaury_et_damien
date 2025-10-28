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
  valeurComplete: number;
  nuePropriete: number;
  usufruit: number;
  dureeUsufruit: number;
};

export default function SimulateurDemenbrement() {
  const [inputs, setInputs] = useState<Inputs>({
    valeurComplete: 400000,
    nuePropriete: 70,
    usufruit: 30,
    dureeUsufruit: 20,
  });

  const valeurNuePropriete = useMemo(() => (inputs.valeurComplete * inputs.nuePropriete) / 100, [inputs.valeurComplete, inputs.nuePropriete]);
  const valeurUsufruit = useMemo(() => (inputs.valeurComplete * inputs.usufruit) / 100, [inputs.valeurComplete, inputs.usufruit]);
  const dureeMois = useMemo(() => inputs.dureeUsufruit * 12, [inputs.dureeUsufruit]);
  const revenuAnnuelUsufruit = useMemo(() => valeurUsufruit * 0.05, [valeurUsufruit]);
  const revenuTotalUsufruit = useMemo(() => revenuAnnuelUsufruit * inputs.dureeUsufruit, [revenuAnnuelUsufruit, inputs.dureeUsufruit]);
  const coutTotalOperation = useMemo(() => valeurNuePropriete + valeurUsufruit, [valeurNuePropriete, valeurUsufruit]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de démembrement</h1>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Valeur du bien en pleine propriété (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.valeurComplete}
                    onChange={(e) => setInputs({ ...inputs, valeurComplete: toNumber(e.target.value, inputs.valeurComplete) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>% Nue-propriété</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.nuePropriete}
                    onChange={(e) => setInputs({ ...inputs, nuePropriete: toNumber(e.target.value, inputs.nuePropriete) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>% Usufruit</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.usufruit}
                    onChange={(e) => setInputs({ ...inputs, usufruit: toNumber(e.target.value, inputs.usufruit) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Durée usufruit (années)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.dureeUsufruit}
                    onChange={(e) => setInputs({ ...inputs, dureeUsufruit: toNumber(e.target.value, inputs.dureeUsufruit) })}
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
                <div className="text-muted-foreground">Valeur pleine propriété</div>
                <div className="text-right font-medium">{fmtCurrency(inputs.valeurComplete)}</div>

                <div className="text-muted-foreground">Valeur nue-propriété</div>
                <div className="text-right font-semibold">{fmtCurrency(valeurNuePropriete)} ({inputs.nuePropriete}%)</div>

                <div className="text-muted-foreground">Valeur usufruit</div>
                <div className="text-right font-semibold">{fmtCurrency(valeurUsufruit)} ({inputs.usufruit}%)</div>

                <div className="text-muted-foreground">Durée usufruit</div>
                <div className="text-right">{dureeMois} mois</div>

                <div className="text-muted-foreground">Revenu annuel usufruit</div>
                <div className="text-right">{fmtCurrency(revenuAnnuelUsufruit)}</div>

                <div className="text-muted-foreground">Revenu total usufruit</div>
                <div className="text-right font-semibold text-teal-600">{fmtCurrency(revenuTotalUsufruit)}</div>

                <div className="text-muted-foreground">Coût total opération</div>
                <div className="text-right font-semibold">{fmtCurrency(coutTotalOperation)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notes & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>Le démembrement sépare la pleine propriété en nue-propriété et usufruit.</li>
                <li>La nue-propriété représente le droit de disposer du bien (réaliser, vendre).</li>
                <li>L'usufruit représente le droit d'utiliser le bien et d'en percevoir les revenus.</li>
                <li>Le calcul du démembrement est effectué selon le barème fiscal français.</li>
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

