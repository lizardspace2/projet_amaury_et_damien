import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Info, Calculator, Euro, Calendar, Users, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GuideCopropriete = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-teal-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Guide de la Copropriété / Lot de Volume
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur l'investissement en copropriété et lot de volume : fonctionnement, avantages, inconvénients et conseils pratiques
              </p>
            </div>

            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-600" />
                    Qu'est-ce que la copropriété et le lot de volume ?
                  </CardTitle>
                  <CardDescription>Définition et principe de fonctionnement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    La copropriété est un immeuble divisé en lots, chacun correspondant à un appartement ou local. 
                    Chaque copropriétaire possède une ou plusieurs parts de la copropriété et est propriétaire 
                    exclusif de son lot.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Le lot de volume est une forme particulière de copropriété où la propriété est définie par un 
                    volume tridimensionnel plutôt que par des surfaces au sol. Cette formule permet de diviser un 
                    bâtiment en lots indépendants sans cloisonnement fixe.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Principe clé</h4>
                    <p className="text-teal-700 text-sm">
                      La copropriété permet de partager la propriété d'un immeuble entre plusieurs personnes. Chaque 
                      copropriétaire est propriétaire exclusif de son lot et copropriétaire des parties communes 
                      selon sa quote-part.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-teal-600" />
                    Comment fonctionne la copropriété ?
                  </CardTitle>
                  <CardDescription>Étapes et mécanisme de l'opération</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Les éléments de la copropriété</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Le lot</p>
                            <p className="text-sm text-slate-600">Partie privative du copropriétaire</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">La quote-part</p>
                            <p className="text-sm text-slate-600">Pourcentage de propriété des parties communes</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Les charges</p>
                            <p className="text-sm text-slate-600">Frais de copropriété à payer mensuellement</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Étapes de l'acquisition</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Signature du compromis</p>
                            <p className="text-sm text-slate-600">Engagement d'achat</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Dépôt de garantie</p>
                            <p className="text-sm text-slate-600">Séquestre notarial ou bancaire</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Signature chez le notaire</p>
                            <p className="text-sm text-slate-600">Acte authentique de vente</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">4</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Paiement et obtention des clés</p>
                            <p className="text-sm text-slate-600">Livraison du bien</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Avantages de la copropriété
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Propriété certaine</p>
                        <p className="text-sm text-slate-600">Vous êtes propriétaire de votre lot</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Revente libre</p>
                        <p className="text-sm text-slate-600">Vous pouvez revendre à tout moment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Entretien mutualisé</p>
                        <p className="text-sm text-slate-600">Les parties communes sont entretenues collectivement</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Sécurité</p>
                        <p className="text-sm text-slate-600">Gardien, surveillance commune</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      Inconvénients et charges
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Charges mensuelles</p>
                        <p className="text-sm text-slate-600">Coût récurrent obligatoire</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Dépendance</p>
                        <p className="text-sm text-slate-600">Décisions collectives obligatoires</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Travaux imprévus</p>
                        <p className="text-sm text-slate-600">Appels de fonds pour gros travaux</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Conflits</p>
                        <p className="text-sm text-slate-600">Risque de mésentente entre copropriétaires</p>
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
                  <CardDescription>Points importants à considérer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Avant l'achat</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Consulter le règlement de copropriété</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Demander les comptes de la copropriété (3 ans)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Vérifier l'état du bâtiment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Estimer les charges annuelles</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Après l'achat</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Participer aux assemblées générales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Payer régulièrement les charges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Respecter le règlement de copropriété</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Surveiller les décisions importantes</span>
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
                    Testez votre copropriété
                  </CardTitle>
                  <CardDescription>Utilisez notre simulateur pour calculer le coût d'acquisition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 mb-2">
                        Calculez le coût total d'acquisition de votre lot en copropriété incluant le prix du lot, 
                        les frais de notaire et les charges annuelles.
                      </p>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                        Simulation gratuite et sans engagement
                      </Badge>
                    </div>
                    <a 
                      href="/resources/simulateur-copropriete"
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Accéder au simulateur
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-2">Avertissement important</h4>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        L'achat en copropriété nécessite une vigilance particulière sur les charges, l'état du bâtiment 
                        et le règlement de copropriété. Les informations contenues dans ce guide sont à titre informatif 
                        uniquement et ne constituent pas des conseils juridiques. Il est fortement recommandé de consulter 
                        un notaire spécialisé et de faire appel à un expert en copropriété avant de s'engager.
                      </p>
                    </div>
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

export default GuideCopropriete;
