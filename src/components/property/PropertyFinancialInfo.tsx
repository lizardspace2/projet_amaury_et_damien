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
        <div>
          <h2 className="text-2xl font-semibold text-estate-800 mb-4">Informations financières</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {property.frais_agence && property.frais_agence > 0 && (
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro size={20} className="text-teal-500" />
                    <span className="text-sm text-estate-neutral-500">Frais d'agence</span>
                  </div>
                  <p className="text-lg font-semibold">{property.frais_agence.toLocaleString()} €</p>
                </div>
              )}

              {property.charges_mensuelles && property.charges_mensuelles > 0 && (
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro size={20} className="text-teal-500" />
                    <span className="text-sm text-estate-neutral-500">Charges mensuelles</span>
                  </div>
                  <p className="text-lg font-semibold">{property.charges_mensuelles.toLocaleString()} €</p>
                </div>
              )}

              {property.taxe_fonciere && property.taxe_fonciere > 0 && (
                <div className="flex flex-col p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro size={20} className="text-teal-500" />
                    <span className="text-sm text-estate-neutral-500">Taxe foncière (annuelle)</span>
                  </div>
                  <p className="text-lg font-semibold">{property.taxe_fonciere.toLocaleString()} €</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {(hasDPE || hasGES) && (
        <div>
          <h2 className="text-2xl font-semibold text-estate-800 mb-4">Diagnostic de performance énergétique</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
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
        </div>
      )}
    </div>
  );
};

export default PropertyFinancialInfo;

