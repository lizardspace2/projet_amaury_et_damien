import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Info, Calculator, Euro, Calendar, Users, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GuideCreditVendeur = () => {
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
                  Guide du Crédit-Vendeur
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur le crédit-vendeur : fonctionnement, avantages, inconvénients et conseils pratiques
              </p>
            </div>

            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-600" />
                    Qu'est-ce que le crédit-vendeur ?
                  </CardTitle>
                  <CardDescription>Définition et principe de fonctionnement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    Le crédit-vendeur est un dispositif de financement où le vendeur immobilier accorde un crédit 
                    directement à l'acheteur. Contrairement au crédit bancaire traditionnel, c'est le propriétaire 
                    qui finance l'acquisition de son bien.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Ce système permet d'éviter les démarches bancaires, les délais de réponse et les refus de prêt. 
                    L'acheteur rembourse directement le vendeur selon des échéances convenues, avec ou sans intérêts, 
                    généralement sur une durée de 5 à 15 ans.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Principe clé</h4>
                    <p className="text-teal-700 text-sm">
                      Le crédit-vendeur permet de financer l'achat d'un bien immobilier directement par le vendeur, 
                      évitant ainsi les contraintes bancaires. L'acheteur verse un apport, puis rembourse le vendeur 
                      selon les termes convenus dans l'acte notarié.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-teal-600" />
                    Comment fonctionne le crédit-vendeur ?
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
                            <p className="font-medium text-slate-700">L'apport</p>
                            <p className="text-sm text-slate-600">Première partie du paiement à la signature</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Le taux d'intérêt</p>
                            <p className="text-sm text-slate-600">Peut être négocié entre les parties</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-teal-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">La durée</p>
                            <p className="text-sm text-slate-600">Généralement 5 à 15 ans</p>
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
                            <p className="font-medium text-slate-700">Négociation</p>
                            <p className="text-sm text-slate-600">Conditions du crédit-vendeur</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Signature chez le notaire</p>
                            <p className="text-sm text-slate-600">Acte de vente avec crédit-vendeur</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Versement de l'apport</p>
                            <p className="text-sm text-slate-600">Paiement initial à la signature</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-emerald-600">4</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">Remboursements</p>
                            <p className="text-sm text-slate-600">Mensualités selon échéancier convenu</p>
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
                      Avantages du crédit-vendeur
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Pas de banque</p>
                        <p className="text-sm text-slate-600">Évite les refus et délais bancaires</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Flexibilité</p>
                        <p className="text-sm text-slate-600">Conditions négociables entre parties</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Rapidité</p>
                        <p className="text-sm text-slate-600">Vente plus rapide sans banque</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Taux négociable</p>
                        <p className="text-sm text-slate-600">Possibilité d'un taux avantageux</p>
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
                        <p className="font-medium text-slate-700">Risque pour le vendeur</p>
                        <p className="text-sm text-slate-600">Impayés possibles de l'acheteur</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Garanties limitées</p>
                        <p className="text-sm text-slate-600">Pas de garantie bancaire</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Ressources bloquées</p>
                        <p className="text-sm text-slate-600">Le vendeur attend les remboursements</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Durée limitée</p>
                        <p className="text-sm text-slate-600">Généralement inférieure au crédit bancaire</p>
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
                      <h4 className="font-semibold text-slate-700">Pour l'acheteur</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Préparer un apport de départ</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Négocier les conditions avant l'achat</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Vérifier sa capacité de remboursement</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Lire attentivement le contrat notarié</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Pour le vendeur</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Vérifier la solvabilité de l'acheteur</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Demander des garanties (caution, garantie bancaire)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Définir un taux d'intérêt attractif mais réaliste</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Prévoir une clause de remboursement anticipé</span>
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
                    Testez votre crédit-vendeur
                  </CardTitle>
                  <CardDescription>Utilisez notre simulateur pour calculer vos mensualités</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 mb-2">
                        Calculez instantanément les mensualités, le coût total et le remboursement de votre crédit-vendeur 
                        en fonction du taux et de la durée.
                      </p>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                        Simulation gratuite et sans engagement
                      </Badge>
                    </div>
                    <a 
                      href="/resources/simulateur-credit-vendeur"
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
                        Le crédit-vendeur est un dispositif qui nécessite une réflexion approfondie et des garanties 
                        mutuelles. Les informations contenues dans ce guide sont à titre informatif uniquement et ne 
                        constituent pas des conseils juridiques ou financiers. Il est fortement recommandé de consulter 
                        un notaire spécialisé et de faire appel à un conseiller juridique avant de s'engager dans ce 
                        type d'opération.
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

export default GuideCreditVendeur;
