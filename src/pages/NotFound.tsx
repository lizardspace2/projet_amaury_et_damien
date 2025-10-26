import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import NavigationButton from "@/components/ui/navigation-button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        
        <div className="space-y-2 mb-4">
          <p className="text-xl font-semibold text-gray-700">
            <span className="block">Page non trouvée</span>
          </p>
        </div>
        
        <p className="text-gray-600 mb-6 space-y-2">
          <span className="block">Oups ! La page que vous recherchez n'existe pas.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <NavigationButton
            variant="outline"
            onClick={() => navigate(-1)}
            size="lg"
            className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
          >
            Retour
          </NavigationButton>
          <NavigationButton
            variant="primary"
            onClick={() => navigate("/")}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Retour à l'accueil
          </NavigationButton>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Tentative d'accès à : <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;