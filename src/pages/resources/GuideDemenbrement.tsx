import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Info, Calculator, Euro, Calendar, Users, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GuideDemenbrement = () => {
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
                  Guide du Démembrement
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur le démembrement de propriété : fonctionnement, avantages, inconvénients et conseils pratiques
              </p>
            </div>

            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-600" />
                    Qu'est-ce que le démembrement de propriété ?
                  </CardTitle>
                  <CardDescription>Définition et principe de fonctionnement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    Le démembrement de propriété est une opération juridique qui sépare la pleine propriété d'un bien 
                    en deux éléments distincts : l'usufruit (droit d'utiliser le bien et d'en percevoir les revenus) 
                    et la nue-propriété (droit de disposer du bien).
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Cette technique permet de transmettre progressivement un patrimoine tout en préservant ses revenus. 
                    Le nu-propriétaire devient propriétaire en pleine propriété au terme de l'usufruit, généralement 
                    au décès de l'usufruitier.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Principe clé</h4>
                    <p className="text-teal-700 text-sm">
                      Le démembrement sépare l'usage (usufruit) et la propriété (nue-propriété) d'un bien immobilier. 
                      L'usufruitier peut habiter le bien ou le louer, tandis que le nu-propriétaire acquiert progressivement 
                      la propriété complète.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-teal-600" />
                    Comment fonctionne le démembrement ?
                  </CardTitle>
                  <CardDescription>Étapes et mécanisme de l'opération</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Les éléments du démembrement</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">L'usufruit</p>
                            <p className="text-sm text-slate-600">Droit d'utiliser et de jouir du bien</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">La nue-propriété</p>
                            <p className="text-sm text-slate-600">Droit de disposer du bien</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">La pleine propriété</p>
                            <p className="text-sm text-slate-600">Réunion de l'usufruit et de la nue-propriété</p>
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
                            <p className="text-sm text-slate-600">Définition de la valeur en pleine propriété</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Calcul du barème fiscal</p>
                            <p className="text-sm text-slate-600">Répartition selon l'âge de l'usufruitier</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Signature de l'acte</p>
                            <p className="text-sm text-slate-600">Acte notarié de démembrement</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">4</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Fiscalité</p>
                            <p className="text-sm text-slate-600">Droits réduits en cas de donation</p>
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
                      Avantages du démembrement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Optimisation fiscale</p>
                        <p className="text-sm text-slate-600">Réduction des droits de mutation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Transmission progressive</p>
                        <p className="text-sm text-slate-600">Partage du patrimoine en douceur</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Prix attractif</p>
                        <p className="text-sm text-slate-600">Nue-propriété moins chère que la pleine propriété</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Revenus conservés</p>
                        <p className="text-sm text-slate-600">L'usufruitier garde les loyers ou l'usage</p>
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
                        <p className="font-medium text-slate-700">Pas de jouissance immédiate</p>
                        <p className="text-sm text-slate-600">Le nu-propriétaire n'a pas l'usage du bien</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Durée limitée</p>
                        <p className="text-sm text-slate-600">Usufruit à vie ou temporaire</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Valeur incertaine</p>
                        <p className="text-sm text-slate-600">Dépend de l'âge de l'usufruitier</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Complexité</p>
                        <p className="text-sm text-slate-600">Gestion plus complexe de la propriété</p>
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
                  <CardDescription>Points importants à considérer avant de s'engager</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Pour le nu-propriétaire</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Évaluer le bien en pleine propriété</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Calculer la valeur de la nue-propriété</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Vérifier l'âge de l'usufruitier</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Comprendre les obligations</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Pour l'usufruitier</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Conserver le bien en bon état</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Réaliser les grosses réparations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Surveiller les obligations fiscales</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Respecter les droits du nu-propriétaire</span>
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
                    Testez votre démembrement
                  </CardTitle>
                  <CardDescription>Utilisez notre simulateur pour calculer la valeur du démembrement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 mb-2">
                        Calculez instantanément la valeur de l'usufruit et de la nue-propriété selon le barème fiscal 
                        en fonction de l'âge de l'usufruitier.
                      </p>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                        Simulation gratuite et sans engagement
                      </Badge>
                    </div>
                    <a 
                      href="/resources/simulateur-demenbrement"
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
                        Le démembrement de propriété est une opération complexe qui nécessite une réflexion approfondie 
                        et une expertise professionnelle. Les informations contenues dans ce guide sont à titre informatif 
                        uniquement et ne constituent pas des conseils juridiques ou fiscaux. Il est fortement recommandé 
                        de consulter un notaire spécialisé et de faire appel à un conseiller fiscal avant de s'engager 
                        dans ce type d'opération.
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

export default GuideDemenbrement;
