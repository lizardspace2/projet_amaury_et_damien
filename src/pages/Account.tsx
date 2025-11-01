import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const Account = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Require authentication - will redirect if not authenticated
  const { user, session, loading, initialized } = useRequireAuth();
  const { monthlyCount } = useAuth();

  useEffect(() => {
    // Check for auth errors in hash
    if (location.hash && location.hash.includes('error=')) {
      const params = new URLSearchParams(location.hash.substring(1));
      const error = params.get('error');
      const errorDescription = params.get('error_description');
      
      if (error === 'access_denied' && errorDescription?.includes('expired')) {
        window.location.href = '/verification-error' + location.hash;
      }
    }
  }, [location]);

  // Use custom hook for profile
  const { data: profile } = useUserProfile();

  // Redirect from /account to /account/myads
  useEffect(() => {
    if (location.pathname === '/account' && initialized && !loading && user) {
      navigate('/account/myads', { replace: true });
    }
  }, [location.pathname, navigate, initialized, loading, user]);

  // Show loading state while checking authentication
  if (loading || !initialized) {
    return (
      <div>
        <Navbar />
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <p>Chargement...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!user) {
    return null;
  }

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
                  <Badge variant="secondary">{monthlyCount}/{profile?.max_listings ?? 50}</Badge>
                  <a href="/account/subscription" className="text-sm text-amber-700 hover:underline">Gérer l'abonnement</a>
                </div>
                <div className="mt-2 max-w-xs">
                  <Progress value={Math.min(100, Math.round((monthlyCount / (profile?.max_listings ?? 50)) * 100))} />
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
