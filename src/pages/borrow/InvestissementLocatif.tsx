import React, { useState } from 'react';
import { 
  Calculator, 
  Info, 
  Settings, 
  TrendingUp, 
  Home, 
  Euro, 
  Percent, 
  Calendar,
  Building,
  Users,
  Shield,
  ChevronDown,
  Eye,
  EyeOff,
  Download,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const InvestissementLocatif = () => {
  const [donnees, setDonnees] = useState({
    // Section Bien
    prixBien: 120000,
    fraisAgence: 5714.29,
    notaire: 10007,
    travaux: 5000,
    meubles: 5000,
    prixRevente: 140007,
    superficie: 100,
    
    // Section Fiscalité
    fiscalite: 'LMNP Reel',
    tmi: 30,
    
    // Section Revenus
    loyerMensuel: 1500,
    differeLoyer: 0,
    augmentationLoyer: 1,
    vacanceLocative: 0,
    
    // Section Charges
    chargesCopro: 0,
    assurancePNO: 25,
    comptabilite: 0,
    cga: 0,
    fraisBancaires: 7,
    eau: 0,
    electricite: 0,
    gaz: 0,
    internet: 0,
    cfe: 25,
    taxeFonciere: 50,
    chargesDiverses: 25,
    
    // Section Prêt
    apport: 0,
    duree: 240,
    tauxEmprunt: 3.8,
    tauxAssurance: 0.3,
    differe: 0,
    fraisDossier: 500,
    garantie: 0,
  });

  const [parametresAvances, setParametresAvances] = useState({
    amortissementTravaux: 18,
    typeDiffere: 'Partiel',
    showAdvanced: false
  });

  const handleChange = (field: string, value: any) => {
    setDonnees(prev => ({ ...prev, [field]: value }));
  };

  const handleAdvancedChange = (field: string, value: any) => {
    setParametresAvances(prev => ({ ...prev, [field]: value }));
  };

  // Calculs
  const montantTotalProjet = donnees.prixBien + donnees.fraisAgence + donnees.notaire + donnees.travaux + donnees.meubles;
  const montantEmprunter = montantTotalProjet - donnees.apport + donnees.fraisDossier + donnees.garantie;
  
  const tauxMensuel = donnees.tauxEmprunt / 100 / 12;
  const tauxAssuranceMensuel = donnees.tauxAssurance / 100 / 12;
  const mensualiteCredit = montantEmprunter * tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -donnees.duree));
  const mensualiteAssurance = montantEmprunter * tauxAssuranceMensuel;
  const mensualiteTotale = mensualiteCredit + mensualiteAssurance;

  const revenusAnnuel = donnees.loyerMensuel * 12;
  const chargesTotalesMensuel = 
    donnees.chargesCopro + donnees.assurancePNO + donnees.comptabilite + donnees.cga + 
    donnees.fraisBancaires + donnees.eau + donnees.electricite + donnees.gaz + 
    donnees.internet + donnees.cfe + donnees.taxeFonciere + donnees.chargesDiverses;
  
  const chargesTotalesAnnuel = chargesTotalesMensuel * 12;
  const cashFlowMensuel = donnees.loyerMensuel - chargesTotalesMensuel - mensualiteTotale;
  
  const rentabiliteBrute = (revenusAnnuel / montantTotalProjet) * 100;
  const rentabiliteNet = ((revenusAnnuel - chargesTotalesAnnuel) / montantTotalProjet) * 100;

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-slate-400 cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
      <Button variant="ghost" size="sm" className="text-slate-600">
        <Settings className="h-4 w-4 mr-2" />
        Options
      </Button>
    </div>
  );

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    tooltip, 
    suffix = "€",
    type = "number",
    min,
    max,
    step
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    tooltip: string;
    suffix?: string;
    type?: string;
    min?: number;
    max?: number;
    step?: number;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        {label}
        <InfoTooltip content={tooltip} />
      </Label>
      <div className="flex gap-2">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="flex-1"
        />
        {suffix && <span className="flex items-center text-sm text-slate-600">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container max-w-7xl">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simulateur d'Investissement Locatif
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Jouez avec les différentes valeurs afin d'avoir des infos personnalisées sur votre projet. 
            Calcul d'endettement, simulation des mensualités de crédit, simulation de votre cash flow, 
            simulation de vos impôts...
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Paramètres */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Bien */}
            <Card>
              <CardHeader>
                <SectionHeader 
                  title="Le bien" 
                  description="Définissez les caractéristiques de votre investissement" 
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Prix du bien (FAI)"
                    value={donnees.prixBien}
                    onChange={(v) => handleChange('prixBien', v)}
                    tooltip="Prix du bien frais d'agence inclus"
                    min={0}
                    max={1000000}
                    step={1000}
                  />
                  <InputField
                    label="Frais agence"
                    value={donnees.fraisAgence}
                    onChange={(v) => handleChange('fraisAgence', v)}
                    tooltip="Frais d'agence en pourcentage ou montant fixe"
                    suffix={`€ (${((donnees.fraisAgence / donnees.prixBien) * 100).toFixed(1)}%)`}
                  />
                  <InputField
                    label="Notaire"
                    value={donnees.notaire}
                    onChange={(v) => handleChange('notaire', v)}
                    tooltip="Frais de notaire estimés"
                  />
                  <InputField
                    label="Travaux"
                    value={donnees.travaux}
                    onChange={(v) => handleChange('travaux', v)}
                    tooltip="Montant estimé des travaux de rénovation"
                    suffix={`€ amortis sur ${parametresAvances.amortissementTravaux} ans`}
                  />
                  <InputField
                    label="Meubles"
                    value={donnees.meubles}
                    onChange={(v) => handleChange('meubles', v)}
                    tooltip="Valeur des meubles et équipements"
                  />
                  <InputField
                    label="Estimation prix de revente"
                    value={donnees.prixRevente}
                    onChange={(v) => handleChange('prixRevente', v)}
                    tooltip="Estimation du prix de revente futur"
                  />
                  <InputField
                    label="Superficie du logement"
                    value={donnees.superficie}
                    onChange={(v) => handleChange('superficie', v)}
                    tooltip="Surface habitable en m²"
                    suffix="m²"
                  />
                </div>
                
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Montant total du projet (hors prêt)</span>
                    <span className="text-xl font-bold text-teal-600">
                      {montantTotalProjet.toLocaleString()}€
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Fiscalité */}
            <Card>
              <CardHeader>
                <SectionHeader title="Fiscalité" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      Régime fiscal choisi
                      <InfoTooltip content="Choisissez le régime fiscal adapté à votre situation" />
                    </Label>
                    <Select value={donnees.fiscalite} onValueChange={(v) => handleChange('fiscalite', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LMNP Reel">LMNP Réel</SelectItem>
                        <SelectItem value="LMNP Micro">LMNP Micro BIC</SelectItem>
                        <SelectItem value="SCI IR">SCI à l'IR</SelectItem>
                        <SelectItem value="SCI IS">SCI à l'IS</SelectItem>
                        <SelectItem value="Micro Foncier">Micro Foncier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      Taux Marginal d'Imposition (TMI)
                      <InfoTooltip content="Votre tranche marginale d'imposition" />
                    </Label>
                    <Select value={donnees.tmi.toString()} onValueChange={(v) => handleChange('tmi', Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% - Revenu net inférieur à 11 294€</SelectItem>
                        <SelectItem value="11">11% - Revenu net inférieur à 28 797€</SelectItem>
                        <SelectItem value="30">30% - Revenu net inférieur à 73 516€</SelectItem>
                        <SelectItem value="41">41% - Revenu net inférieur à 158 122€</SelectItem>
                        <SelectItem value="45">45% - Revenu net supérieur à 158 122€</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Revenus et Charges */}
            <Tabs defaultValue="revenus" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="revenus">Revenus locatifs</TabsTrigger>
                <TabsTrigger value="charges">Charges et frais</TabsTrigger>
              </TabsList>
              
              <TabsContent value="revenus">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Loyer mensuel"
                        value={donnees.loyerMensuel}
                        onChange={(v) => handleChange('loyerMensuel', v)}
                        tooltip="Loyer mensuel charges non comprises"
                      />
                      <InputField
                        label="Différé de loyer"
                        value={donnees.differeLoyer}
                        onChange={(v) => handleChange('differeLoyer', v)}
                        tooltip="Nombre de mois sans loyer au début"
                        suffix="mois"
                      />
                      <InputField
                        label="Augmentation annuelle du loyer"
                        value={donnees.augmentationLoyer}
                        onChange={(v) => handleChange('augmentationLoyer', v)}
                        tooltip="Pourcentage d'augmentation annuel du loyer"
                        suffix="%"
                      />
                      <InputField
                        label="Vacance locative"
                        value={donnees.vacanceLocative}
                        onChange={(v) => handleChange('vacanceLocative', v)}
                        tooltip="Nombre de mois de vacance locative par an"
                        suffix="mois"
                      />
                    </div>
                    
                    <div className="bg-slate-100 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Revenus annuels : </span>
                          <span className="font-semibold">{revenusAnnuel.toLocaleString()}€</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Rendement brut : </span>
                          <span className="font-semibold">{rentabiliteBrute.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="charges">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: "Charges de copro", field: "chargesCopro" },
                        { label: "Assurance PNO", field: "assurancePNO" },
                        { label: "Comptabilité", field: "comptabilite" },
                        { label: "CGA", field: "cga" },
                        { label: "Frais bancaires", field: "fraisBancaires" },
                        { label: "Eau", field: "eau" },
                        { label: "Électricité", field: "electricite" },
                        { label: "Gaz", field: "gaz" },
                        { label: "Internet", field: "internet" },
                        { label: "CFE", field: "cfe" },
                        { label: "Taxe foncière", field: "taxeFonciere" },
                        { label: "Charges diverses", field: "chargesDiverses" },
                      ].map((item) => (
                        <InputField
                          key={item.field}
                          label={item.label}
                          value={donnees[item.field as keyof typeof donnees] as number}
                          onChange={(v) => handleChange(item.field, v)}
                          tooltip={`${item.label} mensuels`}
                        />
                      ))}
                    </div>
                    
                    <div className="bg-slate-100 rounded-lg p-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Charges totales :</span>
                        <span className="text-lg font-bold text-slate-700">
                          {chargesTotalesMensuel}€/mois, {chargesTotalesAnnuel}€/an
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Section Prêt */}
            <Card>
              <CardHeader>
                <SectionHeader title="Le prêt" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Apport personnel"
                    value={donnees.apport}
                    onChange={(v) => handleChange('apport', v)}
                    tooltip="Montant de votre apport personnel"
                  />
                  <InputField
                    label="Durée du prêt"
                    value={donnees.duree}
                    onChange={(v) => handleChange('duree', v)}
                    tooltip="Durée du crédit en mois"
                    suffix="mois"
                  />
                  <InputField
                    label="Taux d'emprunt"
                    value={donnees.tauxEmprunt}
                    onChange={(v) => handleChange('tauxEmprunt', v)}
                    tooltip="Taux nominal du crédit"
                    suffix="%"
                    step={0.1}
                  />
                  <InputField
                    label="Taux d'assurance"
                    value={donnees.tauxAssurance}
                    onChange={(v) => handleChange('tauxAssurance', v)}
                    tooltip="Taux d'assurance emprunteur"
                    suffix="%"
                    step={0.05}
                  />
                  <InputField
                    label="Différé"
                    value={donnees.differe}
                    onChange={(v) => handleChange('differe', v)}
                    tooltip="Période de différé"
                    suffix="mois"
                  />
                  <InputField
                    label="Frais de dossier"
                    value={donnees.fraisDossier}
                    onChange={(v) => handleChange('fraisDossier', v)}
                    tooltip="Frais de dossier bancaire"
                  />
                  <InputField
                    label="Garantie"
                    value={donnees.garantie}
                    onChange={(v) => handleChange('garantie', v)}
                    tooltip="Frais de garantie"
                  />
                </div>

                {/* Paramètres avancés */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="advanced">
                    <AccordionTrigger className="text-sm font-medium">
                      Paramètres avancés du prêt
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm font-medium">
                            Type de différé
                            <InfoTooltip content="Différé partiel (intérêts seulement) ou total" />
                          </Label>
                          <Select 
                            value={parametresAvances.typeDiffere} 
                            onValueChange={(v) => handleAdvancedChange('typeDiffere', v)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Partiel">Différé partiel</SelectItem>
                              <SelectItem value="Total">Différé total</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <InputField
                          label="Amortissement travaux"
                          value={parametresAvances.amortissementTravaux}
                          onChange={(v) => handleAdvancedChange('amortissementTravaux', v)}
                          tooltip="Durée d'amortissement des travaux"
                          suffix="ans"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Colonne de droite - Résultats */}
          <div className="space-y-6">
            {/* Synthèse */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-teal-600" />
                  Synthèse du projet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Montant à emprunter</span>
                    <span className="font-semibold">{montantEmprunter.toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mensualité crédit</span>
                    <span className="font-semibold">{mensualiteTotale.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Cash-flow mensuel</span>
                    <Badge variant={cashFlowMensuel >= 0 ? "default" : "destructive"}>
                      {cashFlowMensuel.toFixed(2)}€
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Rentabilité nette</span>
                    <Badge className="text-lg bg-teal-100 text-teal-800">
                      {rentabiliteNet.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <div className="text-2xl font-bold text-slate-900">{rentabiliteBrute.toFixed(1)}%</div>
                    <div className="text-sm text-slate-600">Rentabilité brute</div>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-3">
                    <div className="text-2xl font-bold text-slate-900">
                      {((donnees.prixRevente - montantTotalProjet) / montantTotalProjet * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-600">Plus-value potentielle</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter la simulation
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Recevoir par email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Parler à un expert
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Indicateurs clés */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicateurs clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Taux d'endettement", value: "32%", info: "Par rapport à vos revenus" },
                  { label: "Effort d'épargne", value: "18%", info: "Part de votre épargne investie" },
                  { label: "Leverage", value: "4.2x", info: "Effet de levier du crédit" },
                  { label: "Duration", value: "18 ans", info: "Temps de retour sur investissement" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <InfoTooltip content={item.info} />
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Comparaison régimes fiscaux */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comparaison fiscale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {['LMNP Réel', 'LMNP Micro', 'SCI IR', 'SCI IS', 'Micro Foncier'].map((regime) => (
                    <div key={regime} className={`flex justify-between items-center p-2 rounded ${
                      regime === donnees.fiscalite ? 'bg-teal-50 border border-teal-200' : 'bg-slate-50'
                    }`}>
                      <span>{regime}</span>
                      <Badge variant={regime === donnees.fiscalite ? "default" : "outline"}>
                        {Math.round(Math.random() * 5000)}€/an
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section tableau d'amortissement */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Projection sur 30 ans</CardTitle>
            <CardDescription>
              Tableau d'amortissement et projection de trésorerie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Année</th>
                    <th className="text-right p-2">Mensualité</th>
                    <th className="text-right p-2">Cash-flow</th>
                    <th className="text-right p-2">Impôts</th>
                    <th className="text-right p-2">Capital remboursé</th>
                    <th className="text-right p-2">Valeur nette</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 5, 10, 15, 20, 25, 30].map((annee) => (
                    <tr key={annee} className="border-b hover:bg-slate-50">
                      <td className="p-2 font-medium">Année {annee}</td>
                      <td className="p-2 text-right">{mensualiteTotale.toFixed(0)}€</td>
                      <td className="p-2 text-right">
                        <Badge variant={cashFlowMensuel * 12 >= 0 ? "default" : "destructive"}>
                          {(cashFlowMensuel * 12).toFixed(0)}€
                        </Badge>
                      </td>
                      <td className="p-2 text-right">
                        {Math.round((cashFlowMensuel * 12 * donnees.tmi / 100))}€
                      </td>
                      <td className="p-2 text-right">
                        {Math.round(mensualiteCredit * 12 * annee * 0.3)}€
                      </td>
                      <td className="p-2 text-right font-semibold">
                        {Math.round(donnees.prixRevente * (1 + 0.02 * annee) - (montantEmprunter - mensualiteCredit * 12 * annee * 0.3))}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestissementLocatif;
