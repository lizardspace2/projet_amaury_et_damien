import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info, Calculator, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GuideBiensException = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-teal-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl">
                  <Info className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Guide des Biens d'Exception
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Investir dans l'immobilier de luxe et de prestige
              </p>
            </div>

            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-600" />
                    Qu'est-ce qu'un bien d'exception ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    Les biens d'exception sont des propriétés immobilières haut de gamme, caractérisées par leur prestige, 
                    leur rareté et leur valeur marchande élevée. Ils se distinguent par une localisation privilégiée, 
                    une architecture remarquable, des équipements haut de gamme et une finition exceptionnelle.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Ces biens peuvent être des manoirs, châteaux, villas de prestige, penthouses en bord de mer, 
                    ou appartements dans des immeubles historiques. L'investissement dans ce type de bien nécessite 
                    un budget important et une vision patrimoniale à long terme.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Caractéristiques clés</h4>
                    <p className="text-teal-700 text-sm">
                      Prestige, rareté, localisation exceptionnelle, équipements de luxe, qualité de construction 
                      supérieure. Ces biens sont des placements patrimoniaux à forte valeur ajoutée.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Avantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Plus-value importante</p>
                        <p className="text-sm text-slate-600">Bon potentiel de revente à terme</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Prestige et image</p>
                        <p className="text-sm text-slate-600">Statut social et reconnaissance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Rareté</p>
                        <p className="text-sm text-slate-600">Place limitée sur le marché, faible concurrence</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Conservation de valeur</p>
                        <p className="text-sm text-slate-600">Plus résistants aux crises économiques</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Location haut de gamme</p>
                        <p className="text-sm text-slate-600">Potentiel locatif important</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Investissement élevé</p>
                        <p className="text-sm text-slate-600">Budget initial très important (1M€+)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Entretien coûteux</p>
                        <p className="text-sm text-slate-600">Coûts d'entretien et de rénovation importants annuellement</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Liquidité réduite</p>
                        <p className="text-sm text-slate-600">Revente plus longue et complexe</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Charges élevées</p>
                        <p className="text-sm text-slate-600">Taxes foncières, assurance, piscine, jardin...</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Marché étroit</p>
                        <p className="text-sm text-slate-600">Peu d'acheteurs solvables pour ce type de bien</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-600" />
                    Conseils pratiques
                  </CardTitle>
                  <CardDescription>Points importants pour investir dans un bien d'exception</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Avant l'achat</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Évaluer votre budget global (achat + travaux + entretien)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Choisir une localisation privilégiée et stable</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Expertiser le bien avec un expert immobilier</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Évaluer les charges annuelles d'entretien</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Vérifier la fiscalité (ISF, taxes foncières)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Après l'achat</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Maintenir le bien en excellent état</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Anticiper les travaux de rénovation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Surveiller l'évolution du marché</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Envisager une location haut de gamme</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-teal-600" />
                    Testez votre investissement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 mb-2">
                        Calculez le coût total de votre investissement en bien d'exception.
                      </p>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                        Simulation gratuite
                      </Badge>
                    </div>
                    <a 
                      href="/resources/simulateur-biens-exception"
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Accéder au simulateur
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuideBiensException;

