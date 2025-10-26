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

  const hasDPE = property.dpe_classe_energie || property.dpe_consommation;
  const hasGES = property.ges_classe_gaz || property.ges_emission;

  if (!hasDPE && !hasGES) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Performance énergétique</h2>
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <div className="space-y-8">
          {hasDPE && (
            <div>
              <div className="text-sm text-gray-600 mb-4">
                Diagnostic de performance énergétique (DPE)
              </div>
              
              {/* Barre horizontale DPE */}
              <div className="flex h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                {energyClasses.map((classe) => {
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
                {energyClasses.map((classe) => {
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

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            * DPE : Diagnostic de Performance Énergétique • GES : Gaz à Effet de Serre
          </p>
        </div>
      </div>
    </div>
  );
};

export default DPEEnergyLabels;
