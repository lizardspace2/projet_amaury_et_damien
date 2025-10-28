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
  valeurMarche: number;
  prixAchat: number;
  fraisNotaire: number;
  agenceImmobilier: number;
  renovation: number;
  entretienAnnuel: number;
  duree: number;
};

export default function SimulateurBiensException() {
  const [inputs, setInputs] = useState<Inputs>({
    valeurMarche: 1500000,
    prixAchat: 1400000,
    fraisNotaire: 8,
    agenceImmobilier: 5,
    renovation: 100000,
    entretienAnnuel: 50000,
    duree: 10,
  });

  const economieAchat = useMemo(() => inputs.valeurMarche - inputs.prixAchat, [inputs.valeurMarche, inputs.prixAchat]);
  const fraisNotaireMontant = useMemo(() => (inputs.prixAchat * inputs.fraisNotaire) / 100, [inputs.prixAchat, inputs.fraisNotaire]);
  const agenceMontant = useMemo(() => (inputs.prixAchat * inputs.agenceImmobilier) / 100, [inputs.prixAchat, inputs.agenceImmobilier]);
  const coutInitial = useMemo(() => inputs.prixAchat + fraisNotaireMontant + agenceMontant + inputs.renovation, [inputs.prixAchat, fraisNotaireMontant, agenceMontant, inputs.renovation]);
  const coutEntretienTotal = useMemo(() => inputs.entretienAnnuel * inputs.duree, [inputs.entretienAnnuel, inputs.duree]);
  const coutTotalOperation = useMemo(() => coutInitial + coutEntretienTotal, [coutInitial, coutEntretienTotal]);
  const prixDeRevient = useMemo(() => coutTotalOperation / inputs.prixAchat, [coutTotalOperation, inputs.prixAchat]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de biens d'exception</h1>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Valeur de marché estimée (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.valeurMarche}
                    onChange={(e) => setInputs({ ...inputs, valeurMarche: toNumber(e.target.value, inputs.valeurMarche) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prix d'achat (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.prixAchat}
                    onChange={(e) => setInputs({ ...inputs, prixAchat: toNumber(e.target.value, inputs.prixAchat) })}
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
                  <Label>Commission agence (%)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.agenceImmobilier}
                    onChange={(e) => setInputs({ ...inputs, agenceImmobilier: toNumber(e.target.value, inputs.agenceImmobilier) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rénovation estimée (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.renovation}
                    onChange={(e) => setInputs({ ...inputs, renovation: toNumber(e.target.value, inputs.renovation) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Entretien annuel (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.entretienAnnuel}
                    onChange={(e) => setInputs({ ...inputs, entretienAnnuel: toNumber(e.target.value, inputs.entretienAnnuel) })}
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
              <CardTitle>Résumé financier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Valeur de marché</div>
                <div className="text-right font-medium">{fmtCurrency(inputs.valeurMarche)}</div>

                <div className="text-muted-foreground">Prix d'achat</div>
                <div className="text-right font-medium">{fmtCurrency(inputs.prixAchat)}</div>

                <div className="text-muted-foreground">Économie à l'achat</div>
                <div className="text-right font-semibold text-green-600">{fmtCurrency(economieAchat)}</div>

                <div className="text-muted-foreground">Frais de notaire</div>
                <div className="text-right">{fmtCurrency(fraisNotaireMontant)} ({inputs.fraisNotaire}%)</div>

                <div className="text-muted-foreground">Commission agence</div>
                <div className="text-right">{fmtCurrency(agenceMontant)} ({inputs.agenceImmobilier}%)</div>

                <div className="text-muted-foreground">Rénovation</div>
                <div className="text-right">{fmtCurrency(inputs.renovation)}</div>

                <div className="text-muted-foreground">Coût initial</div>
                <div className="text-right font-semibold">{fmtCurrency(coutInitial)}</div>

                <div className="text-muted-foreground">Entretien total ({inputs.duree} ans)</div>
                <div className="text-right">{fmtCurrency(coutEntretienTotal)}</div>

                <div className="text-muted-foreground">Coût total opération</div>
                <div className="text-right font-semibold text-teal-600">{fmtCurrency(coutTotalOperation)}</div>

                <div className="text-muted-foreground">Prix de revient</div>
                <div className="text-right">{(prixDeRevient * 100).toFixed(2)}%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notes & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>Les biens d'exception nécessitent un investissement initial important.</li>
                <li>Les frais de notaire peuvent être négociés selon le notaire choisi.</li>
                <li>L'entretien annuel est indispensable pour maintenir la valeur du bien.</li>
                <li>Les biens de prestige peuvent bénéficier d'une bonne plus-value à long terme.</li>
                <li>Prévoir un budget entretien conséquent pour piscine, jardin, équipements haut de gamme.</li>
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

