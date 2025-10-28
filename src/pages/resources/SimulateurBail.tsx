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
  loyerMensuel: number;
  chargesMensuelles: number;
  droitEntree: number;
  fdcAnnuelles: number;
  dureeAnnée: number;
};

export default function SimulateurBail() {
  const [inputs, setInputs] = useState<Inputs>({
    loyerMensuel: 2000,
    chargesMensuelles: 300,
    droitEntree: 50000,
    fdcAnnuelles: 5000,
    dureeAnnée: 9,
  });

  const loyerAnnuel = useMemo(() => inputs.loyerMensuel * 12, [inputs.loyerMensuel]);
  const chargesAnnuelles = useMemo(() => inputs.chargesMensuelles * 12, [inputs.chargesMensuelles]);
  const coutTotalAnnuel = useMemo(() => loyerAnnuel + chargesAnnuelles + inputs.fdcAnnuelles, [loyerAnnuel, chargesAnnuelles, inputs.fdcAnnuelles]);
  const coutTotalSurDuree = useMemo(() => inputs.droitEntree + (coutTotalAnnuel * inputs.dureeAnnée), [inputs.droitEntree, coutTotalAnnuel, inputs.dureeAnnée]);
  const coutMoyenMensuel = useMemo(() => coutTotalSurDuree / (inputs.dureeAnnée * 12), [coutTotalSurDuree, inputs.dureeAnnée]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de bail commercial</h1>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Loyer mensuel (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.loyerMensuel}
                    onChange={(e) => setInputs({ ...inputs, loyerMensuel: toNumber(e.target.value, inputs.loyerMensuel) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Charges mensuelles (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.chargesMensuelles}
                    onChange={(e) => setInputs({ ...inputs, chargesMensuelles: toNumber(e.target.value, inputs.chargesMensuelles) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Droit d'entrée (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.droitEntree}
                    onChange={(e) => setInputs({ ...inputs, droitEntree: toNumber(e.target.value, inputs.droitEntree) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frais de cession annuels (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.fdcAnnuelles}
                    onChange={(e) => setInputs({ ...inputs, fdcAnnuelles: toNumber(e.target.value, inputs.fdcAnnuelles) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Durée du bail (années)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.dureeAnnée}
                    onChange={(e) => setInputs({ ...inputs, dureeAnnée: toNumber(e.target.value, inputs.dureeAnnée) })}
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
                <div className="text-muted-foreground">Loyer annuel</div>
                <div className="text-right font-medium">{fmtCurrency(loyerAnnuel)}</div>

                <div className="text-muted-foreground">Charges annuelles</div>
                <div className="text-right">{fmtCurrency(chargesAnnuelles)}</div>

                <div className="text-muted-foreground">Frais de cession annuels</div>
                <div className="text-right">{fmtCurrency(inputs.fdcAnnuelles)}</div>

                <div className="text-muted-foreground">Coût total annuel</div>
                <div className="text-right font-semibold">{fmtCurrency(coutTotalAnnuel)}</div>

                <div className="text-muted-foreground">Droit d'entrée</div>
                <div className="text-right">{fmtCurrency(inputs.droitEntree)}</div>

                <div className="text-muted-foreground">Coût total sur {inputs.dureeAnnée} ans</div>
                <div className="text-right font-semibold text-teal-600">{fmtCurrency(coutTotalSurDuree)}</div>

                <div className="text-muted-foreground">Coût moyen mensuel</div>
                <div className="text-right font-semibold">{fmtCurrency(coutMoyenMensuel)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notes & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>Le bail commercial permet de reprendre un fonds de commerce avec droit de bail.</li>
                <li>Le droit d'entrée est un paiement unique effectué au cédant.</li>
                <li>Les frais de cession peuvent inclure les honoraires de notaire et de courtage.</li>
                <li>Le loyer et les charges restent à votre charge pendant toute la durée du bail.</li>
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

