import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserPlus, 
  UserMinus, 
  Gavel, 
  Bell, 
  BellOff,
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  Euro,
  Clock,
  Zap
} from 'lucide-react';

interface UserActionsProps {
  auctionId: string;
  isRegistered: boolean;
  onRegister: () => void;
  onUnregister: () => void;
  className?: string;
}

const UserActions: React.FC<UserActionsProps> = ({
  auctionId,
  isRegistered,
  onRegister,
  onUnregister,
  className = ""
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isBidding, setIsBidding] = useState(false);
  const [notifications, setNotifications] = useState({
    outbid: true,
    ending: true,
    newLots: false
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleBid = async () => {
    const amount = parseFloat(bidAmount);
    if (amount <= 0) {
      alert('Veuillez saisir un montant valide');
      return;
    }

    setIsBidding(true);
    
    // Simuler l'envoi de l'enchère
    setTimeout(() => {
      console.log(`Enchère de ${formatCurrency(amount)} envoyée`);
      setBidAmount('');
      setIsBidding(false);
    }, 1000);
  };

  const handleQuickBid = (increment: number) => {
    const currentBid = 950000; // Prix actuel de démonstration
    const newAmount = currentBid + increment;
    setBidAmount(newAmount.toString());
  };

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Inscription à la vente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isRegistered ? <CheckCircle className="h-5 w-5 text-green-600" /> : <UserPlus className="h-5 w-5 text-teal-600" />}
            Participation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isRegistered ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Inscrit à la vente</p>
                  <p className="text-sm text-green-600">Vous pouvez enchérir</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={onUnregister}
                className="w-full"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Se désinscrire
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Inscription requise</h4>
                <p className="text-sm text-blue-600 mb-3">
                  Vous devez vous inscrire pour participer aux enchères
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Vérification d'identité</li>
                  <li>• Justificatif de domicile</li>
                  <li>• Capacité financière</li>
                </ul>
              </div>
              <Button 
                onClick={onRegister}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                S'inscrire à la vente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enchères en direct */}
      {isRegistered && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-orange-600" />
              Enchérir en direct
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold text-orange-800">Enchère actuelle</span>
                </div>
                <p className="text-2xl font-bold text-orange-700">
                  {formatCurrency(950000)}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Montant de votre enchère
                  </label>
                  <Input
                    type="number"
                    placeholder="Saisissez votre enchère"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <Button 
                  onClick={handleBid}
                  disabled={isBidding || !bidAmount}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isBidding ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Gavel className="h-4 w-4 mr-2" />
                      Enchérir
                    </>
                  )}
                </Button>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Enchères rapides</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickBid(25000)}
                      className="text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      +25k
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickBid(50000)}
                      className="text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      +50k
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickBid(100000)}
                      className="text-xs"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      +100k
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ordre d'achat */}
      {isRegistered && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Ordre d'achat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Enchérir automatiquement</h4>
                <p className="text-sm text-blue-600">
                  Déposez un ordre d'achat pour enchérir automatiquement jusqu'à votre prix maximum
                </p>
              </div>
              
              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Prix maximum"
                  className="text-lg"
                />
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Déposer un ordre
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Sur-enchère</p>
                <p className="text-xs text-gray-600">Quand vous êtes sur-enchéri</p>
              </div>
              <Button
                size="sm"
                variant={notifications.outbid ? "default" : "outline"}
                onClick={() => toggleNotification('outbid')}
              >
                {notifications.outbid ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Fin d'enchère</p>
                <p className="text-xs text-gray-600">Quand une enchère se termine</p>
              </div>
              <Button
                size="sm"
                variant={notifications.ending ? "default" : "outline"}
                onClick={() => toggleNotification('ending')}
              >
                {notifications.ending ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Nouveaux lots</p>
                <p className="text-xs text-gray-600">Quand de nouveaux lots sont ajoutés</p>
              </div>
              <Button
                size="sm"
                variant={notifications.newLots ? "default" : "outline"}
                onClick={() => toggleNotification('newLots')}
              >
                {notifications.newLots ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paiement sécurisé */}
      {isRegistered && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Paiement sécurisé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Protection des données</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Garantie de transaction</span>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Gérer mes moyens de paiement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Avertissement */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Important</h4>
              <p className="text-sm text-yellow-700">
                Les enchères sont fermes et définitives. Assurez-vous de votre capacité financière 
                avant d'enchérir. Consultez les conditions de vente pour plus d'informations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActions;
