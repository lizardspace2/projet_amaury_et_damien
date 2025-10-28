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
  prixLot: number;
  chargesCoproMensuelles: number;
  fraisNotaire: number;
  duree: number;
};

export default function SimulateurCopropriete() {
  const [inputs, setInputs] = useState<Inputs>({
    prixLot: 120000,
    chargesCoproMensuelles: 200,
    fraisNotaire: 8,
    duree: 10,
  });

  const fraisNotaireMontant = useMemo(() => (inputs.prixLot * inputs.fraisNotaire) / 100, [inputs.prixLot, inputs.fraisNotaire]);
  const coutAcquisition = useMemo(() => inputs.prixLot + fraisNotaireMontant, [inputs.prixLot, fraisNotaireMontant]);
  const chargesAnnuelles = useMemo(() => inputs.chargesCoproMensuelles * 12, [inputs.chargesCoproMensuelles]);
  const chargesTotales = useMemo(() => chargesAnnuelles * inputs.duree, [chargesAnnuelles, inputs.duree]);
  const coutTotalOperation = useMemo(() => coutAcquisition + chargesTotales, [coutAcquisition, chargesTotales]);
  const coutMensuel = useMemo(() => coutTotalOperation / (inputs.duree * 12), [coutTotalOperation, inputs.duree]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de copropriété / lot de volume</h1>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Prix du lot (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.prixLot}
                    onChange={(e) => setInputs({ ...inputs, prixLot: toNumber(e.target.value, inputs.prixLot) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Charges copropriété mensuelles (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.chargesCoproMensuelles}
                    onChange={(e) => setInputs({ ...inputs, chargesCoproMensuelles: toNumber(e.target.value, inputs.chargesCoproMensuelles) })}
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
                  <Label>Durée de détention (années)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.duree}
                    onChange={(e) => setInputs({ ...inputs, duree: toNumber(e.target.value, inputs.duree) })}
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
                <div className="text-muted-foreground">Prix du lot</div>
                <div className="text-right font-medium">{fmtCurrency(inputs.prixLot)}</div>

                <div className="text-muted-foreground">Frais de notaire</div>
                <div className="text-right">{fmtCurrency(fraisNotaireMontant)} ({inputs.fraisNotaire}%)</div>

                <div className="text-muted-foreground">Coût d'acquisition</div>
                <div className="text-right font-semibold">{fmtCurrency(coutAcquisition)}</div>

                <div className="text-muted-foreground">Charges mensuelles</div>
                <div className="text-right">{fmtCurrency(inputs.chargesCoproMensuelles)}</div>

                <div className="text-muted-foreground">Charges annuelles</div>
                <div className="text-right">{fmtCurrency(chargesAnnuelles)}</div>

                <div className="text-muted-foreground">Charges totales ({inputs.duree} ans)</div>
                <div className="text-right font-semibold">{fmtCurrency(chargesTotales)}</div>

                <div className="text-muted-foreground">Coût total opération</div>
                <div className="text-right font-semibold text-teal-600">{fmtCurrency(coutTotalOperation)}</div>

                <div className="text-muted-foreground">Coût moyen mensuel</div>
                <div className="text-right font-semibold">{fmtCurrency(coutMensuel)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notes & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>La copropriété permet d'acheter un bien divisé en lots.</li>
                <li>Chaque lot est indépendant avec ses propres charges.</li>
                <li>Les charges de copropriété sont obligatoires et mensuelles.</li>
                <li>Le lot de volume est un lot sans répartition de surface.</li>
                <li>Les charges peuvent varier selon les travaux et l'entretien de l'immeuble.</li>
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

