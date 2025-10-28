import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, CheckCircle, AlertTriangle, Info, Calculator, Euro, Calendar, Building } from 'lucide-react';

const GuideVEFA = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Guide du VEFA
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur la Vente en l'État Futur d'Achèvement : fonctionnement, avantages et conseils pratiques
            </p>
          </div>

          <div className="space-y-8">
            {/* Qu'est-ce que le VEFA */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Qu'est-ce que le VEFA ?
                </CardTitle>
                <CardDescription>
                  Définition et principe de fonctionnement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Le VEFA (Vente en l'État Futur d'Achèvement) est une opération immobilière qui permet 
                  d'acheter un bien immobilier avant sa construction complète, souvent à un prix avantageux 
                  par rapport au marché.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Cette formule est particulièrement utilisée pour les programmes neufs et offre plusieurs 
                  avantages fiscaux et financiers aux acquéreurs.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Principe clé</h4>
                  <p className="text-blue-700 text-sm">
                    L'acheteur devient propriétaire du bien dès la signature de l'acte, mais le bien 
                    n'est livré qu'à la fin des travaux de construction.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comment ça marche */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Comment fonctionne le VEFA ?
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
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Le promoteur</p>
                          <p className="text-sm text-slate-600">Entreprise qui construit le bien</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">L'acquéreur</p>
                          <p className="text-sm text-slate-600">Personne qui achète le bien</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">3</span>
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
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-indigo-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Signature du contrat</p>
                          <p className="text-sm text-slate-600">Vente en l'état futur d'achèvement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-indigo-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Paiement échelonné</p>
                          <p className="text-sm text-slate-600">Selon l'avancement des travaux</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-indigo-600">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Livraison du bien</p>
                          <p className="text-sm text-slate-600">Réception des travaux terminés</p>
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
                      <p className="font-medium text-slate-700">Prix préférentiel</p>
                      <p className="text-sm text-slate-600">Économie par rapport au marché</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">TVA réduite</p>
                      <p className="text-sm text-slate-600">Taux préférentiel de 5,5%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Personnalisation</p>
                      <p className="text-sm text-slate-600">Choix des finitions et aménagements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Garanties constructeur</p>
                      <p className="text-sm text-slate-600">Protection contre les défauts</p>
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
                      <p className="font-medium text-slate-700">Délais de livraison</p>
                      <p className="text-sm text-slate-600">Risque de retard dans les travaux</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Risque promoteur</p>
                      <p className="text-sm text-slate-600">Faillite possible du constructeur</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Évolution du marché</p>
                      <p className="text-sm text-slate-600">Prix peut baisser pendant la construction</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Frais supplémentaires</p>
                      <p className="text-sm text-slate-600">Options et personnalisations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conseils pratiques */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Conseils pratiques
                </CardTitle>
                <CardDescription>
                  Points importants à considérer avant de s'engager
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Avant l'achat</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Vérifier la réputation du promoteur</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Examiner les garanties proposées</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Négocier les conditions de livraison</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>Prévoir une marge pour les imprévus</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Pendant la construction</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Suivre l'avancement des travaux</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Respecter les échéances de paiement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Vérifier la conformité des travaux</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Préparer la réception du bien</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Testez votre VEFA
                </CardTitle>
                <CardDescription>
                  Utilisez notre simulateur pour calculer les conditions de votre VEFA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 mb-2">
                      Calculez instantanément les mensualités, le coût total et les économies potentielles 
                      de votre projet VEFA.
                    </p>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Simulation gratuite et sans engagement
                    </Badge>
                  </div>
                  <a 
                    href="/resources/simulateur-vefa"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
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
                      Le VEFA est une opération complexe qui nécessite une réflexion approfondie. 
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
    </div>
  );
};

export default GuideVEFA;
