import { Property } from "@/types/property";
import { Euro } from "lucide-react";

interface PropertyFinancialInfoProps {
  property: Property;
}

const PropertyFinancialInfo = ({ property }: PropertyFinancialInfoProps) => {
  const hasFinancialInfo = property.frais_agence || property.charges_mensuelles || property.taxe_fonciere;
  const hasDPE = property.dpe_classe_energie || property.dpe_consommation;
  const hasGES = property.ges_classe_gaz || property.ges_emission;

  if (!hasFinancialInfo && !hasDPE && !hasGES) {
    return null;
  }

  const getDPEColor = (classe?: string) => {
    if (!classe) return "";
    const colorMap: { [key: string]: string } = {
      A: "bg-green-600",
      B: "bg-green-500",
      C: "bg-yellow-400",
      D: "bg-yellow-500",
      E: "bg-orange-500",
      F: "bg-orange-600",
      G: "bg-red-600",
    };
    return colorMap[classe] || "";
  };

  const getGESColor = (classe?: string) => {
    if (!classe) return "";
    const colorMap: { [key: string]: string } = {
      A: "bg-blue-50 border-blue-200",
      B: "bg-blue-100 border-blue-300",
      C: "bg-blue-200 border-blue-400",
      D: "bg-blue-300 border-blue-500",
      E: "bg-blue-400 border-blue-600",
      F: "bg-indigo-500 border-indigo-700",
      G: "bg-indigo-600 border-indigo-800",
    };
    return colorMap[classe] || "";
  };

  const energyClasses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="space-y-6">
      {hasFinancialInfo && (
        <div className="bg-white rounded-xl p-8 shadow-lg border-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-teal-500 rounded-full"></span>
            Informations financières
          </h2>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {property.frais_agence && property.frais_agence > 0 && (
                <div className="flex flex-col p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                      <Euro size={22} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-teal-700">Frais d'agence</span>
                  </div>
                  <p className="text-2xl font-extrabold text-teal-900">{property.frais_agence.toLocaleString()} €</p>
                </div>
              )}

              {property.charges_mensuelles && property.charges_mensuelles > 0 && (
                <div className="flex flex-col p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Euro size={22} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-blue-700">Charges mensuelles</span>
                  </div>
                  <p className="text-2xl font-extrabold text-blue-900">{property.charges_mensuelles.toLocaleString()} €</p>
                </div>
              )}

              {property.taxe_fonciere && property.taxe_fonciere > 0 && (
                <div className="flex flex-col p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Euro size={22} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-purple-700">Taxe foncière (annuelle)</span>
                  </div>
                  <p className="text-2xl font-extrabold text-purple-900">{property.taxe_fonciere.toLocaleString()} €</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {(hasDPE || hasGES) && (
        <div className="bg-white rounded-xl p-8 shadow-lg border-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Performance énergétique</h2>
          
          <div className="space-y-8">
            {hasDPE && (
              <div>
                <div className="text-sm text-gray-600 mb-4">
                  Diagnostic de performance énergétique (DPE)
                </div>
                
                {/* Barre horizontale DPE */}
                <div className="flex h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  {energyClasses.map((classe, index) => {
                    const isActive = property.dpe_classe_energie === classe;
                    const width = '14.285714%'; // 100/7
                    return (
                      <div
                        key={classe}
                        style={{ width }}
                        className={`${getDPEColor(classe)} flex items-center justify-center ${
                          isActive ? 'ring-2 ring-offset-2 ring-gray-900 font-bold text-lg' : ''
                        }`}
                      >
                        {isActive && <span className="text-white font-extrabold text-xl">{classe}</span>}
                        {!isActive && <span className="text-transparent">{classe}</span>}
                      </div>
                    );
                  })}
                </div>
                
                {property.dpe_consommation && (
                  <div className="mt-4 text-sm text-gray-600">
                    Consommation: <span className="font-semibold text-gray-900">{property.dpe_consommation} kWh/m²/an</span>
                  </div>
                )}
              </div>
            )}

            {hasGES && (
              <div>
                <div className="text-sm text-gray-600 mb-4">
                  Indice d'émission de gaz à effet de serre (GES)
                </div>
                
                {/* Barre horizontale GES */}
                <div className="flex h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  {energyClasses.map((classe, index) => {
                    const isActive = property.ges_classe_gaz === classe;
                    const width = '14.285714%'; // 100/7
                    return (
                      <div
                        key={classe}
                        style={{ width }}
                        className={`${getGESColor(classe)} flex items-center justify-center ${
                          isActive ? 'ring-2 ring-offset-2 ring-gray-900 font-bold text-lg' : ''
                        }`}
                      >
                        {isActive && <span className="font-extrabold text-xl">{classe}</span>}
                        {!isActive && <span className="text-transparent">{classe}</span>}
                      </div>
                    );
                  })}
                </div>
                
                {property.ges_emission && (
                  <div className="mt-4 text-sm text-gray-600">
                    Émissions: <span className="font-semibold text-gray-900">{property.ges_emission} kg CO₂/m²/an</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFinancialInfo;

