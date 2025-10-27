import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { handleAuthError } from "@/lib/api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/api/supabaseClient";

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
          </div>
        </div>

        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Account;
