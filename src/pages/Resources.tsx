import { Link } from "react-router-dom";
import { Calculator, BookOpen, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Resources = () => {
  const simulators = [
    {
      title: "Simulateur de réméré",
      description: "Calculez votre réméré immobilier",
      href: "/resources/simulateur-remere",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de VEFA",
      description: "Vente en l'état futur d'achèvement",
      href: "/resources/simulateur-vefa",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de vente à terme",
      description: "Achat avec paiement différé",
      href: "/resources/simulateur-vente-terme",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de réméré inversé",
      description: "Vente avec option de rachat inversée",
      href: "/resources/simulateur-remere-inverse",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de viager",
      description: "Achat avec rente viagère",
      href: "/resources/simulateur-viager",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de bail commercial",
      description: "Reprendre un bail commercial existant",
      href: "/resources/simulateur-bail",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur d'enchères",
      description: "Acheter aux enchères publiques",
      href: "/resources/simulateur-encheres",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de biens d'exception",
      description: "Propriétés de luxe et prestige",
      href: "/resources/simulateur-biens-exception",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur d'indivision",
      description: "Achat en parts ou nue-propriété",
      href: "/resources/simulateur-indivision",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de BRS",
      description: "Bail réel solidaire",
      href: "/resources/simulateur-brs",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de démembrement",
      description: "Achat avec démembrement de propriété",
      href: "/resources/simulateur-demenbrement",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de crédit-vendeur",
      description: "Achat avec financement par le vendeur",
      href: "/resources/simulateur-credit-vendeur",
      icon: <Calculator className="w-8 h-8" />,
    },
    {
      title: "Simulateur de copropriété",
      description: "Achat en copropriété ou lot de volume",
      href: "/resources/simulateur-copropriete",
      icon: <Calculator className="w-8 h-8" />,
    },
  ];

  const guides = [
    {
      title: "Guide du réméré",
      description: "Tout savoir sur le réméré immobilier",
      href: "/resources/guide-remere",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide du VEFA",
      description: "Comprendre la vente en l'état futur d'achèvement",
      href: "/resources/guide-vefa",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide de la vente à terme",
      description: "Expliquer la vente à terme",
      href: "/resources/guide-vente-terme",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide du réméré inversé",
      description: "Comprendre le réméré inversé",
      href: "/resources/guide-remere-inverse",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide du viager",
      description: "Tout savoir sur le viager immobilier",
      href: "/resources/guide-viager",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide du bail commercial",
      description: "Reprendre un bail commercial",
      href: "/resources/guide-bail",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide des enchères immobilières",
      description: "Acheter aux enchères publiques",
      href: "/resources/guide-encheres",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide des biens d'exception",
      description: "Investir dans le luxe",
      href: "/resources/guide-biens-exception",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide de l'indivision",
      description: "Achat en parts ou nue-propriété",
      href: "/resources/guide-indivision",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide du BRS",
      description: "Comprendre le bail réel solidaire",
      href: "/resources/guide-brs",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide du démembrement",
      description: "Achat avec démembrement de propriété",
      href: "/resources/guide-demenbrement",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide du crédit-vendeur",
      description: "Financement par le vendeur",
      href: "/resources/guide-credit-vendeur",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: "Guide de la copropriété",
      description: "Achat en copropriété ou lot de volume",
      href: "/resources/guide-copropriete",
      icon: <BookOpen className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Ressources
            </h1>
            <p className="text-lg text-slate-600">
              Outils et guides pour vous accompagner dans vos projets immobiliers
            </p>
          </div>

          {/* Simulateurs Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-teal-600" />
              Simulateurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              { simulators.map((simulator, index) => (
                <Link
                  key={index}
                  to={simulator.href}
                  className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                      {simulator.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
                        {simulator.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {simulator.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-teal-600 text-sm font-medium group-hover:gap-3 transition-all">
                      Accéder
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Contenu pédagogique Section */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-teal-600" />
              Contenu pédagogique
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide, index) => (
                <Link
                  key={index}
                  to={guide.href}
                  className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                      {guide.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {guide.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-teal-600 text-sm font-medium group-hover:gap-3 transition-all">
                      Lire
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
