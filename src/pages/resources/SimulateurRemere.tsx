import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

const fmtCurrency = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const fmtPct = (n: number) => `${n.toFixed(2)} %`;

function irr(cashFlows: number[], guess = 0.1): number | null {
  let rate = guess;
  for (let i = 0; i < 100; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const cf = cashFlows[t];
      const denom = Math.pow(1 + rate, t);
      npv += cf / denom;
      dnpv += (-t * cf) / Math.pow(1 + rate, t + 1);
    }
    const newRate = rate - npv / dnpv;
    if (!isFinite(newRate)) return null;
    if (Math.abs(newRate - rate) < 1e-8) {
      const annual = Math.pow(1 + newRate, 12) - 1;
      return isFinite(annual) ? annual : null;
    }
    rate = newRate;
  }
  return null;
}

const toNumber = (v: string, fallback = 0) => {
  const n = Number((v || "").replace(/\s/g, "").replace(",", "."));
  return isNaN(n) ? fallback : n;
};

type ModeIndemnite = "pourcentage" | "montant";

type Preset = {
  label: string;
  values: Partial<Inputs>;
};

type Inputs = {
  valeurMarche: number;
  decotePourcent: number;
  fraisTransactionPct: number;
  fraisRachatPct: number;
  primeRachatPct: number;
  dureeMois: number;
  modeIndemnite: ModeIndemnite;
  indemnitePctAn: number;
  indemniteFixeMensuelle: number;
};

const presets: Preset[] = [
  {
    label: "Conservateur",
    values: { decotePourcent: 20, primeRachatPct: 5, fraisTransactionPct: 8, fraisRachatPct: 6, indemnitePctAn: 6, dureeMois: 12 },
  },
  {
    label: "Standard",
    values: { decotePourcent: 25, primeRachatPct: 8, fraisTransactionPct: 9, fraisRachatPct: 7, indemnitePctAn: 8, dureeMois: 18 },
  },
  {
    label: "Agressif",
    values: { decotePourcent: 30, primeRachatPct: 10, fraisTransactionPct: 10, fraisRachatPct: 8, indemnitePctAn: 10, dureeMois: 24 },
  },
];

