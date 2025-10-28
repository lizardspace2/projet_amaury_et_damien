import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info, Calculator, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const GuideBail = () => {
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
                  Guide du Bail Commercial
                </h1>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur la reprise d'un bail commercial
              </p>
            </div>

            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-600" />
                    Qu'est-ce qu'un bail commercial ?
                  </CardTitle>
                  <CardDescription>Définition et principe de fonctionnement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">
                    Le bail commercial est un contrat de location d'un local commercial ou professionnel d'une durée 
                    minimale de 9 ans, renouvelable par période de 3 ans. Ce type de bail s'applique aux locaux 
                    utilisés pour exercer une activité commerciale, industrielle ou artisanale.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Reprendre un bail commercial permet d'acquérir le droit d'utiliser un fonds de commerce existant 
                    tout en évitant l'achat du bien immobilier. C'est une solution pour les entrepreneurs qui souhaitent 
                    reprendre une activité commerciale existante avec une clientèle établie.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2">Principe clé</h4>
                    <p className="text-teal-700 text-sm">
                      Le bail commercial permet de reprendre un fonds de commerce existant en achetant le droit d'entrée 
                      et en payant un loyer. Le locataire devient locataire professionnel sans être propriétaire du bien.
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
                        <p className="font-medium text-slate-700">Investissement limité</p>
                        <p className="text-sm text-slate-600">Pas d'achat du bien immobilier, uniquement le droit au bail</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Loyer fixe</p>
                        <p className="text-sm text-slate-600">Pas d'augmentation sauf indexation sur l'indice INSEE</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Stabilité</p>
                        <p className="text-sm text-slate-600">Bail de 9 ans minimum et renouvelable</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Fonds de commerce inclus</p>
                        <p className="text-sm text-slate-600">Clientèle, équipements et stocks inclus</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Transfert rapide</p>
                        <p className="text-sm text-slate-600">Possibilité de reprendre rapidement une activité</p>
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
                        <p className="font-medium text-slate-700">Droit d'entrée élevé</p>
                        <p className="text-sm text-slate-600">Coût important à l'entrée (peut représenter des années de loyer)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Charges récurrentes</p>
                        <p className="text-sm text-slate-600">Loyer mensuel + charges à payer pendant 9 ans minimum</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Pas de propriété</p>
                        <p className="text-sm text-slate-600">Vous êtes locataire, le propriétaire peut récupérer le bien en fin de bail</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Obligations de remise en état</p>
                        <p className="text-sm text-slate-600">Devoir de remettre le local en bon état en fin de bail</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-700">Pas de revente du droit au bail</p>
                        <p className="text-sm text-slate-600">Difficulté de céder le bail à un tiers</p>
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
                  <CardDescription>Points importants à considérer avant de reprendre un bail</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Avant la reprise</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Évaluer la clientèle et le chiffre d'affaires</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Vérifier la concurrence du secteur</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Lire attentivement le bail et les obligations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Négocier les conditions du droit d'entrée</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-500 mt-1">•</span>
                          <span>Consulter un expert-comptable</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700">Pendant le bail</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Payer régulièrement le loyer et les charges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Respecter les obligations de remise en état</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Conserver la clientèle existante</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>Surveiller l'évolution du bail et des renouvellements</span>
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
                    Testez votre bail commercial
                  </CardTitle>
                  <CardDescription>Utilisez notre simulateur pour calculer les coûts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 mb-2">
                        Calculez instantanément le coût total de votre bail commercial.
                      </p>
                      <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                        Simulation gratuite et sans engagement
                      </Badge>
                    </div>
                    <a 
                      href="/resources/simulateur-bail"
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
                        Les informations contenues dans ce guide sont à titre informatif uniquement. 
                        Il est fortement recommandé de consulter un notaire spécialisé.
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

export default GuideBail;

