import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Phone, Mail, User, Building2, Eye } from "lucide-react";
import { useState } from "react";

interface AgentContactProps {
  property: Property;
}

const AgentContact = ({ property }: AgentContactProps) => {
  const [showPhone, setShowPhone] = useState(false);
  
  return (
    <>
      {(property.nom_agence || property.agent_name || property.phone_number) && (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <span className="w-1 h-8 bg-teal-500 rounded-full"></span>
            Contact
          </h3>
          
          {property.nom_agence && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{property.nom_agence}</p>
                <p className="text-sm text-gray-600">Agence immobilière</p>
              </div>
            </div>
          )}
          
          {property.agent_name && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
                <User size={28} className="text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{property.agent_name}</p>
                <p className="text-estate-neutral-600">Agent immobilier</p>
              </div>
            </div>
          )}
          
          <div className="space-y-3 mb-6">
            {(property.phone_number || property.agent_phone) && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <Phone size={20} className="text-white" />
                </div>
                {showPhone ? (
                  <a 
                    href={`tel:${property.phone_number || property.agent_phone}`} 
                    className="text-estate-800 hover:text-teal-600 font-semibold text-lg flex-1"
                  >
                    {property.phone_number || property.agent_phone}
                  </a>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPhone(true)}
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 flex-1 justify-start h-auto py-2"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Afficher le numéro
                  </Button>
                )}
              </div>
            )}
            
            {property.contact_email && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <Mail size={20} className="text-white" />
                </div>
                <a 
                  href={`mailto:${property.contact_email}`} 
                  className="text-estate-800 hover:text-teal-600 font-semibold text-lg flex-1 break-all"
                >
                  {property.contact_email}
                </a>
              </div>
            )}
          </div>
          
          {property.reference_annonce && (
            <div className="pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Référence : <span className="font-semibold text-estate-800">{property.reference_annonce}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AgentContact;