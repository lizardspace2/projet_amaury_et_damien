import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FcMoneyTransfer, FcInfo, FcCalculator, FcDocument, FcHome, FcCollaboration } from 'react-icons/fc';

const Borrow = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-3">Emprunter</h1>
        <p className="text-base text-slate-600 mb-6">Choisissez un outil ou une ressource pour commencer.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Emprunt</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/borrow/credit" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <div className="shrink-0"><FcMoneyTransfer size={32} /></div>
                  <div>
                    <CardTitle className="text-lg">Votre crédit : comparez les offres</CardTitle>
                    <CardDescription className="text-sm">Explorez les taux et conditions pour trouver le meilleur crédit.</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/borrow/assurance" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <div className="shrink-0"><FcInfo size={32} /></div>
                  <div>
                    <CardTitle className="text-lg">Assurance de prêt : en savoir plus</CardTitle>
                    <CardDescription className="text-sm">Comprenez les garanties et optimisez le coût de votre assurance emprunteur.</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Outils</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/borrow/capacite" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <div className="shrink-0"><FcCollaboration size={32} /></div>
                  <div>
                    <CardTitle className="text-lg">Votre capacité d'emprunt</CardTitle>
                    <CardDescription className="text-sm">Estimez le montant que vous pouvez emprunter selon votre situation.</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/borrow/mensualites" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <div className="shrink-0"><FcCalculator size={32} /></div>
                  <div>
                    <CardTitle className="text-lg">Calculez vos mensualités</CardTitle>
                    <CardDescription className="text-sm">Simulez vos échéances selon le capital, la durée et le taux.</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/borrow/frais-notaire" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <div className="shrink-0"><FcDocument size={32} /></div>
                  <div>
                    <CardTitle className="text-lg">Estimez vos frais de notaire</CardTitle>
                    <CardDescription className="text-sm">Évaluez les frais annexes liés à votre acquisition.</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Investir</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/borrow/investissement-locatif" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <div className="shrink-0"><FcHome size={32} /></div>
                  <div>
                    <CardTitle className="text-lg">Investissement locatif</CardTitle>
                    <CardDescription className="text-sm">Analysez la rentabilité et optimisez votre projet d'investissement.</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Borrow;