export default function RemereSimulator() {
  const [inputs, setInputs] = useState<Inputs>({
    valeurMarche: 300_000,
    decotePourcent: 25,
    fraisTransactionPct: 9,
    fraisRachatPct: 7,
    primeRachatPct: 8,
    dureeMois: 18,
    modeIndemnite: "pourcentage",
    indemnitePctAn: 8,
    indemniteFixeMensuelle: 0,
  });

  const purchasePrice = useMemo(() => {
    const gross = inputs.valeurMarche * (1 - inputs.decotePourcent / 100);
    return Math.max(0, gross);
  }, [inputs.valeurMarche, inputs.decotePourcent]);

  const fraisTransaction = useMemo(() => (purchasePrice * inputs.fraisTransactionPct) / 100, [purchasePrice, inputs.fraisTransactionPct]);
  const netCashSeller = useMemo(() => purchasePrice - fraisTransaction, [purchasePrice, fraisTransaction]);

  const indemnityMonthly = useMemo(() => {
    if (inputs.modeIndemnite === "montant") return Math.max(0, inputs.indemniteFixeMensuelle);
    const annual = (purchasePrice * inputs.indemnitePctAn) / 100;
    return annual / 12;
  }, [inputs.modeIndemnite, inputs.indemniteFixeMensuelle, inputs.indemnitePctAn, purchasePrice]);

  const totalIndemnity = useMemo(() => indemnityMonthly * inputs.dureeMois, [indemnityMonthly, inputs.dureeMois]);

  const rachatBase = useMemo(() => purchasePrice * (1 + inputs.primeRachatPct / 100), [purchasePrice, inputs.primeRachatPct]);
  const fraisRachat = useMemo(() => (rachatBase * inputs.fraisRachatPct) / 100, [rachatBase, inputs.fraisRachatPct]);
  const rachatTotal = useMemo(() => rachatBase + fraisRachat, [rachatBase, fraisRachat]);

  const coutOperationBrut = useMemo(() => rachatTotal + totalIndemnity, [rachatTotal, totalIndemnity]);
  const coutNetPourVendeur = useMemo(() => coutOperationBrut - netCashSeller, [coutOperationBrut, netCashSeller]);

  const cashFlows = useMemo(() => {
    const flows: number[] = [];
    flows.push(netCashSeller);
    for (let m = 1; m <= inputs.dureeMois; m++) {
      if (m < inputs.dureeMois) {
        flows.push(-indemnityMonthly);
      } else {
        flows.push(-(indemnityMonthly + rachatTotal));
      }
    }
    return flows;
  }, [netCashSeller, indemnityMonthly, rachatTotal, inputs.dureeMois]);

  const apr = useMemo(() => {
    const monthly = irr(cashFlows, 0.02);
    return monthly ?? null;
  }, [cashFlows]);

  const dataChart = useMemo(() => {
    const points = [{ mois: 0, cumul: netCashSeller }];
    let cumul = netCashSeller;
    for (let m = 1; m <= inputs.dureeMois; m++) {
      const out = m < inputs.dureeMois ? indemnityMonthly : indemnityMonthly + rachatTotal;
      cumul -= out;
      points.push({ mois: m, cumul });
    }
    return points;
  }, [inputs.dureeMois, indemnityMonthly, rachatTotal, netCashSeller]);

  const barsCashFlows = useMemo(() => {
    const arr = [{ label: "t0", flux: Math.round(netCashSeller) }];
    for (let m = 1; m <= inputs.dureeMois; m++) {
      const out = m < inputs.dureeMois ? -indemnityMonthly : -(indemnityMonthly + rachatTotal);
      arr.push({ label: `${m}`, flux: Math.round(out) });
    }
    return arr;
  }, [inputs.dureeMois, netCashSeller, indemnityMonthly, rachatTotal]);

  const applyPreset = (p: Preset) => setInputs(prev => ({ ...prev, ...p.values }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
    <div className="w-full mx-auto max-w-7xl p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-semibold">Simulateur de réméré immobilier</h1>
        <div className="flex gap-2">
          {presets.map(p => (
            <Button key={p.label} variant="secondary" onClick={() => applyPreset(p)} className="rounded-2xl">
              {p.label}
            </Button>
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
              <Label>Décote (%)</Label>
              <div className="flex items-center gap-3">
                    <Input
                  inputMode="numeric"
                  value={inputs.decotePourcent}
                  onChange={(e) => setInputs({ ...inputs, decotePourcent: toNumber(e.target.value, inputs.decotePourcent) })}
                />
                <Slider
                  value={[inputs.decotePourcent]}
                  min={0}
                  max={40}
                  step={1}
                  onValueChange={([v]) => setInputs({ ...inputs, decotePourcent: v })}
                  className="w-40"
                />
              </div>
                  </div>

                  <div className="space-y-2">
              <Label>Durée (mois)</Label>
              <div className="flex items-center gap-3">
                    <Input
                  inputMode="numeric"
                  value={inputs.dureeMois}
                  onChange={(e) => setInputs({ ...inputs, dureeMois: Math.max(1, Math.min(60, toNumber(e.target.value, inputs.dureeMois))) })}
                />
                <Slider
                  value={[inputs.dureeMois]}
                  min={1}
                  max={60}
                  step={1}
                  onValueChange={([v]) => setInputs({ ...inputs, dureeMois: v })}
                  className="w-40"
                />
              </div>
            </div>
                  </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
              <Label>Frais transaction (aller) %</Label>
                    <Input
                inputMode="numeric"
                value={inputs.fraisTransactionPct}
                onChange={(e) => setInputs({ ...inputs, fraisTransactionPct: Math.max(0, toNumber(e.target.value, inputs.fraisTransactionPct)) })}
                    />
                  </div>

                  <div className="space-y-2">
              <Label>Prime de rachat (%)</Label>
                    <Input
                inputMode="numeric"
                value={inputs.primeRachatPct}
                onChange={(e) => setInputs({ ...inputs, primeRachatPct: Math.max(0, toNumber(e.target.value, inputs.primeRachatPct)) })}
                    />
                  </div>

                  <div className="space-y-2">
              <Label>Frais au rachat (%)</Label>
                    <Input
                inputMode="numeric"
                value={inputs.fraisRachatPct}
                onChange={(e) => setInputs({ ...inputs, fraisRachatPct: Math.max(0, toNumber(e.target.value, inputs.fraisRachatPct)) })}
                    />
                  </div>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label>Mode d'indemnité d'occupation</Label>
              <Select
                value={inputs.modeIndemnite}
                onValueChange={(v: ModeIndemnite) => setInputs({ ...inputs, modeIndemnite: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pourcentage">% par an du prix d'achat</SelectItem>
                  <SelectItem value="montant">Montant fixe mensuel (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inputs.modeIndemnite === "pourcentage" ? (
              <div className="space-y-2">
                <Label>Indemnité (%/an du prix d'achat)</Label>
                <Input
                  inputMode="numeric"
                  value={inputs.indemnitePctAn}
                  onChange={(e) => setInputs({ ...inputs, indemnitePctAn: Math.max(0, toNumber(e.target.value, inputs.indemnitePctAn)) })}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Indemnité fixe mensuelle (€)</Label>
                <Input
                  inputMode="numeric"
                  value={inputs.indemniteFixeMensuelle}
                  onChange={(e) => setInputs({ ...inputs, indemniteFixeMensuelle: Math.max(0, toNumber(e.target.value, inputs.indemniteFixeMensuelle)) })}
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>Les résultats sont des estimations pédagogiques, non des conseils financiers.</span>
            </div>
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
              <div className="text-muted-foreground">Prix d'achat (investisseur)</div>
              <div className="text-right font-medium">{fmtCurrency(purchasePrice)}</div>

              <div className="text-muted-foreground">Frais transaction (aller)</div>
              <div className="text-right">{fmtCurrency(fraisTransaction)} ({fmtPct(inputs.fraisTransactionPct)})</div>

              <div className="text-muted-foreground">Trésorerie nette reçue</div>
              <div className="text-right font-medium">{fmtCurrency(netCashSeller)}</div>

              <div className="text-muted-foreground">Indemnité mensuelle</div>
              <div className="text-right">{fmtCurrency(indemnityMonthly)}</div>

              <div className="text-muted-foreground">Total indemnités</div>
              <div className="text-right">{fmtCurrency(totalIndemnity)}</div>

              <div className="text-muted-foreground">Prix de rachat (hors frais)</div>
              <div className="text-right">{fmtCurrency(rachatBase)} ({fmtPct(inputs.primeRachatPct)})</div>

              <div className="text-muted-foreground">Frais au rachat</div>
              <div className="text-right">{fmtCurrency(fraisRachat)} ({fmtPct(inputs.fraisRachatPct)})</div>

              <div className="text-muted-foreground">Rachat total</div>
              <div className="text-right font-medium">{fmtCurrency(rachatTotal)}</div>

              <div className="text-muted-foreground">Coût brut de l'opération</div>
              <div className="text-right">{fmtCurrency(coutOperationBrut)}</div>

              <div className="text-muted-foreground">Coût net (vs. cash reçu)</div>
              <div className="text-right font-semibold">{fmtCurrency(coutNetPourVendeur)}</div>

              <div className="text-muted-foreground">TAEG implicite (approx.)</div>
              <div className="text-right font-semibold">{apr !== null ? fmtPct(apr * 100) : "n/a"}</div>
                    </div>
                  </CardContent>
                </Card>

        <Card className="rounded-2xl lg:col-span-2">
                <CardHeader>
            <CardTitle>Évolution du cumul de trésorerie</CardTitle>
                </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
          <CardTitle>Flux de trésorerie mensuels</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barsCashFlows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => v.toLocaleString("fr-FR")} />
              <Tooltip formatter={(value: any) => fmtCurrency(Number(value))} labelFormatter={(l) => (l === "t0" ? "Départ" : `Mois ${l}`)} />
              <Bar dataKey="flux" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Notes & hypothèses</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>Le prix d'achat de l'investisseur = valeur de marché × (1 − décote).</li>
            <li>La trésorerie nette reçue = prix d'achat − frais de transaction (aller).</li>
            <li>L'indemnité d'occupation est soit un pourcentage annuel du prix d'achat, soit un montant fixe mensuel.</li>
            <li>Le prix de rachat = prix d'achat × (1 + prime de rachat), auquel s'ajoutent les frais de rachat.</li>
            <li>Le coût net compare tout ce que vous payez (indemnités + rachat total) à ce que vous avez reçu au départ.</li>
            <li>Le TAEG implicite est une approximation basée sur l'IRR des flux mensuels et annualisée.</li>
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

