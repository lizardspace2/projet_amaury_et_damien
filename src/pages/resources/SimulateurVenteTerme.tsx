import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator, Clock, Euro, Calendar, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SimulateurVenteTerme = () => {
  const [formData, setFormData] = useState({
    prixVente: '',
    prixFinal: '',
    dureeDiffere: '',
    tauxInteret: '',
    apport: '',
    fraisNotaire: '',
    fraisDossier: ''
  });

  const [resultats, setResultats] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculerVenteTerme = () => {
    const prixVente = parseFloat(formData.prixVente) || 0;
    const prixFinal = parseFloat(formData.prixFinal) || 0;
    const dureeDiffere = parseInt(formData.dureeDiffere) || 0;
    const tauxInteret = parseFloat(formData.tauxInteret) || 0;
    const apport = parseFloat(formData.apport) || 0;
    const fraisNotaire = parseFloat(formData.fraisNotaire) || 0;
    const fraisDossier = parseFloat(formData.fraisDossier) || 0;

    if (prixVente && prixFinal && dureeDiffere && tauxInteret && apport) {
      const montantEmprunte = prixFinal - apport;
      const tauxMensuel = tauxInteret / 100 / 12;
      const mensualite = (montantEmprunte * tauxMensuel * Math.pow(1 + tauxMensuel, dureeDiffere)) / 
                        (Math.pow(1 + tauxMensuel, dureeDiffere) - 1);
      const coutTotal = (mensualite * dureeDiffere) + fraisNotaire + fraisDossier;
      const coutCredit = coutTotal - montantEmprunte;
      const economieVenteTerme = prixFinal - prixVente;

      setResultats({
        montantEmprunte,
        mensualite,
        coutTotal,
        coutCredit,
        economieVenteTerme,
        fraisNotaire,
        fraisDossier
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">
                Simulateur de Vente à Terme
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Calculez votre vente à terme et découvrez les conditions de votre opération différée
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Paramètres de la vente à terme
                </CardTitle>
                <CardDescription>
                  Renseignez les informations de votre opération
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prixVente">Prix de vente initial (€)</Label>
                    <Input
                      id="prixVente"
                      name="prixVente"
                      type="number"
                      placeholder="280000"
                      value={formData.prixVente}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prixFinal">Prix final du bien (€)</Label>
                    <Input
                      id="prixFinal"
                      name="prixFinal"
                      type="number"
                      placeholder="300000"
                      value={formData.prixFinal}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dureeDiffere">Durée du différé (mois)</Label>
                    <Input
                      id="dureeDiffere"
                      name="dureeDiffere"
                      type="number"
                      placeholder="24"
                      value={formData.dureeDiffere}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tauxInteret">Taux d'intérêt annuel (%)</Label>
                    <Input
                      id="tauxInteret"
                      name="tauxInteret"
                      type="number"
                      step="0.01"
                      placeholder="4.0"
                      value={formData.tauxInteret}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apport">Apport personnel (€)</Label>
                    <Input
                      id="apport"
                      name="apport"
                      type="number"
                      placeholder="60000"
                      value={formData.apport}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fraisNotaire">Frais de notaire (€)</Label>
                    <Input
                      id="fraisNotaire"
                      name="fraisNotaire"
                      type="number"
                      placeholder="4000"
                      value={formData.fraisNotaire}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fraisDossier">Frais de dossier (€)</Label>
                    <Input
                      id="fraisDossier"
                      name="fraisDossier"
                      type="number"
                      placeholder="1200"
                      value={formData.fraisDossier}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculerVenteTerme}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-lg font-semibold"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculer ma vente à terme
                </Button>
              </CardContent>
            </Card>

            {/* Résultats */}
            <div className="space-y-6">
              {resultats ? (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-violet-600" />
                      Résultats du calcul
                    </CardTitle>
                    <CardDescription>
                      Détail de votre vente à terme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">Montant emprunté</span>
                        <span className="font-bold text-lg text-purple-600">
                          {resultats.montantEmprunte.toLocaleString('fr-FR')} €
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">Mensualité</span>
                        <span className="font-bold text-lg text-violet-600">
                          {resultats.mensualite.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="font-medium">Économie vente à terme</span>
                        <span className="font-bold text-lg text-green-600">
                          {resultats.economieVenteTerme.toLocaleString('fr-FR')} €
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">Coût total du crédit</span>
                        <span className="font-bold text-lg text-red-600">
                          {resultats.coutCredit.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">Coût total de l'opération</span>
                        <span className="font-bold text-lg text-slate-700">
                          {resultats.coutTotal.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700">Détail des frais</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Frais de notaire</span>
                          <span>{resultats.fraisNotaire.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frais de dossier</span>
                          <span>{resultats.fraisDossier.toLocaleString('fr-FR')} €</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Euro className="h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      Résultats du calcul
                    </h3>
                    <p className="text-slate-500">
                      Renseignez les informations ci-contre pour voir les résultats de votre vente à terme
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Informations sur la vente à terme */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Qu'est-ce que la vente à terme ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <p>
                    La vente à terme permet d'acheter un bien immobilier avec un paiement différé, 
                    souvent à un prix préférentiel par rapport au marché.
                  </p>
                  <p>
                    Cette formule offre une flexibilité de paiement et peut permettre d'économiser 
                    sur le prix d'achat en échange d'un engagement à long terme.
                  </p>
                  <p className="font-medium text-slate-700">
                    ⚠️ Cette simulation est indicative et ne remplace pas l'avis d'un professionnel.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SimulateurVenteTerme;
