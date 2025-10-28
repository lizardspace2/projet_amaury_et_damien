import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fmtCurrency = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const fmtPct = (n: number) => `${n.toFixed(2)} %`;

function irrMonthlyToAnnual(cashFlows: number[], guess = 0.01): number | null {
  let r = guess;
  for (let i = 0; i < 100; i++) {
    let f = 0;
    let df = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const cf = cashFlows[t];
      const denom = Math.pow(1 + r, t);
      f += cf / denom;
      df += (-t * cf) / Math.pow(1 + r, t + 1);
    }
    const step = f / df;
    const newR = r - step;
    if (!isFinite(newR)) return null;
    if (Math.abs(newR - r) < 1e-10) return Math.pow(1 + newR, 12) - 1;
    r = newR;
  }
  return null;
}

const toNumber = (v: string, fallback = 0) => {
  const n = Number((v || "").replace(/\s/g, "").replace(",", "."));
  return isNaN(n) ? fallback : n;
};

type Occupation = "libre" | "occupee";

type Inputs = {
  valeurMarche: number;
  occupation: Occupation;
  decoteOccupationPct: number;
  prixNegocie: number;
  bouquet: number;
  dureeMois: number;
  indexationAnnuellePct: number;
  fraisNotairePct: number;
  montrerEcheancier: boolean;
  tauxActualisationPct: number;
};

