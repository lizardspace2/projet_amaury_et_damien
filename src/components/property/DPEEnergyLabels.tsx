import { Property } from "@/types/property";

interface DPEEnergyLabelsProps {
  property: Property;
}

const DPEEnergyLabels = ({ property }: DPEEnergyLabelsProps) => {
  const getDPEColor = (classe?: string) => {
    if (!classe) return "";
    const colorMap: { [key: string]: string } = {
      A: "bg-green-600",
      B: "bg-green-500", 
      C: "bg-yellow-400",
      D: "bg-yellow-500",
      E: "bg-orange-500",
      F: "bg-red-500",
      G: "bg-red-700",
    };
    return colorMap[classe] || "";
  };

  const getGESColor = (classe?: string) => {
    if (!classe) return "";
    const colorMap: { [key: string]: string } = {
      A: "bg-blue-600",
      B: "bg-blue-500",
      C: "bg-purple-400", 
      D: "bg-purple-500",
      E: "bg-pink-500",
      F: "bg-red-500",
      G: "bg-red-700",
    };
    return colorMap[classe] || "";
  };

  const hasDPE = property.dpe_classe_energie || property.dpe_consommation;
  const hasGES = property.ges_classe_gaz || property.ges_emission;

  if (!hasDPE && !hasGES) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-estate-800 mb-4">Diagnostic de performance énergétique</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-estate-neutral-100">
        <div className="flex flex-col md:flex-row gap-6">
          {hasDPE && (
            <div className="flex-1">
              <h3 className="font-medium mb-3 text-estate-neutral-700">Consommation énergétique</h3>
              <div className="flex items-center gap-4">
                {property.dpe_classe_energie && (
                  <div className="relative">
                    <div className={`w-16 h-20 rounded-lg ${getDPEColor(property.dpe_classe_energie)} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-2xl">{property.dpe_classe_energie}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium text-estate-neutral-600 shadow-sm">
                      DPE
                    </div>
                  </div>
                )}
                {property.dpe_consommation && (
                  <div>
                    <p className="text-sm text-estate-neutral-500">Consommation</p>
                    <p className="text-lg font-semibold text-estate-neutral-800">
                      {property.dpe_consommation} kWh/m²/an
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {hasGES && (
            <div className="flex-1">
              <h3 className="font-medium mb-3 text-estate-neutral-700">Émissions de gaz à effet de serre</h3>
              <div className="flex items-center gap-4">
                {property.ges_classe_gaz && (
                  <div className="relative">
                    <div className={`w-16 h-20 rounded-lg ${getGESColor(property.ges_classe_gaz)} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-2xl">{property.ges_classe_gaz}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium text-estate-neutral-600 shadow-sm">
                      GES
                    </div>
                  </div>
                )}
                {property.ges_emission && (
                  <div>
                    <p className="text-sm text-estate-neutral-500">Émissions</p>
                    <p className="text-lg font-semibold text-estate-neutral-800">
                      {property.ges_emission} kg CO₂/m²/an
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-estate-neutral-200">
          <p className="text-xs text-estate-neutral-500">
            * DPE : Diagnostic de Performance Énergétique • GES : Gaz à Effet de Serre
          </p>
        </div>
      </div>
    </div>
  );
};

export default DPEEnergyLabels;
