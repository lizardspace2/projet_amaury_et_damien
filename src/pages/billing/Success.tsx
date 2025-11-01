import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BillingSuccess: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Paiement confirmé</h1>
      <p className="text-slate-600 mb-8">
        Merci ! Votre abonnement Pro+ est actif. Vous pouvez désormais publier jusqu'à 500 annonces immobilières et 20 services annexes par mois.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/account/profile">
          <Button variant="outline">Voir mon compte</Button>
        </Link>
        <Link to="/account/subscription">
          <Button className="bg-teal-600 hover:bg-teal-700">Gérer mon abonnement</Button>
        </Link>
      </div>
    </div>
  );
};

export default BillingSuccess;


