import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fmtCurrency = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
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

type ModeIndemnite = "pourcentage" | "montant";

type Inputs = {
  valeurMarche: number;
  decoteAchatPct: number;
  fraisAcquisitionPct: number;
  dureeMois: number;
  modeIndemnite: ModeIndemnite;
  indemnitePctAn: number;
  indemniteFixeMensuelle: number;
  primeRachatPct: number;
  fraisRachatPct: number;
  apportInitialOccupant: number;
  montrerEcheancier: boolean;
};

const SimulateurRemereInverse = () => {
  const [inputs, setInputs] = useState<Inputs>({
    valeurMarche: 300_000,
    decoteAchatPct: 10,
    fraisAcquisitionPct: 8,
    dureeMois: 24,
    modeIndemnite: "pourcentage",
    indemnitePctAn: 7,
    indemniteFixeMensuelle: 0,
    primeRachatPct: 6,
    fraisRachatPct: 7,
    apportInitialOccupant: 10_000,
    montrerEcheancier: false,
  });

  const prixAchatInvest = useMemo(() => inputs.valeurMarche * (1 - inputs.decoteAchatPct / 100), [inputs.valeurMarche, inputs.decoteAchatPct]);
  const fraisAcquisition = useMemo(() => (prixAchatInvest * inputs.fraisAcquisitionPct) / 100, [prixAchatInvest, inputs.fraisAcquisitionPct]);
  const coutInvestisseurT0 = useMemo(() => prixAchatInvest + fraisAcquisition, [prixAchatInvest, fraisAcquisition]);

  const montantFinance = useMemo(() => Math.max(0, coutInvestisseurT0 - inputs.apportInitialOccupant), [coutInvestisseurT0, inputs.apportInitialOccupant]);

  const indemniteMensuelle = useMemo(() => {
    if (inputs.modeIndemnite === "montant") return Math.max(0, inputs.indemniteFixeMensuelle);
    const ann = (prixAchatInvest * inputs.indemnitePctAn) / 100;
    return ann / 12;
  }, [inputs.modeIndemnite, inputs.indemniteFixeMensuelle, inputs.indemnitePctAn, prixAchatInvest]);

  const totalIndemnites = useMemo(() => indemniteMensuelle * inputs.dureeMois, [indemniteMensuelle, inputs.dureeMois]);

  const prixRachatBase = useMemo(() => prixAchatInvest * (1 + inputs.primeRachatPct / 100), [prixAchatInvest, inputs.primeRachatPct]);
  const fraisRachat = useMemo(() => (prixRachatBase * inputs.fraisRachatPct) / 100, [prixRachatBase, inputs.fraisRachatPct]);
  const rachatTotal = useMemo(() => prixRachatBase + fraisRachat, [prixRachatBase, fraisRachat]);

  const coutTotalOccupant = useMemo(() => inputs.apportInitialOccupant + totalIndemnites + rachatTotal, [inputs.apportInitialOccupant, totalIndemnites, rachatTotal]);

  const cashFlows = useMemo(() => {
    const flows: number[] = [];
    flows.push(montantFinance);
    for (let m = 1; m <= inputs.dureeMois; m++) {
      if (m < inputs.dureeMois) flows.push(-indemniteMensuelle);
      else flows.push(-(indemniteMensuelle + rachatTotal));
    }
    return flows;
  }, [montantFinance, indemniteMensuelle, rachatTotal, inputs.dureeMois]);

  const irrImplice = useMemo(() => irrMonthlyToAnnual(cashFlows, 0.01), [cashFlows]);

  const cumulChart = useMemo(() => {
    const pts: { mois: number; cumul: number }[] = [{ mois: 0, cumul: -inputs.apportInitialOccupant }];
    let cumul = -inputs.apportInitialOccupant;
    for (let m = 1; m <= inputs.dureeMois; m++) {
      const out = m < inputs.dureeMois ? indemniteMensuelle : indemniteMensuelle + rachatTotal;
      cumul -= out;
      pts.push({ mois: m, cumul });
    }
    return pts;
  }, [inputs.apportInitialOccupant, inputs.dureeMois, indemniteMensuelle, rachatTotal]);

  const barsFlux = useMemo(() => {
    const arr = [{ label: "t0 virtuel", flux: Math.round(montantFinance - inputs.apportInitialOccupant) }];
    for (let m = 1; m <= inputs.dureeMois; m++) {
      const out = m < inputs.dureeMois ? -indemniteMensuelle : -(indemniteMensuelle + rachatTotal);
      arr.push({ label: `${m}`, flux: Math.round(out) });
    }
    return arr;
  }, [montantFinance, inputs.apportInitialOccupant, inputs.dureeMois, indemniteMensuelle, rachatTotal]);

  const applyPreset = (name: string) => {
    if (name === "Conservateur") {
      setInputs((s) => ({ ...s, decoteAchatPct: 5, fraisAcquisitionPct: 7, indemnitePctAn: 6, primeRachatPct: 4, fraisRachatPct: 6, dureeMois: 18 }));
    } else if (name === "Standard") {
      setInputs((s) => ({ ...s, decoteAchatPct: 10, fraisAcquisitionPct: 8, indemnitePctAn: 7, primeRachatPct: 6, fraisRachatPct: 7, dureeMois: 24 }));
    } else if (name === "Agressif") {
      setInputs((s) => ({ ...s, decoteAchatPct: 15, fraisAcquisitionPct: 9, indemnitePctAn: 9, primeRachatPct: 8, fraisRachatPct: 8, dureeMois: 36 }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de Réméré Inversé</h1>
              <p className="text-muted-foreground">Calculez votre réméré inversé et découvrez les conditions de votre opération.</p>
            </div>
            <div className="flex gap-2">
              {(["Conservateur", "Standard", "Agressif"] as const).map((p) => (
                <Button key={p} variant="secondary" onClick={() => applyPreset(p)} className="rounded-2xl">{p}</Button>
              ))}
            </div>
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
                  <Label>Décote à l'achat (%)</Label>
                  <div className="flex items-center gap-3">
                    <Input inputMode="numeric" value={inputs.decoteAchatPct} onChange={(e) => setInputs({ ...inputs, decoteAchatPct: Math.max(0, toNumber(e.target.value, inputs.decoteAchatPct)) })} />
                    <Slider value={[inputs.decoteAchatPct]} min={0} max={30} step={1} onValueChange={([v]) => setInputs({ ...inputs, decoteAchatPct: v })} className="w-40" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Frais d'acquisition investisseur (%)</Label>
                  <Input inputMode="numeric" value={inputs.fraisAcquisitionPct} onChange={(e) => setInputs({ ...inputs, fraisAcquisitionPct: Math.max(0, toNumber(e.target.value, inputs.fraisAcquisitionPct)) })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Durée (mois)</Label>
                  <div className="flex items-center gap-3">
                    <Input inputMode="numeric" value={inputs.dureeMois} onChange={(e) => setInputs({ ...inputs, dureeMois: Math.max(1, Math.min(60, toNumber(e.target.value, inputs.dureeMois))) })} />
                    <Slider value={[inputs.dureeMois]} min={1} max={60} step={1} onValueChange={([v]) => setInputs({ ...inputs, dureeMois: v })} className="w-40" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mode d'indemnité d'occupation</Label>
                  <Select value={inputs.modeIndemnite} onValueChange={(v: ModeIndemnite) => setInputs({ ...inputs, modeIndemnite: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pourcentage">%/an du prix d'achat investisseur</SelectItem>
                      <SelectItem value="montant">Montant fixe mensuel (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inputs.modeIndemnite === "pourcentage" ? (
                  <div className="space-y-2">
                    <Label>Indemnité (%/an)</Label>
                    <Input inputMode="numeric" value={inputs.indemnitePctAn} onChange={(e) => setInputs({ ...inputs, indemnitePctAn: Math.max(0, toNumber(e.target.value, inputs.indemnitePctAn)) })} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Indemnité fixe mensuelle (€)</Label>
                    <Input inputMode="numeric" value={inputs.indemniteFixeMensuelle} onChange={(e) => setInputs({ ...inputs, indemniteFixeMensuelle: Math.max(0, toNumber(e.target.value, inputs.indemniteFixeMensuelle)) })} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Prime de rachat (%)</Label>
                  <Input inputMode="numeric" value={inputs.primeRachatPct} onChange={(e) => setInputs({ ...inputs, primeRachatPct: Math.max(0, toNumber(e.target.value, inputs.primeRachatPct)) })} />
                </div>
                <div className="space-y-2">
                  <Label>Frais au rachat (%)</Label>
                  <Input inputMode="numeric" value={inputs.fraisRachatPct} onChange={(e) => setInputs({ ...inputs, fraisRachatPct: Math.max(0, toNumber(e.target.value, inputs.fraisRachatPct)) })} />
                </div>
                <div className="space-y-2">
                  <Label>Apport initial occupant (€)</Label>
                  <Input inputMode="numeric" value={inputs.apportInitialOccupant} onChange={(e) => setInputs({ ...inputs, apportInitialOccupant: Math.max(0, toNumber(e.target.value, inputs.apportInitialOccupant)) })} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={inputs.montrerEcheancier} onCheckedChange={(v) => setInputs({ ...inputs, montrerEcheancier: v })} />
                <span className="text-sm">Afficher l'échéancier détaillé</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4" />
                <span>
                  Le réméré inversé modélisé : un investisseur achète le bien, l'occupant y reste et dispose d'une option de rachat à prix fixé. Nous calculons un TAEG implicite en considérant que l'investisseur finance virtuellement l'acquisition pour l'occupant.
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Résumé opération</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Prix d'achat investisseur</div>
                  <div className="text-right font-medium">{fmtCurrency(prixAchatInvest)}</div>

                  <div className="text-muted-foreground">Frais d'acquisition investisseur</div>
                  <div className="text-right">{fmtCurrency(fraisAcquisition)}</div>

                  <div className="text-muted-foreground">Coût investi à t0</div>
                  <div className="text-right font-medium">{fmtCurrency(coutInvestisseurT0)}</div>

                  <div className="text-muted-foreground">Montant financé virtuel</div>
                  <div className="text-right font-semibold">{fmtCurrency(montantFinance)}</div>

                  <div className="text-muted-foreground">Indemnité mensuelle</div>
                  <div className="text-right">{fmtCurrency(indemniteMensuelle)}</div>

                  <div className="text-muted-foreground">Total indemnités</div>
                  <div className="text-right">{fmtCurrency(totalIndemnites)}</div>

                  <div className="text-muted-foreground">Prix de rachat (hors frais)</div>
                  <div className="text-right">{fmtCurrency(prixRachatBase)}</div>

                  <div className="text-muted-foreground">Frais au rachat</div>
                  <div className="text-right">{fmtCurrency(fraisRachat)}</div>

                  <div className="text-muted-foreground">Rachat total</div>
                  <div className="text-right font-medium">{fmtCurrency(rachatTotal)}</div>

                  <div className="text-muted-foreground">Coût total occupant</div>
                  <div className="text-right font-semibold">{fmtCurrency(coutTotalOccupant)}</div>

                  <div className="text-muted-foreground">TAEG implicite (approx.)</div>
                  <div className="text-right font-semibold">{irrImplice !== null ? fmtPct(irrImplice * 100) : "n/a"}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle>Évolution du cumul net (occupant)</CardTitle>
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
              <CardTitle>Flux de trésorerie</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barsFlux} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                  <Tooltip formatter={(value: any) => fmtCurrency(Number(value))} labelFormatter={(l) => (l === "t0 virtuel" ? "Départ" : `Mois ${l}`)} />
                  <Bar dataKey="flux" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {inputs.montrerEcheancier && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Échéancier détaillé (indemnités)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="py-2 pr-6">Mois</th>
                        <th className="py-2 pr-6">Indemnité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: inputs.dureeMois }).map((_, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="py-1 pr-6">{idx + 1}</td>
                          <td className="py-1 pr-6">{fmtCurrency(idx + 1 < inputs.dureeMois ? indemniteMensuelle : indemniteMensuelle)}</td>
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
                <li>Le réméré inversé est modélisé comme un <strong>portage immobilier</strong> : l'investisseur acquiert aujourd'hui; l'occupant a une option d'achat future à prix fixé.</li>
                <li>L'occupant verse une <strong>indemnité d'occupation</strong> mensuelle et exerce l'option en fin de période.</li>
                <li>Le <strong>TAEG implicite</strong> est une approximation : on considère que l'occupant reçoit à t0 un financement virtuel égal au coût investi par l'investisseur moins l'apport initial.</li>
                <li>Les fiscalités, garanties, pénalités de non-rachat et variations de valeur ne sont pas modélisées. Outil pédagogique uniquement.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SimulateurRemereInverse;
