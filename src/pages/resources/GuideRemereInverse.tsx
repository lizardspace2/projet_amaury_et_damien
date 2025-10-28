import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, CheckCircle, AlertTriangle, Info, Calculator, Euro, Calendar, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GuideRemereInverse = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-orange-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent">
                Guide du Réméré Inversé
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur le réméré inversé : fonctionnement, avantages et conseils pratiques
            </p>
          </div>

          <div className="space-y-8">
            {/* Qu'est-ce que le réméré inversé */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-orange-600" />
                  Qu'est-ce que le réméré inversé ?
                </CardTitle>
                <CardDescription>
                  Définition et principe de fonctionnement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Le réméré inversé est une opération immobilière où l'acheteur paie un prix supérieur au prix 
                  de vente initial, avec la possibilité pour le vendeur de racheter le bien à un prix plus élevé.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Cette formule peut être utilisée pour des opérations de refinancement ou des stratégies 
                  d'investissement particulières, offrant une flexibilité dans les conditions de vente.
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Principe clé</h4>
                  <p className="text-orange-700 text-sm">
                    Le vendeur reçoit un prix supérieur à la valeur initiale, mais peut racheter le bien 
                    en remboursant le prix de vente majoré des intérêts et frais.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comment ça marche */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                  Comment fonctionne le réméré inversé ?
                </CardTitle>
                <CardDescription>
                  Étapes et mécanisme de l'opération
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Acteurs impliqués</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-orange-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Le vendeur</p>
                          <p className="text-sm text-slate-600">Propriétaire qui vend avec clause de rachat inversée</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-orange-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">L'acheteur</p>
                          <p className="text-sm text-slate-600">Personne qui achète le bien</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-orange-600">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Le notaire</p>
                          <p className="text-sm text-slate-600">Officier public qui rédige l'acte</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Étapes de l'opération</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Signature de l'acte</p>
                          <p className="text-sm text-slate-600">Vente avec clause de rachat inversée</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Paiement du prix</p>
                          <p className="text-sm text-slate-600">L'acheteur verse le prix majoré</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Période de rachat</p>
                          <p className="text-sm text-slate-600">Le vendeur peut racheter le bien</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avantages et inconvénients */}
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
                      <p className="font-medium text-slate-700">Prix majoré</p>
                      <p className="text-sm text-slate-600">Obtenir plus que la valeur initiale</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Possibilité de rachat</p>
                      <p className="text-sm text-slate-600">Conserver l'espoir de récupérer le bien</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Stratégie d'investissement</p>
                      <p className="text-sm text-slate-600">Pour des opérations complexes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Flexibilité</p>
                      <p className="text-sm text-slate-600">Conditions négociables</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Inconvénients
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Coût élevé</p>
                      <p className="text-sm text-slate-600">Intérêts et frais importants</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Risque de perte</p>
                      <p className="text-sm text-slate-600">Si pas de rachat dans les délais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Complexité juridique</p>
                      <p className="text-sm text-slate-600">Acte notarié très complexe</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Spécialisation requise</p>
                      <p className="text-sm text-slate-600">Notaire spécialisé nécessaire</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conseils pratiques */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                  Conseils pratiques
                </CardTitle>
                <CardDescription>
                  Points importants à considérer avant de s'engager
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Avant l'opération</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Évaluer précisément la valeur du bien</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Négocier des conditions favorables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Vérifier la solvabilité de l'acheteur</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Consulter un notaire spécialisé</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Pendant l'opération</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Respecter les échéances de paiement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Maintenir le bien en bon état</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Surveiller l'évolution du marché</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>Préparer le financement du rachat</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation */}
            <Card className="shadow-lg bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-orange-600" />
                  Testez votre réméré inversé
                </CardTitle>
                <CardDescription>
                  Utilisez notre simulateur pour calculer les conditions de votre réméré inversé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 mb-2">
                      Calculez instantanément les mensualités, le coût total et les économies potentielles 
                      de votre réméré inversé.
                    </p>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Simulation gratuite et sans engagement
                    </Badge>
                  </div>
                  <a 
                    href="/resources/simulateur-remere-inverse"
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Accéder au simulateur
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Avertissement */}
            <Card className="shadow-lg border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Avertissement important</h4>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      Le réméré inversé est une opération très complexe qui nécessite une réflexion approfondie. 
                      Les informations contenues dans ce guide sont à titre informatif uniquement. 
                      Il est fortement recommandé de consulter un notaire spécialisé et de faire appel 
                      à un conseiller juridique avant de s'engager dans ce type d'opération.
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

export default GuideRemereInverse;
