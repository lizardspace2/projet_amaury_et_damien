import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, CheckCircle, AlertTriangle, Info, Calculator, Euro, Calendar, Clock } from 'lucide-react';

const GuideVenteTerme = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">
                Guide de la Vente à Terme
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur la vente à terme : fonctionnement, avantages et conseils pratiques
            </p>
          </div>

          <div className="space-y-8">
            {/* Qu'est-ce que la vente à terme */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-purple-600" />
                  Qu'est-ce que la vente à terme ?
                </CardTitle>
                <CardDescription>
                  Définition et principe de fonctionnement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  La vente à terme est une opération immobilière qui permet d'acheter un bien immobilier 
                  avec un paiement différé, souvent à un prix préférentiel par rapport au marché actuel.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Cette formule offre une flexibilité de paiement et peut permettre d'économiser sur le prix 
                  d'achat en échange d'un engagement à long terme avec le vendeur.
                </p>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Principe clé</h4>
                  <p className="text-purple-700 text-sm">
                    L'acheteur s'engage à acheter le bien à un prix fixé à l'avance, 
                    avec un paiement différé selon un échéancier convenu.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comment ça marche */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Comment fonctionne la vente à terme ?
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
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-purple-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Le vendeur</p>
                          <p className="text-sm text-slate-600">Propriétaire qui vend avec paiement différé</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-purple-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">L'acheteur</p>
                          <p className="text-sm text-slate-600">Personne qui achète avec paiement différé</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-purple-600">3</span>
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
                        <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-violet-600">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Signature du contrat</p>
                          <p className="text-sm text-slate-600">Vente avec paiement différé</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-violet-600">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Paiement échelonné</p>
                          <p className="text-sm text-slate-600">Selon l'échéancier convenu</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-violet-600">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Transfert de propriété</p>
                          <p className="text-sm text-slate-600">À la fin du paiement</p>
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
                      <p className="font-medium text-slate-700">Flexibilité de paiement</p>
                      <p className="text-sm text-slate-600">Échéancier adapté aux capacités</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Pas de crédit bancaire</p>
                      <p className="text-sm text-slate-600">Éviter les démarches bancaires</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Sécurité juridique</p>
                      <p className="text-sm text-slate-600">Contrat notarié protecteur</p>
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
                      <p className="font-medium text-slate-700">Engagement long terme</p>
                      <p className="text-sm text-slate-600">Contrat difficile à résilier</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Risque de défaillance</p>
                      <p className="text-sm text-slate-600">Si l'acheteur ne peut plus payer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Évolution du marché</p>
                      <p className="text-sm text-slate-600">Prix peut évoluer défavorablement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">Complexité juridique</p>
                      <p className="text-sm text-slate-600">Acte notarié complexe</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conseils pratiques */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
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
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Évaluer précisément la valeur du bien</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Négocier des conditions favorables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Vérifier la solvabilité des parties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Consulter un notaire spécialisé</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Pendant l'opération</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-violet-500 mt-1">•</span>
                        <span>Respecter les échéances de paiement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-violet-500 mt-1">•</span>
                        <span>Maintenir le bien en bon état</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-violet-500 mt-1">•</span>
                        <span>Surveiller l'évolution du marché</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-violet-500 mt-1">•</span>
                        <span>Préparer le transfert de propriété</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation */}
            <Card className="shadow-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Testez votre vente à terme
                </CardTitle>
                <CardDescription>
                  Utilisez notre simulateur pour calculer les conditions de votre vente à terme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 mb-2">
                      Calculez instantanément les mensualités, le coût total et les économies potentielles 
                      de votre vente à terme.
                    </p>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Simulation gratuite et sans engagement
                    </Badge>
                  </div>
                  <a 
                    href="/resources/simulateur-vente-terme"
                    className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
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
                      La vente à terme est une opération complexe qui nécessite une réflexion approfondie. 
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

export default GuideVenteTerme;