const SimulateurVenteTerme = () => {
  const [inputs, setInputs] = useState<Inputs>({
    valeurMarche: 300_000,
    occupation: "libre",
    decoteOccupationPct: 25,
    prixNegocie: 300_000,
    bouquet: 60_000,
    dureeMois: 180,
    indexationAnnuellePct: 0,
    fraisNotairePct: 7.5,
    montrerEcheancier: false,
    tauxActualisationPct: 3.0,
  });

  const prixTheoriqueOccupe = useMemo(() => {
    return inputs.valeurMarche * (1 - (inputs.occupation === "occupee" ? inputs.decoteOccupationPct / 100 : 0));
  }, [inputs.valeurMarche, inputs.occupation, inputs.decoteOccupationPct]);

  const prixBase = useMemo(() => {
    return Math.min(Math.max(inputs.prixNegocie || 0, 0), 10_000_000) || prixTheoriqueOccupe;
  }, [inputs.prixNegocie, prixTheoriqueOccupe]);

  const bouquet = useMemo(() => Math.min(inputs.bouquet, prixBase), [inputs.bouquet, prixBase]);

  const capitalAEchelonner = useMemo(() => Math.max(0, prixBase - bouquet), [prixBase, bouquet]);

  const echeanceInitiale = useMemo(() => (inputs.dureeMois > 0 ? capitalAEchelonner / inputs.dureeMois : 0), [capitalAEchelonner, inputs.dureeMois]);

  const echeancier = useMemo(() => {
    const arr: { mois: number; montant: number; cumul: number }[] = [];
    let cumul = bouquet;
    let mensualite = echeanceInitiale;
    for (let m = 1; m <= inputs.dureeMois; m++) {
      if (m > 1 && (m - 1) % 12 === 0) {
        mensualite *= 1 + inputs.indexationAnnuellePct / 100;
      }
      cumul += mensualite;
      arr.push({ mois: m, montant: mensualite, cumul });
    }
    return arr;
  }, [inputs.dureeMois, echeanceInitiale, inputs.indexationAnnuellePct, bouquet]);

  const totalVerse = useMemo(() => bouquet + echeancier.reduce((s, r) => s + r.montant, 0), [bouquet, echeancier]);

  const fraisNotaire = useMemo(() => (prixBase * inputs.fraisNotairePct) / 100, [prixBase, inputs.fraisNotairePct]);

  const vanVendeur = useMemo(() => {
    const r = inputs.tauxActualisationPct / 100 / 12;
    let npv = bouquet;
    for (let m = 1; m <= inputs.dureeMois; m++) {
      npv += echeancier[m - 1].montant / Math.pow(1 + r, m);
    }
    return npv;
  }, [bouquet, echeancier, inputs.dureeMois, inputs.tauxActualisationPct]);

  const irrVendeur = useMemo(() => {
    const flows = [bouquet, ...echeancier.map(e => e.montant)];
    return irrMonthlyToAnnual(flows, 0.005);
  }, [bouquet, echeancier]);

  const coutTotalAcheteur = useMemo(() => totalVerse + fraisNotaire, [totalVerse, fraisNotaire]);

  const flowsAcheteur = useMemo(() => {
    const arr = [-bouquet - fraisNotaire, ...echeancier.map(e => -e.montant)];
    return arr;
  }, [bouquet, fraisNotaire, echeancier]);

  const irrAcheteur = useMemo(() => irrMonthlyToAnnual(flowsAcheteur, 0.005), [flowsAcheteur]);

  const cumulChart = useMemo(() => {
    const pts = [{ mois: 0, cumul: bouquet }];
    let cumul = bouquet;
    for (const e of echeancier) {
      cumul += e.montant;
      pts.push({ mois: e.mois, cumul });
    }
    return pts;
  }, [echeancier, bouquet]);

  const barsEcheances = useMemo(() => {
    const arr = [{ label: "Bouquet", flux: Math.round(bouquet) }];
    for (const e of echeancier) arr.push({ label: `${e.mois}`, flux: Math.round(e.montant) });
    return arr;
  }, [echeancier, bouquet]);

  const resetPrix = () => setInputs(s => ({ ...s, prixNegocie: Math.round(prixTheoriqueOccupe) }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de Vente à Terme</h1>
            <p className="text-muted-foreground">Calculez votre vente à terme et découvrez les conditions de votre opération différée.</p>
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Valeur de marché (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.valeurMarche}
                    onChange={(e) => setInputs({ ...inputs, valeurMarche: toNumber(e.target.value, inputs.valeurMarche) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Occupation à l'acte</Label>
                  <Select
                    value={inputs.occupation}
                    onValueChange={(v: Occupation) => setInputs({ ...inputs, occupation: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="libre">Libre (bien livré)</SelectItem>
                      <SelectItem value="occupee">Occupée (droit d'usage)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inputs.occupation === "occupee" && (
                  <div className="space-y-2">
                    <Label>Décote occupation (%)</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        inputMode="numeric"
                        value={inputs.decoteOccupationPct}
                        onChange={(e) => setInputs({ ...inputs, decoteOccupationPct: Math.max(0, toNumber(e.target.value, inputs.decoteOccupationPct)) })}
                      />
                      <Slider
                        value={[inputs.decoteOccupationPct]}
                        min={0}
                        max={60}
                        step={1}
                        onValueChange={([v]) => setInputs({ ...inputs, decoteOccupationPct: v })}
                        className="w-40"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <Label>Prix négocié (€)</Label>
                  <div className="flex gap-2">
                    <Input
                      inputMode="numeric"
                      value={inputs.prixNegocie}
                      onChange={(e) => setInputs({ ...inputs, prixNegocie: Math.max(0, toNumber(e.target.value, inputs.prixNegocie)) })}
                    />
                    <Button variant="secondary" onClick={resetPrix}>= Théorique</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Théorique (selon occupation) : {fmtCurrency(prixTheoriqueOccupe)}</p>
                </div>

                <div className="space-y-2">
                  <Label>Bouquet à la signature (€)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.bouquet}
                    onChange={(e) => setInputs({ ...inputs, bouquet: Math.max(0, toNumber(e.target.value, inputs.bouquet)) })}
                  />
                  <p className="text-xs text-muted-foreground">Max : {fmtCurrency(prixBase)}</p>
                </div>

                <div className="space-y-2">
                  <Label>Durée (mois)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      inputMode="numeric"
                      value={inputs.dureeMois}
                      onChange={(e) => setInputs({ ...inputs, dureeMois: Math.max(12, Math.min(420, toNumber(e.target.value, inputs.dureeMois))) })}
                    />
                    <Slider
                      value={[inputs.dureeMois]}
                      min={12}
                      max={420}
                      step={12}
                      onValueChange={([v]) => setInputs({ ...inputs, dureeMois: v })}
                      className="w-40"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <Label>Indexation annuelle des échéances (%)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.indexationAnnuellePct}
                    onChange={(e) => setInputs({ ...inputs, indexationAnnuellePct: Math.max(0, toNumber(e.target.value, inputs.indexationAnnuellePct)) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frais de notaire estimés (%)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.fraisNotairePct}
                    onChange={(e) => setInputs({ ...inputs, fraisNotairePct: Math.max(0, toNumber(e.target.value, inputs.fraisNotairePct)) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Taux d'actualisation vendeur (%)</Label>
                  <Input
                    inputMode="numeric"
                    value={inputs.tauxActualisationPct}
                    onChange={(e) => setInputs({ ...inputs, tauxActualisationPct: Math.max(0, toNumber(e.target.value, inputs.tauxActualisationPct)) })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={inputs.montrerEcheancier} onCheckedChange={(v) => setInputs({ ...inputs, montrerEcheancier: v })} />
                <span className="text-sm">Afficher l'échéancier détaillé</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>La vente à terme est une vente au prix fixé, payée par un bouquet puis des échéances. Les sorties affichées côté acheteur incluent une estimation des frais notariés.</span>
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
                  <div className="text-muted-foreground">Prix de base retenu</div>
                  <div className="text-right font-medium">{fmtCurrency(prixBase)}</div>

                  <div className="text-muted-foreground">Bouquet à la signature</div>
                  <div className="text-right">{fmtCurrency(bouquet)}</div>

                  <div className="text-muted-foreground">Capital à échelonner</div>
                  <div className="text-right">{fmtCurrency(capitalAEchelonner)}</div>

                  <div className="text-muted-foreground">Échéance initiale (mois 1)</div>
                  <div className="text-right">{fmtCurrency(echeanceInitiale)}</div>

                  <div className="text-muted-foreground">Total versé (bouquet + échéances)</div>
                  <div className="text-right font-medium">{fmtCurrency(totalVerse)}</div>

                  <div className="text-muted-foreground">Frais notaire (acheteur)</div>
                  <div className="text-right">{fmtCurrency(fraisNotaire)}</div>

                  <div className="text-muted-foreground">Coût total acheteur (estim.)</div>
                  <div className="text-right font-semibold">{fmtCurrency(coutTotalAcheteur)}</div>

                  <div className="text-muted-foreground">VAN vendeur (taux {fmtPct(inputs.tauxActualisationPct)})</div>
                  <div className="text-right font-semibold">{fmtCurrency(vanVendeur)}</div>

                  <div className="text-muted-foreground">Rendement vendeur (IRR)</div>
                  <div className="text-right font-semibold">{irrVendeur !== null ? fmtPct(irrVendeur * 100) : "n/a"}</div>

                  <div className="text-muted-foreground">Coût implicite acheteur (IRR)</div>
                  <div className="text-right font-semibold">{irrAcheteur !== null ? fmtPct(irrAcheteur * 100) : "n/a"}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution du cumul des encaissements (vendeur)</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cumulChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" tickFormatter={(v) => `${v}m`} />
                    <YAxis tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                    <Tooltip formatter={(value: any) => fmtCurrency(Number(value))} labelFormatter={(l) => `Mois ${l}`} />
                    <Line type="monotone" dataKey="cumul" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Échéances</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barsEcheances} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                  <Tooltip formatter={(value: any) => fmtCurrency(Number(value))} labelFormatter={(l) => (l === "Bouquet" ? "Signature" : `Mois ${l}`)} />
                  <Bar dataKey="flux" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {inputs.montrerEcheancier && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Échéancier détaillé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="py-2 pr-6">Mois</th>
                        <th className="py-2 pr-6">Montant</th>
                        <th className="py-2 pr-6">Cumul reçu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {echeancier.map((e) => (
                        <tr key={e.mois} className="border-b last:border-0">
                          <td className="py-1 pr-6">{e.mois}</td>
                          <td className="py-1 pr-6">{fmtCurrency(e.montant)}</td>
                          <td className="py-1 pr-6">{fmtCurrency(e.cumul)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Notes & hypothèses</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li>La vente à terme est payée via un bouquet initial puis des échéances fixes; pas d'intérêts par défaut, mais une <strong>indexation annuelle</strong> peut être appliquée ici.</li>
                <li>En cas d'occupation, une <strong>décote d'occupation</strong> réduit la valeur de base. Le pourcentage est paramétrable.</li>
                <li>Les frais de notaire affichés sont indicatifs (souvent à la charge de l'acheteur) et calculés ici comme un pourcentage simple.</li>
                <li>La <strong>VAN vendeur</strong> actualise les encaissements au taux indiqué. L'IRR vendeur et l'IRR acheteur sont annualisés à partir de flux mensuels.</li>
                <li>Outil pédagogique uniquement — ne remplace pas un avis juridique/fiscal. Les régimes fiscaux (plus-value, droits d'enregistrement, etc.) ne sont pas modélisés.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SimulateurVenteTerme;

