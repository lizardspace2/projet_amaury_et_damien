import { Property } from "@/types/property";
import { Euro, Droplet, Wind } from "lucide-react";

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
      A: "bg-green-500",
      B: "bg-green-400",
      C: "bg-yellow-300",
      D: "bg-yellow-400",
      E: "bg-orange-400",
      F: "bg-red-400",
      G: "bg-red-600",
    };
    return colorMap[classe] || "";
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-teal-500 rounded-full"></span>
            Diagnostic de performance énergétique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hasDPE && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Droplet size={18} className="text-teal-500" />
                    Performance énergétique
                  </h3>
                  <div className="flex items-center gap-4">
                    {property.dpe_classe_energie && (
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getDPEColor(property.dpe_classe_energie)}`}>
                        {property.dpe_classe_energie}
                      </div>
                    )}
                    {property.dpe_consommation && (
                      <div>
                        <p className="text-sm text-estate-neutral-500">Consommation énergétique</p>
                        <p className="text-lg font-semibold">{property.dpe_consommation} kWh/m²/an</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {hasGES && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Wind size={18} className="text-teal-500" />
                    Émissions de gaz à effet de serre
                  </h3>
                  <div className="flex items-center gap-4">
                    {property.ges_classe_gaz && (
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${getDPEColor(property.ges_classe_gaz)}`}>
                        {property.ges_classe_gaz}
                      </div>
                    )}
                    {property.ges_emission && (
                      <div>
                        <p className="text-sm text-estate-neutral-500">Émissions GES</p>
                        <p className="text-lg font-semibold">{property.ges_emission} kg CO₂/m²/an</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFinancialInfo;

