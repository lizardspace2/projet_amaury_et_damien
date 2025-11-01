import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';

/**
 * Hook pour protéger une route - redirige si l'utilisateur n'est pas authentifié
 * 
 * @param redirectTo - Route de redirection si non authentifié (par défaut: '/')
 * @returns { user, loading, initialized, isAuthenticated }
 */
export const useRequireAuth = (redirectTo: string = '/') => {
  const { user, loading, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, initialized, navigate, redirectTo]);

  return {
    user,
    loading,
    initialized,
    isAuthenticated: !!user
  };
};

