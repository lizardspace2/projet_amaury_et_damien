import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const getApiBase = (): string => {
  const base = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
  return base && base.trim().length > 0 ? base.replace(/\/$/, '') : '';
};

const startProUpgradeCheckout = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  console.log('[billing] startProUpgradeCheckout: user', {
    id: user.id,
    email: user.email,
  });

  const response = await fetch(`${getApiBase()}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.id, userEmail: user.email }),
  });

  console.log('[billing] create-checkout-session status', response.status);
  const json = await response.json().catch(() => ({} as any));
  console.log('[billing] create-checkout-session payload', json);
  if (!response.ok) {
    throw new Error(json?.error || `Unable to start checkout (status ${response.status})`);
  }

  const { url } = json as { url?: string };
  if (url) {
    window.location.href = url;
  } else {
    throw new Error('No checkout URL received');
  }
};

const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    email: '',
    instagram: '',
    twitter: '',
    facebook: '',
    profession: '',
    siret: '',
    user_type: '',
  });

  const { user, monthlyCount, monthlyAncillaryCount, subscriptionInfo } = useAuth();
  
  // Use custom hook for profile
  const { data: profile, isLoading } = useUserProfile();

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || '',
        address: profile.address || '',
        email: profile.email || user?.email || '',
        instagram: profile.instagram || '',
        twitter: profile.twitter || '',
        facebook: profile.facebook || '',
        profession: profile.profession || '',
        siret: profile.siret || '',
        user_type: profile.user_type || '',
      });
    }
  }, [profile, user?.email]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('No user');
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error(error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="flex justify-center py-8">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {(profile?.user_type === 'Professionnelle' || profile?.user_type === 'Partenaire') && (
        <>
          <div className="mb-6 rounded-md border border-amber-200 p-4 bg-amber-50">
            <div className="flex items-center justify-between gap-3">
              <div className="w-full">
                <p className="font-semibold text-amber-900">Quota d'annonces immobilières mensuel</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{monthlyCount ?? 0}/{profile?.max_listings ?? 50}</Badge>
                  {subscriptionInfo.isSubscribed && (
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      Pro+ Actif
                    </Badge>
                  )}
                  <span className="text-sm text-amber-700">
                    {Math.max(0, (profile?.max_listings ?? 50) - (monthlyCount ?? 0))} restantes
                  </span>
                </div>
                <div className="mt-2 max-w-sm">
                  <Progress value={Math.min(100, Math.round(((monthlyCount ?? 0) / (profile?.max_listings ?? 50)) * 100))} />
                </div>
              </div>
              {(profile?.max_listings ?? 50) < 500 && (
                <Button onClick={async () => {
                  try { await startProUpgradeCheckout(); } catch (e: any) { toast.error(e?.message || 'Impossible de démarrer le paiement'); }
                }} className="bg-amber-600 hover:bg-amber-700 whitespace-nowrap">Passer à Pro+ (29,99 € / mois)</Button>
              )}
            </div>
          </div>
          <div className="mb-6 rounded-md border border-orange-200 p-4 bg-orange-50">
            <div className="flex items-center justify-between gap-3">
              <div className="w-full">
                <p className="font-semibold text-orange-900">Quota de services annexes mensuel</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{monthlyAncillaryCount ?? 0}/{subscriptionInfo.maxAncillaryServices}</Badge>
                  {subscriptionInfo.isSubscribed && (
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      Pro+ Actif
                    </Badge>
                  )}
                  <span className="text-sm text-orange-700">
                    {Math.max(0, subscriptionInfo.maxAncillaryServices - (monthlyAncillaryCount ?? 0))} restantes
                  </span>
                </div>
                <div className="mt-2 max-w-sm">
                  <Progress value={Math.min(100, Math.round(((monthlyAncillaryCount ?? 0) / subscriptionInfo.maxAncillaryServices) * 100))} />
                </div>
                {!subscriptionInfo.isSubscribed && (
                  <p className="text-sm text-orange-700 mt-1">
                    Passez à Pro+ pour publier jusqu'à 20 services annexes par mois (29,99 € / mois).
                  </p>
                )}
              </div>
              {subscriptionInfo.maxAncillaryServices < 20 && (
                <Button onClick={async () => {
                  try { await startProUpgradeCheckout(); } catch (e: any) { toast.error(e?.message || 'Impossible de démarrer le paiement'); }
                }} className="bg-orange-600 hover:bg-orange-700 whitespace-nowrap">Passer à Pro+ (29,99 € / mois)</Button>
              )}
            </div>
          </div>
        </>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Mon profil
        </h1>
        <p className="text-slate-600">
          Gérez vos informations personnelles
        </p>
        {profile?.user_type && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-slate-600">Statut</span>
            <Badge variant="secondary">
              {profile.user_type === 'Particulier'
                ? '👤 Particulier'
                : profile.user_type === 'Professionnelle'
                ? '💼 Professionnelle'
                : '🤝 Partenaire'}
            </Badge>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  placeholder="Votre email"
                  disabled
                />
                <p className="text-xs text-slate-500">L'email ne peut pas être modifié ici</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea 
                  id="address" 
                  name="address"
                  value={formData.address} 
                  onChange={handleInputChange}
                  placeholder="Votre adresse complète"
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Réseaux sociaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input 
                  id="instagram" 
                  name="instagram"
                  value={formData.instagram} 
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input 
                  id="twitter" 
                  name="twitter"
                  value={formData.twitter} 
                  onChange={handleInputChange}
                  placeholder="@username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input 
                  id="facebook" 
                  name="facebook"
                  value={formData.facebook} 
                  onChange={handleInputChange}
                  placeholder="Lien vers votre profil"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations professionnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input 
                  id="profession" 
                  name="profession"
                  value={formData.profession} 
                  onChange={handleInputChange}
                  placeholder="Votre profession"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siret">SIRET</Label>
                <Input 
                  id="siret" 
                  name="siret"
                  value={formData.siret} 
                  onChange={handleInputChange}
                  placeholder="14 chiffres"
                  maxLength={14}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_type">Type d'utilisateur</Label>
                <Input 
                  id="user_type" 
                  name="user_type"
                  value={formData.user_type || ''} 
                  disabled
                />
                <p className="text-xs text-slate-500">Le type d'utilisateur ne peut pas être modifié</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              if (profile) {
                setFormData({
                  phone: profile.phone || '',
                  address: profile.address || '',
                  email: profile.email || user?.email || '',
                  instagram: profile.instagram || '',
                  twitter: profile.twitter || '',
                  facebook: profile.facebook || '',
                  profession: profile.profession || '',
                  siret: profile.siret || '',
                  user_type: profile.user_type || '',
                });
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

