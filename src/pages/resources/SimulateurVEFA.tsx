import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Area, AreaChart, Legend } from "recharts";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ==========================
// Utility helpers
// ==========================
const fmtCurrency0 = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const fmtCurrency2 = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
const fmtPct = (n: number) => `${n.toFixed(2)} %`;
const toNumber = (v: string, fallback = 0) => {
  const n = Number((v || "").replace(/\s/g, "").replace(",", "."));
  return isNaN(n) ? fallback : n;
};

// ==========================
// Types
// ==========================

type Milestone = {
  label: string;
  month: number; // month from reservation (0-based)
  cumPct: number; // cumulative % of price paid by this milestone (0..100)
};

type Inputs = {
  prixVEFA: number; // TTC
  apport: number; // cash down payment paid by buyer
  fraisNotairePctVEFA: number; // reduced fees (VEFA), ~2-3%
  fraisNotairePctAncien: number; // for comparison, ~7-8%
  dureeConstructionMois: number; // total duration from réservation to livraison
  milestones: Milestone[];
  tauxAnnuel: number; // nominal annual rate (excluding insurance)
  tauxAssuranceAnnuel: number; // borrower insurance annual rate (on outstanding capital)
  dureeCreditAnnees: number; // amortization length starting at delivery
};

// Default milestone schedule (indicative only)
const defaultMilestones = (totalMonths: number): Milestone[] => [
  { label: "Réservation", month: 0, cumPct: 5 },
  { label: "Acte notarié", month: Math.max(1, Math.round(totalMonths * 0.1)), cumPct: 25 },
  { label: "Fondations", month: Math.round(totalMonths * 0.3), cumPct: 35 },
  { label: "Hors d'eau", month: Math.round(totalMonths * 0.6), cumPct: 70 },
  { label: "Achèvement", month: Math.round(totalMonths * 0.9), cumPct: 95 },
  { label: "Livraison", month: totalMonths, cumPct: 100 },
];

