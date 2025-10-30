import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BillingCancel: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Paiement annulé</h1>
      <p className="text-slate-600 mb-8">
        Le processus de paiement a été annulé. Vous pouvez réessayer à tout moment.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/account/subscription">
          <Button className="bg-teal-600 hover:bg-teal-700">Revenir à l'abonnement</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Accueil</Button>
        </Link>
      </div>
    </div>
  );
};

export default BillingCancel;


