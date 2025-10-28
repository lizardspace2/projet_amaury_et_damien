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
  loyerMensuel: number;
  chargeMensuelle: number;
  dureeBail: number;
  prixLeve: number;
};

export default function SimulateurBRS() {
  const [inputs, setInputs] = useState<Inputs>({
    valeurBien: 300000,
    loyerMensuel: 2500,
    chargeMensuelle: 500,
    dureeBail: 9,
    prixLeve: 180000,
  });

  const loyerAnnuel = useMemo(() => inputs.loyerMensuel * 12, [inputs.loyerMensuel]);
  const chargeAnnuelle = useMemo(() => inputs.chargeMensuelle * 12, [inputs.chargeMensuelle]);
  const coutTotalAnnuel = useMemo(() => loyerAnnuel + chargeAnnuelle, [loyerAnnuel, chargeAnnuelle]);
  const coutTotalDuree = useMemo(() => coutTotalAnnuel * inputs.dureeBail, [coutTotalAnnuel, inputs.dureeBail]);
  const reductionPrix = useMemo(() => inputs.valeurBien - inputs.prixLeve, [inputs.valeurBien, inputs.prixLeve]);
  const coutGlobal = useMemo(() => inputs.prixLeve + coutTotalDuree, [inputs.prixLeve, coutTotalDuree]);
  const economie = useMemo(() => inputs.valeurBien - coutGlobal, [inputs.valeurBien, coutGlobal]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de BRS (Bail Réel Solidaire)</h1>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Valeur du bien (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.valeurBien}
                    onChange={(e) => setInputs({ ...inputs, valeurBien: toNumber(e.target.value, inputs.valeurBien) })}
                  />
                </div>

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
                    value={inputs.chargeMensuelle}
                    onChange={(e) => setInputs({ ...inputs, chargeMensuelle: toNumber(e.target.value, inputs.chargeMensuelle) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Durée du bail (années)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.dureeBail}
                    onChange={(e) => setInputs({ ...inputs, dureeBail: toNumber(e.target.value, inputs.dureeBail) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prix de levée (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.prixLeve}
                    onChange={(e) => setInputs({ ...inputs, prixLeve: toNumber(e.target.value, inputs.prixLeve) })}
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
                <div className="text-muted-foreground">Valeur du bien</div>
                <div className="text-right font-medium">{fmtCurrency(inputs.valeurBien)}</div>

                <div className="text-muted-foreground">Loyer annuel</div>
                <div className="text-right">{fmtCurrency(loyerAnnuel)}</div>

                <div className="text-muted-foreground">Charges annuelles</div>
                <div className="text-right">{fmtCurrency(chargeAnnuelle)}</div>

                <div className="text-muted-foreground">Coût annuel</div>
                <div className="text-right font-semibold">{fmtCurrency(coutTotalAnnuel)}</div>

                <div className="text-muted-foreground">Coût total loyer ({inputs.dureeBail} ans)</div>
                <div className="text-right font-semibold">{fmtCurrency(coutTotalDuree)}</div>

                <div className="text-muted-foreground">Prix de levée</div>
                <div className="text-right">{fmtCurrency(inputs.prixLeve)}</div>

                <div className="text-muted-foreground">Coût global</div>
                <div className="text-right font-semibold text-teal-600">{fmtCurrency(coutGlobal)}</div>

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
                <li>Le BRS permet d'acheter un bien en plusieurs versements.</li>
                <li>Le bien est loué pendant la durée du bail avant d'être levé.</li>
                <li>Le prix de levée est généralement payé à la fin du bail.</li>
                <li>Le BRS permet de répartir l'investissement sur plusieurs années.</li>
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