// ==========================
// Core finance math
// ==========================
function annuityPayment(principal: number, annualRate: number, years: number) {
  const r = annualRate / 12;
  const n = Math.max(1, Math.round(years * 12));
  if (r <= 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

function buildDrawdowns(inputs: Inputs) {
  // Normalize milestones by cumulative % and month
  const ordered = [...inputs.milestones].sort((a, b) => a.month - b.month);
  // Ensure cumulative is non-decreasing and last = 100
  const sanitized: Milestone[] = ordered.map((m, i) => ({
    label: m.label,
    month: Math.max(0, Math.min(inputs.dureeConstructionMois, m.month)),
    cumPct: i === ordered.length - 1 ? 100 : Math.max(0, Math.min(100, m.cumPct)),
  }));
  // Remove duplicates by month keeping max cumPct
  const map = new Map<number, Milestone>();
  for (const m of sanitized) {
    const prev = map.get(m.month);
    if (!prev || m.cumPct > prev.cumPct) map.set(m.month, m);
  }
  const uniq = Array.from(map.values()).sort((a, b) => a.month - b.month);
  return uniq;
}

const SimulateurVEFA = () => {
  const [inputs, setInputs] = useState<Inputs>({
    prixVEFA: 320_000,
    apport: 20_000,
    fraisNotairePctVEFA: 2.5,
    fraisNotairePctAncien: 7.5,
    dureeConstructionMois: 20,
    milestones: defaultMilestones(20),
    tauxAnnuel: 3.2,
    tauxAssuranceAnnuel: 0.3,
    dureeCreditAnnees: 25,
  });

  // Derived values
  const fraisNotaireVEFA = useMemo(() => (inputs.prixVEFA * inputs.fraisNotairePctVEFA) / 100, [inputs.prixVEFA, inputs.fraisNotairePctVEFA]);
  const fraisNotaireAncien = useMemo(() => (inputs.prixVEFA * inputs.fraisNotairePctAncien) / 100, [inputs.prixVEFA, inputs.fraisNotairePctAncien]);
  const economieFraisNotaire = useMemo(() => Math.max(0, fraisNotaireAncien - fraisNotaireVEFA), [fraisNotaireAncien, fraisNotaireVEFA]);

  const coutTotalProjet = useMemo(() => inputs.prixVEFA + fraisNotaireVEFA, [inputs.prixVEFA, fraisNotaireVEFA]);
  const besoinFinancement = useMemo(() => Math.max(0, coutTotalProjet - inputs.apport), [coutTotalProjet, inputs.apport]);

  // Drawdowns by milestone (loan funds + buyer cash used at reservation if needed)
  const milestones = useMemo(() => buildDrawdowns(inputs), [inputs]);

  // Build monthly schedule: outstanding increases at milestone months by draw amount (= delta cumPct * prixVEFA)
  const schedule = useMemo(() => {
    const months = inputs.dureeConstructionMois;
    const rNom = inputs.tauxAnnuel / 100 / 12;
    const rAss = inputs.tauxAssuranceAnnuel / 100 / 12;

    let outstanding = 0; // loan drawn
    const principalTarget = besoinFinancement; // we assume all costs financed except apport paid up-front progressively

    const msByMonth = new Map<number, number>(); // cumulative %
    milestones.forEach(m => msByMonth.set(m.month, m.cumPct));

    const rows: { month: number; draw: number; outstanding: number; interest: number; insurance: number; intercalary: number }[] = [];

    let lastCum = 0;
    for (let m = 0; m <= months; m++) {
      const cum = msByMonth.has(m) ? (msByMonth.get(m) as number) : lastCum;
      const deltaPct = Math.max(0, cum - lastCum);
      const neededForPrice = (deltaPct / 100) * inputs.prixVEFA;

      // part financed by loan: proportion vs. total project
      const financedShare = principalTarget / coutTotalProjet; // ratio financed by loan
      const draw = neededForPrice * financedShare; // ignoring fees timing (simplification)

      outstanding += draw;

      const interest = outstanding * rNom; // monthly interest only
      const insurance = outstanding * rAss; // monthly insurance
      const intercalary = interest + insurance;

      rows.push({ month: m, draw, outstanding, interest, insurance, intercalary });
      lastCum = cum;
    }

    // Monthly payment after delivery
    const mensualite = annuityPayment(principalTarget, (inputs.tauxAnnuel + inputs.tauxAssuranceAnnuel) / 100, inputs.dureeCreditAnnees);

    const totalIntercalary = rows.slice(0, rows.length - 1).reduce((s, r) => s + r.intercalary, 0);

    return { rows, mensualite, totalIntercalary, principalTarget };
  }, [inputs, milestones, besoinFinancement, coutTotalProjet]);

  const graphDraws = useMemo(() => schedule.rows.map(r => ({ mois: r.month, tirage: Math.round(r.draw), encours: Math.round(r.outstanding) })), [schedule]);
  const graphInterests = useMemo(() => schedule.rows.map(r => ({ mois: r.month, interets: r.interest + r.insurance })), [schedule]);

  const coutIntercalaires = useMemo(() => schedule.totalIntercalary, [schedule]);
  const mensualite = useMemo(() => schedule.mensualite, [schedule]);

  // ==========================
  // UI helpers
  // ==========================
  const updateMilestone = (idx: number, field: keyof Milestone, value: number | string) => {
    const next = inputs.milestones.map((m, i) => (i === idx ? { ...m, [field]: typeof value === "string" ? toNumber(value, (m as any)[field]) : value } : m));
    setInputs({ ...inputs, milestones: next });
  };

  const resetMilestones = () => setInputs({ ...inputs, milestones: defaultMilestones(inputs.dureeConstructionMois) });

  const applyPreset = (label: "Classique" | "Rapide" | "Longue") => {
    const d = label === "Rapide" ? 14 : label === "Longue" ? 28 : 20;
    setInputs(prev => ({ ...prev, dureeConstructionMois: d, milestones: defaultMilestones(d) }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-semibold">Simulateur VEFA</h1>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => applyPreset("Rapide")} className="rounded-2xl">Livraison rapide</Button>
              <Button variant="secondary" onClick={() => applyPreset("Classique")} className="rounded-2xl">Calendrier classique</Button>
              <Button variant="secondary" onClick={() => applyPreset("Longue")} className="rounded-2xl">Construction longue</Button>
            </div>
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Paramètres du projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Prix VEFA TTC (€)</Label>
                  <Input inputMode="numeric" value={inputs.prixVEFA}
                         onChange={(e) => setInputs({ ...inputs, prixVEFA: toNumber(e.target.value, inputs.prixVEFA) })}/>
                </div>
                <div className="space-y-2">
                  <Label>Apport personnel (€)</Label>
                  <Input inputMode="numeric" value={inputs.apport}
                         onChange={(e) => setInputs({ ...inputs, apport: Math.max(0, toNumber(e.target.value, inputs.apport)) })}/>
                </div>
                <div className="space-y-2">
                  <Label>Durée de construction (mois)</Label>
                  <div className="flex items-center gap-3">
                    <Input inputMode="numeric" value={inputs.dureeConstructionMois}
                           onChange={(e) => setInputs({ ...inputs, dureeConstructionMois: Math.max(6, Math.min(48, toNumber(e.target.value, inputs.dureeConstructionMois))) })}/>
                    <Slider value={[inputs.dureeConstructionMois]} min={6} max={48} step={1}
                            onValueChange={([v]) => setInputs({ ...inputs, dureeConstructionMois: v })}
                            className="w-40"/>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Frais de notaire VEFA (%)</Label>
                  <Input inputMode="numeric" value={inputs.fraisNotairePctVEFA}
                         onChange={(e) => setInputs({ ...inputs, fraisNotairePctVEFA: Math.max(0, toNumber(e.target.value, inputs.fraisNotairePctVEFA)) })}/>
                </div>
                <div className="space-y-2">
                  <Label>Frais de notaire dans l'ancien (%)</Label>
                  <Input inputMode="numeric" value={inputs.fraisNotairePctAncien}
                         onChange={(e) => setInputs({ ...inputs, fraisNotairePctAncien: Math.max(0, toNumber(e.target.value, inputs.fraisNotairePctAncien)) })}/>
                </div>
                <div className="space-y-2">
                  <Label>Économie estimée</Label>
                  <div className="p-2 border rounded-lg text-right font-medium">{fmtCurrency0(economieFraisNotaire)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Taux nominal annuel (%)</Label>
                  <Input inputMode="numeric" value={inputs.tauxAnnuel}
                         onChange={(e) => setInputs({ ...inputs, tauxAnnuel: Math.max(0, toNumber(e.target.value, inputs.tauxAnnuel)) })}/>
                </div>
                <div className="space-y-2">
                  <Label>Assurance emprunteur (%/an)</Label>
                  <Input inputMode="numeric" value={inputs.tauxAssuranceAnnuel}
                         onChange={(e) => setInputs({ ...inputs, tauxAssuranceAnnuel: Math.max(0, toNumber(e.target.value, inputs.tauxAssuranceAnnuel)) })}/>
                </div>
                <div className="space-y-2">
                  <Label>Durée du crédit (années)</Label>
                  <Input inputMode="numeric" value={inputs.dureeCreditAnnees}
                         onChange={(e) => setInputs({ ...inputs, dureeCreditAnnees: Math.max(5, Math.min(30, toNumber(e.target.value, inputs.dureeCreditAnnees))) })}/>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Calendrier des appels de fonds (cumul %)</Label>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Button variant="outline" onClick={resetMilestones} className="rounded-2xl">Réinitialiser</Button>
                    <TooltipProvider>
                      <ShadTooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>Barème indicatif. Adaptez selon votre contrat.</TooltipContent>
                      </ShadTooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  {inputs.milestones.map((m, i) => (
                    <div key={i} className="border rounded-xl p-3 space-y-2">
                      <div className="font-medium text-sm">{m.label}</div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Mois</Label>
                        <Input value={m.month} inputMode="numeric" onChange={(e) => updateMilestone(i, "month", e.target.value)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Cumul %</Label>
                        <Input value={m.cumPct} inputMode="numeric" onChange={(e) => updateMilestone(i, "cumPct", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Résumé financier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Prix VEFA</div>
                  <div className="text-right font-medium">{fmtCurrency0(inputs.prixVEFA)}</div>

                  <div className="text-muted-foreground">Frais de notaire (VEFA)</div>
                  <div className="text-right">{fmtCurrency0(fraisNotaireVEFA)} ({fmtPct(inputs.fraisNotairePctVEFA)})</div>

                  <div className="text-muted-foreground">Coût total projet</div>
                  <div className="text-right font-medium">{fmtCurrency0(coutTotalProjet)}</div>

                  <div className="text-muted-foreground">Apport</div>
                  <div className="text-right">{fmtCurrency0(inputs.apport)}</div>

                  <div className="text-muted-foreground">Besoin de financement</div>
                  <div className="text-right font-semibold">{fmtCurrency0(besoinFinancement)}</div>

                  <div className="text-muted-foreground">Intérêts/assurance avant livraison</div>
                  <div className="text-right">{fmtCurrency0(coutIntercalaires)}</div>

                  <div className="text-muted-foreground">Mensualité après livraison (est.)</div>
                  <div className="text-right font-semibold">{fmtCurrency2(mensualite)}</div>

                  <div className="text-muted-foreground">Économie vs ancien (frais notaire)</div>
                  <div className="text-right text-emerald-700 font-semibold">{fmtCurrency0(economieFraisNotaire)}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle>Tirages et encours pendant la construction</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphDraws} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" tickFormatter={(v) => `${v}m`} />
                    <YAxis tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                    <Tooltip formatter={(value: any) => fmtCurrency0(Number(value))} labelFormatter={(l) => `Mois ${l}`} />
                    <Legend />
                    <Area type="monotone" dataKey="tirage" name="Tirage mensuel" dot={false} />
                    <Area type="monotone" dataKey="encours" name="Encours cumulé" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Coût des intérêts intercalaires</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graphInterests} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis tickFormatter={(v) => v.toLocaleString("fr-FR")} />
                  <Tooltip formatter={(value: any) => fmtCurrency2(Number(value))} labelFormatter={(l) => `Mois ${l}`} />
                  <Bar dataKey="interets" name="Intérêts + assurance" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Avantages de la VEFA</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li><span className="font-medium">Frais de notaire réduits</span> (souvent 2–3% vs 7–8% dans l'ancien) : {fmtCurrency0(economieFraisNotaire)} d'économie estimée ici.</li>
                <li>Logement neuf aux <span className="font-medium">normes énergétiques</span> récentes (moins de travaux, charges optimisées).</li>
                <li><span className="font-medium">Paiement échelonné</span> au rythme du chantier, limitant l'encours moyen avant livraison.</li>
                <li>Possibilité d'<span className="font-medium">options et personnalisations</span> (dans la limite du contrat).</li>
                <li>Garantie d'achèvement, décennale, parfait achèvement (selon réglementation en vigueur).</li>
              </ul>
              <p className="text-xs">Ce simulateur est pédagogique : adaptez les pourcentages d'appels de fonds et vérifiez votre contrat/banque pour les modalités précises.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SimulateurVEFA;
