import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Info, Calculator, Euro, Calendar, Users, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GuideBRS = () => {
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
                  Guide du BRS (Bail Réel Solidaire)
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur le Bail Réel Solidaire : fonctionnement, avantages, inconvénients et conseils pratiques
              </p>
            </div>

            <div className="space-y-8">
              {/* Qu'est-ce que le BRS */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-600" />
                    Qu'est-ce que le Bail Réel Solidaire ?
                  </CardTitle>
                  <CardDescription>Définition et principe de fonctionnement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    Le Bail Réel Solidaire (BRS) est un dispositif d'accession à la propriété qui permet d'acheter 
                    un logement en occupant le bien tout en en devenant progressivement propriétaire. C'est une forme 
                    de crédit-vendeur où vous louez le bien tout en accumulant une part de propriété au fil des paiements.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Ce système permet de différer l'achat complet du bien tout en en jouissant immédiatement. 
                    Une partie des loyers est imputée sur le prix d'achat, et à la fin du bail, vous pouvez 
                    lever l'option d'achat en payant le solde.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Principe clé</h4>
                    <p className="text-teal-700 text-sm">
                      Le BRS combine location et achat : vous occupez le bien en tant que locataire pendant une durée 
                      déterminée, et une partie de vos loyers est décomptée du prix d'achat. À la fin du bail, vous 
                      pouvez devenir propriétaire en versant le prix de levée.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Comment ça marche */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-teal-600" />
                    Comment fonctionne le BRS ?
                  </CardTitle>
                  <CardDescription>Étapes et mécanisme de l'opération</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Les différents éléments</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Le bail commercial</p>
                            <p className="text-sm text-slate-600">Contrat de location de 9 à 15 ans</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Le loyer</p>
                            <p className="text-sm text-slate-600">Partiellement déduit du prix d'achat</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Le prix de levée</p>
                            <p className="text-sm text-slate-600">Montant à payer pour devenir propriétaire</p>
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
                            <p className="font-medium text-slate-700">Signature du bail</p>
                            <p className="text-sm text-slate-600">Signatures du bail réel solidaire chez le notaire</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Occupation et paiement</p>
                            <p className="text-sm text-slate-600">Vous occupez le bien et payez le loyer</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Décompte des loyers</p>
                            <p className="text-sm text-slate-600">Part des loyers déduite du prix d'achat</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">4</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Levée d'option</p>
                            <p className="text-sm text-slate-600">Paiement du prix de levée pour devenir propriétaire</p>
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
                      Avantages du BRS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Pas de crédit bancaire</p>
                        <p className="text-sm text-slate-600">Évite les démarches bancaires et les refus de prêt</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Occupation immédiate</p>
                        <p className="text-sm text-slate-600">Vous habitez le bien dès le début</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Décompte des loyers</p>
                        <p className="text-sm text-slate-600">Part des loyers déduite du prix d'achat</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Flexibilité financière</p>
                        <p className="text-sm text-slate-600">Budget adapté à vos moyens</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Option d'achat</p>
                        <p className="text-sm text-slate-600">Vous choisissez de lever l'option à la fin du bail</p>
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
                        <p className="font-medium text-slate-700">Pas de propriété immédiate</p>
                        <p className="text-sm text-slate-600">Vous êtes locataire pendant toute la durée du bail</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Coût total élevé</p>
                        <p className="text-sm text-slate-600">Cumul des loyers + prix de levée</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Pas de propriété garantie</p>
                        <p className="text-sm text-slate-600">Dépend de votre capacité à payer le prix de levée</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Obligations de bail</p>
                        <p className="text-sm text-slate-600">Respecter les obligations de locataire pendant le bail</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Risque de ne pas lever l'option</p>
                        <p className="text-sm text-slate-600">Perte des loyers décomptés si non-levée</p>
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
                  <CardDescription>Points importants à considérer avant de s'engager dans un BRS</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Avant la signature</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Vérifier la solvabilité du bailleur</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Lire attentivement le contrat de bail</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Calculer le coût total de l'opération</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>S'assurer de pouvoir payer le prix de levée</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Négocier les conditions du BRS</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Pendant le bail</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Respecter les obligations locatives</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Tenir compte du décompte des loyers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Préparer le financement de la levée</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Surveiller l'évolution du marché immobilier</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Anticiper votre capacité financière</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calcul du prix de levée */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-teal-600" />
                    Comprendre le calcul du prix de levée
                  </CardTitle>
                  <CardDescription>Comment fonctionne le décompte des loyers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    Le prix de levée est calculé en déduisant des loyers une partie (le plus souvent 50 à 70%) 
                    du prix d'achat convenu. Cette partie décomptée réduit proportionnellement le prix de levée 
                    que vous devrez payer pour devenir propriétaire.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700">Exemple de calcul</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Bien : 200 000 €</li>
                        <li>• Loyer : 1 000 €/mois</li>
                        <li>• Durée : 9 ans</li>
                        <li>• Décompte : 50% des loyers</li>
                        <li>• Économie : 54 000 € sur 9 ans</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-700">Prix de levée final</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Prix initial : 200 000 €</li>
                        <li>• Loyers décomptés : 54 000 €</li>
                        <li>• Prix de levée : 146 000 €</li>
                        <li>• Économie réalisée : 54 000 €</li>
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
                    Testez votre BRS
                  </CardTitle>
                  <CardDescription>
                    Utilisez notre simulateur pour calculer le coût total de votre BRS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 mb-2">
                        Calculez instantanément les loyers, le décompte, le prix de levée et le coût total 
                        de votre investissement en BRS sur toute la durée du bail.
                      </p>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                        Simulation gratuite et sans engagement
                      </Badge>
                    </div>
                    <a 
                      href="/resources/simulateur-brs"
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
                        Le Bail Réel Solidaire est un dispositif complexe qui nécessite une réflexion approfondie 
                        sur votre capacité financière future. Les informations contenues dans ce guide sont à titre 
                        informatif uniquement et ne constituent pas des conseils juridiques ou financiers. Il est 
                        fortement recommandé de consulter un notaire spécialisé, de faire appel à un conseiller 
                        juridique et financier, et de vérifier votre capacité à financer le prix de levée avant 
                        de s'engager dans ce type d'opération.
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

export default GuideBRS;

