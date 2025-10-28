import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator, RotateCcw, Euro, Calendar, TrendingUp } from 'lucide-react';

const SimulateurRemereInverse = () => {
  const [formData, setFormData] = useState({
    prixVente: '',
    prixRachat: '',
    duree: '',
    tauxInteret: '',
    fraisNotaire: '',
    fraisDossier: ''
  });

  const [resultats, setResultats] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculerRemereInverse = () => {
    const prixVente = parseFloat(formData.prixVente) || 0;
    const prixRachat = parseFloat(formData.prixRachat) || 0;
    const duree = parseInt(formData.duree) || 0;
    const tauxInteret = parseFloat(formData.tauxInteret) || 0;
    const fraisNotaire = parseFloat(formData.fraisNotaire) || 0;
    const fraisDossier = parseFloat(formData.fraisDossier) || 0;

    if (prixVente && prixRachat && duree && tauxInteret) {
      const montantEmprunte = prixRachat - prixVente;
      const tauxMensuel = tauxInteret / 100 / 12;
      const mensualite = (montantEmprunte * tauxMensuel * Math.pow(1 + tauxMensuel, duree)) / 
                        (Math.pow(1 + tauxMensuel, duree) - 1);
      const coutTotal = (mensualite * duree) + fraisNotaire + fraisDossier;
      const coutCredit = coutTotal - montantEmprunte;

      setResultats({
        montantEmprunte,
        mensualite,
        coutTotal,
        coutCredit,
        fraisNotaire,
        fraisDossier
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent">
                Simulateur de Réméré Inversé
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Calculez votre réméré inversé et découvrez les conditions de votre opération
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                  Paramètres du réméré inversé
                </CardTitle>
                <CardDescription>
                  Renseignez les informations de votre opération
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prixVente">Prix de vente du bien (€)</Label>
                    <Input
                      id="prixVente"
                      name="prixVente"
                      type="number"
                      placeholder="300000"
                      value={formData.prixVente}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prixRachat">Prix de rachat (€)</Label>
                    <Input
                      id="prixRachat"
                      name="prixRachat"
                      type="number"
                      placeholder="350000"
                      value={formData.prixRachat}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duree">Durée du réméré inversé (mois)</Label>
                    <Input
                      id="duree"
                      name="duree"
                      type="number"
                      placeholder="36"
                      value={formData.duree}
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
                      placeholder="5.0"
                      value={formData.tauxInteret}
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
                      placeholder="6000"
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
                      placeholder="1500"
                      value={formData.fraisDossier}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculerRemereInverse}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg font-semibold"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculer mon réméré inversé
                </Button>
              </CardContent>
            </Card>

            {/* Résultats */}
            <div className="space-y-6">
              {resultats ? (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-red-600" />
                      Résultats du calcul
                    </CardTitle>
                    <CardDescription>
                      Détail de votre réméré inversé
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">Montant emprunté</span>
                        <span className="font-bold text-lg text-orange-600">
                          {resultats.montantEmprunte.toLocaleString('fr-FR')} €
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">Mensualité</span>
                        <span className="font-bold text-lg text-red-600">
                          {resultats.mensualite.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €
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
                      Renseignez les informations ci-contre pour voir les résultats de votre réméré inversé
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Informations sur le réméré inversé */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Qu'est-ce que le réméré inversé ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <p>
                    Le réméré inversé est une opération où l'acheteur paie un prix supérieur au prix de vente 
                    initial, avec la possibilité pour le vendeur de racheter le bien à un prix plus élevé.
                  </p>
                  <p>
                    Cette formule peut être utilisée pour des opérations de refinancement ou des stratégies 
                    d'investissement particulières.
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
    </div>
  );
};

export default SimulateurRemereInverse;
