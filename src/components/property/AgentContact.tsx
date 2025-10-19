import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Phone, Mail, User } from "lucide-react";

interface AgentContactProps {
  property: Property;
}

const AgentContact = ({ property }: AgentContactProps) => {
  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow border border-estate-neutral-100 mb-6">
        <Button className="w-full bg-teal-500 hover:bg-teal-600">
          Planifier une visite
        </Button>
        <Button variant="outline" className="w-full mt-3">
          Demander des informations
        </Button>
      </div>
      
      {property.agent_name && (
        <div className="bg-white rounded-lg p-6 shadow border border-estate-neutral-100">
          <h3 className="text-xl font-semibold text-estate-800 mb-4">
            Annonce publiée par
          </h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-estate-neutral-200 rounded-full flex items-center justify-center text-estate-neutral-500">
              <User size={32} />
            </div>
            <div>
              <p className="font-medium text-lg">{property.agent_name}</p>
              <p className="text-estate-neutral-500">Agent immobilier</p>
            </div>
          </div>
          
          {property.agent_phone && (
            <div className="flex items-center gap-3 mb-3">
              <Phone size={18} className="text-teal-500" />
              <a 
                href={`tel:${property.agent_phone}`} 
                className="text-estate-neutral-700 hover:text-estate-800"
              >
                {property.agent_phone}
              </a>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-teal-500" />
            <a 
              href="mailto:agent@househaven.com" 
              className="text-estate-neutral-700 hover:text-estate-800"
            >
              agent@househaven.com
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentContact;