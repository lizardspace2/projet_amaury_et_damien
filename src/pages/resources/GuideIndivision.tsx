import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Info, Calculator, Euro, Calendar, Users, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GuideIndivision = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-teal-50">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Guide de l'Indivision / Nue-propriété
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur l'investissement en parts et nue-propriété : fonctionnement, avantages, inconvénients et conseils pratiques
              </p>
            </div>

            <div className="space-y-8">
              {/* Qu'est-ce que l'indivision */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-600" />
                    Qu'est-ce que l'indivision et la nue-propriété ?
                  </CardTitle>
                  <CardDescription>Définition et principe de fonctionnement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    L'indivision est une situation juridique où plusieurs personnes détiennent ensemble un bien immobilier 
                    sans avoir de parts individuelles physiquement définies. Chaque co-indivisaire possède une quote-part 
                    du bien en pleine propriété.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    La nue-propriété, quant à elle, est l'achat de la propriété d'un bien sans en avoir l'usage. 
                    L'usufruitier (qui détient l'usufruit) peut utiliser le bien et en percevoir les revenus, tandis 
                    que le nu-propriétaire en devient propriétaire à terme, généralement au décès de l'usufruitier.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Principe clé</h4>
                    <p className="text-teal-700 text-sm">
                      Ces deux mécanismes permettent d'investir dans l'immobilier avec un budget limité en partageant 
                      la propriété d'un bien. L'indivision divise la propriété en parts, tandis que la nue-propriété 
                      sépare la propriété de l'usage du bien.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Comment ça marche */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-teal-600" />
                    Comment fonctionnent l'indivision et la nue-propriété ?
                  </CardTitle>
                  <CardDescription>Étapes et mécanisme des opérations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Les différents types d'opération</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Achat en indivision</p>
                            <p className="text-sm text-slate-600">Plusieurs personnes achètent ensemble un bien</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Achat de parts</p>
                            <p className="text-sm text-slate-600">Acheter une fraction d'un bien existant</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Démembrement</p>
                            <p className="text-sm text-slate-600">Séparation usufruit et nue-propriété</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Étapes de l'opération</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Évaluation du bien</p>
                            <p className="text-sm text-slate-600">Définition de la valeur totale</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Négociation des parts</p>
                            <p className="text-sm text-slate-600">Définition du pourcentage de propriété</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Convention d'indivision</p>
                            <p className="text-sm text-slate-600">Rédaction de l'acte chez le notaire</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">4</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Paiement et signature</p>
                            <p className="text-sm text-slate-600">Acquisition de la part</p>
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
                      Avantages de l'investissement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Investissement accessible</p>
                        <p className="text-sm text-slate-600">Accès à l'immobilier avec un budget limité</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Partage des coûts</p>
                        <p className="text-sm text-slate-600">Frais de notaire et charges partagés</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Plus-value</p>
                        <p className="text-sm text-slate-600">Potentiel de revente à plus forte valeur</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Diversification</p>
                        <p className="text-sm text-slate-600">Réduction des risques</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Prix réduit</p>
                        <p className="text-sm text-slate-600">Les parts sont souvent vendues sous la valeur</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      Inconvénients et risques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Indépendance limitée</p>
                        <p className="text-sm text-slate-600">Décisions requièrent l'accord de tous</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Partage des revenus</p>
                        <p className="text-sm text-slate-600">Revenus locatifs divisés par nombre de parts</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Responsabilités partagées</p>
                        <p className="text-sm text-slate-600">Obligations en cas d'impayés ou de litiges</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Difficulté de revente</p>
                        <p className="text-sm text-slate-600">Trouver un acheteur pour les parts peut être difficile</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Complexité juridique</p>
                        <p className="text-sm text-slate-600">Gestion des conflits entre co-indivisaires</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conseils pratiques */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-teal-600" />
                    Conseils pratiques
                  </CardTitle>
                  <CardDescription>Points importants à considérer avant d'investir en indivision</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Avant l'achat</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Évaluer précisément la valeur du bien et de votre part</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Connaître vos co-indivisaires et leurs projets</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Rédiger une convention d'indivision claire</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Définir les règles de gestion et de décision</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Prévoir une clause de sortie en cas de mésentente</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Pendant l'indivision</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Respecter les décisions collégiales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Participer aux frais de copropriété</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Surveiller l'état du bien</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Partager les revenus locatifs équitablement</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Préparer la sortie de l'indivision</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Convention d'indivision */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-teal-600" />
                    La convention d'indivision
                  </CardTitle>
                  <CardDescription>Document essentiel à rédiger</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    La convention d'indivision est un document essentiel qui définit les règles de gestion du bien 
                    entre les co-indivisaires. Elle doit être rédigée avec l'aide d'un notaire et comprendre :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700">Clauses obligatoires</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Répartition des parts</li>
                        <li>• Règles de décision (unanimité ou majorité)</li>
                        <li>• Gestion de la location</li>
                        <li>• Répartition des charges</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700">Clauses recommandées</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Conditions de sortie</li>
                        <li>• Valorisation en cas de vente</li>
                        <li>• Droit de préemption</li>
                        <li>• Gestion des conflits</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Simulation */}
              <Card className="shadow-lg bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-teal-600" />
                    Testez votre investissement en indivision
                  </CardTitle>
                  <CardDescription>
                    Utilisez notre simulateur pour calculer le coût d'acquisition de vos parts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 mb-2">
                        Calculez instantanément le coût d'acquisition de vos parts, les frais de notaire, 
                        et le pourcentage de propriété que vous obtiendrez en fonction de votre investissement.
                      </p>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                        Simulation gratuite et sans engagement
                      </Badge>
                    </div>
                    <a 
                      href="/resources/simulateur-indivision"
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
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
                        L'investissement en indivision nécessite une réflexion approfondie et une confiance mutuelle 
                        entre les co-indivisaires. Les informations contenues dans ce guide sont à titre informatif 
                        uniquement et ne constituent pas des conseils juridiques ou financiers. Il est fortement 
                        recommandé de consulter un notaire spécialisé, de faire appel à un conseiller juridique et 
                        de rédiger une convention d'indivision claire avant de s'engager dans ce type d'opération.
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

export default GuideIndivision;

