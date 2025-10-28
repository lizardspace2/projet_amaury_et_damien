import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const fmtCurrency = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

const toNumber = (v: string, fallback = 0) => {
  const n = Number((v || "").replace(/\s/g, "").replace(",", "."));
  return isNaN(n) ? fallback : n;
};

type Inputs = {
  valeurBien: number;
  bouquet: number;
  renteMensuelle: number;
  ageTete: number;
  esperanceVie: number;
};

export default function SimulateurViager() {
  const [inputs, setInputs] = useState<Inputs>({
    valeurBien: 200_000,
    bouquet: 30_000,
    renteMensuelle: 800,
    ageTete: 75,
    esperanceVie: 85,
  });

  const resteDu = useMemo(() => inputs.valeurBien - inputs.bouquet, [inputs.valeurBien, inputs.bouquet]);
  
  const dureeEstimee = useMemo(() => {
    return Math.max(0, inputs.esperanceVie - inputs.ageTete);
  }, [inputs.esperanceVie, inputs.ageTete]);

  const totalRenteVerse = useMemo(() => {
    return inputs.renteMensuelle * 12 * dureeEstimee;
  }, [inputs.renteMensuelle, dureeEstimee]);

  const coutTotalPourVendeur = useMemo(() => {
    return inputs.bouquet + totalRenteVerse;
  }, [inputs.bouquet, totalRenteVerse]);

  const economieRendue = useMemo(() => {
    return inputs.valeurBien - coutTotalPourVendeur;
  }, [inputs.valeurBien, coutTotalPourVendeur]);

  const dataChart = useMemo(() => {
    const points = [{ an: 0, cumul: 0 }];
    let cumul = inputs.bouquet;
    for (let an = 1; an <= dureeEstimee; an++) {
      cumul += inputs.renteMensuelle * 12;
      points.push({ an, cumul });
    }
    return points;
  }, [inputs.bouquet, inputs.renteMensuelle, dureeEstimee]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de viager</h1>

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
                  <Label>Bouquet (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.bouquet}
                    onChange={(e) => setInputs({ ...inputs, bouquet: toNumber(e.target.value, inputs.bouquet) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rente mensuelle (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.renteMensuelle}
                    onChange={(e) => setInputs({ ...inputs, renteMensuelle: toNumber(e.target.value, inputs.renteMensuelle) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Âge de la tête (années)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      inputMode="numeric"
                      value={inputs.ageTete}
                      onChange={(e) => setInputs({ ...inputs, ageTete: toNumber(e.target.value, inputs.ageTete) })}
                    />
                    <Slider
                      value={[inputs.ageTete]}
                      min={60}
                      max={100}
                      step={1}
                      onValueChange={([v]) => setInputs({ ...inputs, ageTete: v })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Espérance de vie (années)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      inputMode="numeric"
                      value={inputs.esperanceVie}
                      onChange={(e) => setInputs({ ...inputs, esperanceVie: toNumber(e.target.value, inputs.esperanceVie) })}
                    />
                    <Slider
                      value={[inputs.esperanceVie]}
                      min={70}
                      max={100}
                      step={1}
                      onValueChange={([v]) => setInputs({ ...inputs, esperanceVie: v })}
                      className="flex-1"
                    />
                  </div>
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
                  <div className="text-muted-foreground">Valeur du bien</div>
                  <div className="text-right font-medium">{fmtCurrency(inputs.valeurBien)}</div>

                  <div className="text-muted-foreground">Bouquet</div>
                  <div className="text-right">{fmtCurrency(inputs.bouquet)}</div>

                  <div className="text-muted-foreground">Reste dû</div>
                  <div className="text-right font-medium">{fmtCurrency(resteDu)}</div>

                  <div className="text-muted-foreground">Rente mensuelle</div>
                  <div className="text-right">{fmtCurrency(inputs.renteMensuelle)}</div>

                  <div className="text-muted-foreground">Durée estimée</div>
                  <div className="text-right">{dureeEstimee} ans</div>

                  <div className="text-muted-foreground">Total rente versée</div>
                  <div className="text-right">{fmtCurrency(totalRenteVerse)}</div>

                  <div className="text-muted-foreground">Coût total</div>
                  <div className="text-right font-semibold">{fmtCurrency(coutTotalPourVendeur)}</div>

                  <div className="text-muted-foreground">Économie rendue</div>
                  <div className="text-right font-semibold text-green-600">{fmtCurrency(economieRendue)}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution du cumul de paiements</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="an" tickFormatter={(v) => `${v}a`} />
                    <YAxis tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                    <Tooltip formatter={(value: any) => fmtCurrency(Number(value))} labelFormatter={(l) => `Année ${l}`} />
                    <Line type="monotone" dataKey="cumul" stroke="#14b8a6" />
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
                <li>Le viager permet au vendeur de recevoir immédiatement le bouquet et une rente mensuelle.</li>
                <li>L'acheteur devient propriétaire immédiatement mais paie une rente viagère jusqu'au décès.</li>
                <li>Le calcul de l'économie rendue est basé sur l'espérance de vie moyenne.</li>
                <li>Les résultats varient en fonction de l'âge et de l'état de santé.</li>
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

