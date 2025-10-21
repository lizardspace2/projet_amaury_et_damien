import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  Users, 
  Gavel, 
  Shield, 
  CreditCard,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';

const AuctionGuide = () => {
  const steps = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "1. Inscrivez-vous",
      description: "Créez votre compte gratuitement pour participer aux enchères",
      details: "Remplissez vos informations personnelles et vérifiez votre identité"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "2. Explorez les biens",
      description: "Parcourez les propriétés disponibles aux enchères",
      details: "Consultez les photos, descriptions et visites virtuelles"
    },
    {
      icon: <Play className="h-6 w-6" />,
      title: "3. Rejoignez la salle",
      description: "Connectez-vous à la salle d'enchères digitale en temps réel",
      details: "Regardez le flux vidéo et suivez les enchères en direct"
    },
    {
      icon: <Gavel className="h-6 w-6" />,
      title: "4. Enchérissez",
      description: "Placez vos enchères selon vos moyens",
      details: "Utilisez les enchères rapides ou saisissez un montant personnalisé"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "5. Remportez",
      description: "Si vous êtes le plus offrant, le bien est à vous !",
      details: "Finalisez l'achat selon les conditions de l'enchère"
    }
  ];

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Enchères en temps réel",
      description: "Participez aux enchères en direct avec un flux vidéo HD"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Communauté active",
      description: "Rejoignez des milliers d'acheteurs et vendeurs"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "Sécurisé et transparent",
      description: "Toutes les transactions sont sécurisées et traçables"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "Enchères rapides",
      description: "Placez vos enchères en un clic avec nos boutons prédéfinis"
    }
  ];

  const tips = [
    {
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      title: "Fixez votre budget",
      description: "Déterminez votre prix maximum avant de commencer à enchérir"
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      title: "Arrivez à l'heure",
      description: "Connectez-vous quelques minutes avant le début de l'enchère"
    },
    {
      icon: <Target className="h-5 w-5 text-green-500" />,
      title: "Étudiez le bien",
      description: "Consultez tous les documents et visitez virtuellement si possible"
    },
    {
      icon: <Gavel className="h-5 w-5 text-red-500" />,
      title: "Restez concentré",
      description: "Ne vous laissez pas emporter par la compétition"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-estate-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Guide complet
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Comment participer aux enchères</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment utiliser notre plateforme d'enchères immobilières 
            et participez à vos premières ventes aux enchères en toute confiance.
          </p>
        </div>

        {/* Étapes du processus */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Le processus en 5 étapes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-600"></div>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-600 group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <p className="text-sm text-gray-500">{step.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fonctionnalités */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir nos enchères ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gray-50">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Conseils */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Conseils pour réussir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-teal-200 transition-colors">
                <div className="p-2 rounded-full bg-gray-50">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ rapide */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-teal-600" />
                  Comment payer ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vous pouvez payer par virement bancaire, chèque ou en espèces selon les conditions de l'enchère. 
                  Un acompte est généralement requis immédiatement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-teal-600" />
                  C'est sécurisé ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui, toutes nos enchères sont encadrées par la loi et supervisées par des commissaires-priseurs 
                  agréés. Vos données et transactions sont protégées.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  Quand se déroulent les enchères ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Les enchères ont lieu selon un calendrier défini. Consultez notre page des enchères 
                  pour voir les prochaines dates et horaires.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  Puis-je annuler ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Une fois l'enchère remportée, l'achat est ferme et définitif. 
                  Assurez-vous d'être certain avant d'enchérir.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to action */}
        <section className="text-center bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez notre communauté et participez à vos premières enchères
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
              <Link to="/auctions" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Voir les enchères
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/create-auction" className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Créer une enchère
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AuctionGuide;
