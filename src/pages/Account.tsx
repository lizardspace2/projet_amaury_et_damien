import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { handleAuthError } from "@/lib/api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/api/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for auth errors in hash
    if (location.hash) {
      handleAuthError(location.hash);
    }
  }, [location]);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: monthlyCount = 0 } = useQuery({
    queryKey: ['my-properties-monthly-count'],
    queryFn: async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return 0;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count } = await supabase
        .from('properties')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', now.toISOString());
      return count || 0;
    },
    enabled: !!user
  });

  // Redirect from /account to /account/myads
  useEffect(() => {
    if (location.pathname === '/account') {
      navigate('/account/myads', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div>
      <Navbar />

      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-estate-800 flex items-center justify-center text-white text-2xl">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-estate-800">
              {user?.user_metadata?.full_name || "Mon compte"}
            </h1>
            <p className="text-estate-neutral-600">
              {user?.email}
            </p>
            {profile?.user_type && (
              <p className="text-sm text-teal-600 font-medium mt-1">
                {profile.user_type === 'Particulier' ? '👤 Particulier' : profile.user_type === 'Professionnelle' ? '💼 Professionnelle' : '🤝 Partenaire'}
              </p>
            )}
            {profile?.user_type === 'Professionnelle' && (
              <div className="mt-2">
                <p className="text-sm text-amber-900">Quota d'annonces mensuel</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{monthlyCount}/{profile?.max_listings ?? 10}</Badge>
                  <a href="/account/subscription" className="text-sm text-amber-700 hover:underline">Gérer l'abonnement</a>
                </div>
                <div className="mt-2 max-w-xs">
                  <Progress value={Math.min(100, Math.round((monthlyCount / (profile?.max_listings ?? 10)) * 100))} />
                </div>
              </div>
            )}
          </div>
        </div>

        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Account;
