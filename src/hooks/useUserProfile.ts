import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/AuthContext';

/**
 * Hook personnalisé pour récupérer le profil utilisateur
 * Utilise React Query pour le cache et la mise à jour automatique
 * 
 * @param selectFields - Champs spécifiques à récupérer (optionnel, par défaut récupère tous les champs)
 * @returns { data: profile, isLoading, error }
 */
export const useUserProfile = <T = any>(selectFields?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: selectFields ? ['user-profile', selectFields] : ['user-profile'],
    queryFn: async () => {
      if (!user) return null;
      
      const select = selectFields || '*';
      const { data, error } = await supabase
        .from('profiles')
        .select(select)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as T;
    },
    enabled: !!user,
    // Use same staleTime for all profile queries
    staleTime: 0
  });
};

/**
 * Hook pour récupérer uniquement les propriétés aimées par l'utilisateur
 */
export const useUserLikedProperties = () => {
  const { data: profile } = useUserProfile<{ liked_properties?: string[] }>('liked_properties');
  return profile?.liked_properties || [];
};

