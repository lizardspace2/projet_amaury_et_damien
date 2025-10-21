import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  CreditCard,
  Gavel,
  Users,
  ArrowRight,
  Scale,
  Eye,
  Lock
} from 'lucide-react';

const AuctionRules = () => {
  const generalRules = [
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      title: "Participation",
      description: "Toute personne majeure peut participer aux enchères après inscription et vérification d'identité."
    },
    {
      icon: <Gavel className="h-5 w-5 text-orange-500" />,
      title: "Enchères",
      description: "Les enchères sont fermes et définitives. Aucune annulation n'est possible après l'adjudication."
    },
    {
      icon: <Clock className="h-5 w-5 text-green-500" />,
      title: "Horaires",
      description: "Les enchères se déroulent selon l'horaire annoncé. Les retards ne sont pas tolérés."
    },
    {
      icon: <CreditCard className="h-5 w-5 text-purple-500" />,
      title: "Paiement",
      description: "Le paiement doit être effectué dans les délais impartis selon les modalités définies."
    }
  ];

  const obligations = [
    {
      title: "Vérification d'identité",
      description: "Présentation d'une pièce d'identité valide et d'un justificatif de domicile de moins de 3 mois."
    },
    {
      title: "Capacité financière",
      description: "Justification de la capacité financière pour honorer l'achat en cas d'adjudication."
    },
    {
      title: "Acompte",
      description: "Versement d'un acompte de 10% du prix d'adjudication dans les 24h suivant l'enchère."
    },
    {
      title: "Solde",
      description: "Paiement du solde dans les 30 jours suivant l'adjudication, sous peine de déchéance."
    }
  ];

  const prohibitions = [
    "Enchérir sans avoir les moyens financiers",
    "Utiliser de faux noms ou identités",
    "Perturber le bon déroulement des enchères",
    "Enchérir pour le compte d'autrui sans mandat",
    "Retirer une enchère après l'avoir placée",
    "Utiliser des logiciels ou robots pour enchérir"
  ];

  const penalties = [
    {
      offense: "Non-paiement de l'acompte",
      penalty: "Déchéance de l'adjudication + frais de revente"
    },
    {
      offense: "Non-paiement du solde",
      penalty: "Déchéance + pénalités de retard + frais de recouvrement"
    },
    {
      offense: "Fausse identité",
      penalty: "Exclusion définitive + signalement aux autorités"
    },
    {
      offense: "Perturbation des enchères",
      penalty: "Exclusion temporaire ou définitive selon la gravité"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-estate-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Scale className="h-4 w-4 mr-2" />
            Règlement officiel
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Règles et conditions des enchères</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consultez le règlement complet des ventes aux enchères immobilières. 
            Ces règles s'appliquent à tous les participants et sont non négociables.
          </p>
        </div>

        {/* Règles générales */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <FileText className="h-8 w-8 text-teal-600" />
            Règles générales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generalRules.map((rule, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {rule.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{rule.title}</h3>
                    <p className="text-gray-600">{rule.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Obligations des acheteurs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            Obligations des acheteurs
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Conditions d'admission et de participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {obligations.map((obligation, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 mb-1">{obligation.title}</h3>
                      <p className="text-green-700">{obligation.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Interdictions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            Interdictions
          </h2>
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">Comportements interdits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prohibitions.map((prohibition, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="p-1 rounded-full bg-red-100 mt-0.5">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-red-800">{prohibition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sanctions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Shield className="h-8 w-8 text-orange-600" />
            Sanctions et pénalités
          </h2>
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Tableau des sanctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {penalties.map((penalty, index) => (
                  <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-800 mb-1">{penalty.offense}</h3>
                        <p className="text-orange-700">{penalty.penalty}</p>
                      </div>
                      <Badge variant="destructive" className="flex-shrink-0">
                        Sanction
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Modalités de paiement */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Modalités de paiement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Acompte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 10% du prix d'adjudication</li>
                  <li>• À verser dans les 24h</li>
                  <li>• Par virement ou chèque</li>
                  <li>• Non remboursable en cas de déchéance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  Solde
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 90% restant du prix</li>
                  <li>• À verser dans les 30 jours</li>
                  <li>• Frais de notaire en sus</li>
                  <li>• Possibilité de financement</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Confidentialité */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Lock className="h-8 w-8 text-purple-600" />
            Confidentialité et protection des données
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-gray-600">
                <p>
                  Nous nous engageons à protéger vos données personnelles conformément au RGPD. 
                  Vos informations ne seront utilisées que dans le cadre des enchères et ne seront 
                  jamais transmises à des tiers sans votre consentement.
                </p>
                <p>
                  Les enregistrements des enchères sont conservés à des fins de traçabilité et de 
                  sécurité, conformément aux obligations légales.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact et réclamations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Eye className="h-8 w-8 text-teal-600" />
            Contact et réclamations
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Service client</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>📧 Email: support@annoncesimmo.fr</p>
                    <p>📞 Téléphone: 04 72 00 00 00</p>
                    <p>🕒 Horaires: Lun-Ven 9h-18h</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Réclamations</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>📧 Email: reclamations@annoncesimmo.fr</p>
                    <p>📮 Adresse: 123 Rue de la République, 69002 Lyon</p>
                    <p>⏱️ Délai de réponse: 48h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to action */}
        <section className="text-center bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Questions sur les règles ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Notre équipe est là pour vous accompagner et répondre à toutes vos questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
              <Link to="/auctions" className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Voir les enchères
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auctions/guide" className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Guide d'utilisation
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AuctionRules;
