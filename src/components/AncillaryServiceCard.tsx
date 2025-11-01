import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, PauseCircle, PlayCircle, CalendarIcon, DollarSign, User, Phone, Mail, Globe } from "lucide-react";
import { format } from "date-fns";

import { fr } from "date-fns/locale";

export interface AncillaryService {
  id: string;
  property_id?: string | null;
  service_type: string;
  description?: string | null;
  estimated_cost?: number | null;
  provider_name?: string | null;
  provider_contact?: {
    phone?: string;
    email?: string;
    website?: string;
  } | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requested_at?: string;
  scheduled_date?: string | null;
  completed_at?: string | null;
  is_active: boolean;
  start_date: string;
  end_date?: string | null;
  requested_by?: string | null;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

interface AncillaryServiceCardProps {
  service: AncillaryService;
  onEdit?: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
  onPause?: (serviceId: string) => void;
  onResume?: (serviceId: string) => void;
}

const serviceTypeLabels: Record<string, string> = {
  demenagement: "Déménagement",
  travaux: "Travaux",
  diagnostic: "Diagnostic",
  nettoyage: "Nettoyage",
  assurance: "Assurance",
  amenagement: "Aménagement",
  autre: "Autre"
};

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "En cours", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Terminé", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-800" }
};

const AncillaryServiceCard = ({
  service,
  onEdit,
  onDelete,
  onPause,
  onResume,
}: AncillaryServiceCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header with type and status */}
        <div className="flex justify-between items-start mb-4">
          <Badge className="bg-amber-500 text-white">
            {serviceTypeLabels[service.service_type] || service.service_type}
          </Badge>
          <Badge className={statusLabels[service.status]?.color || "bg-gray-100 text-gray-800"}>
            {statusLabels[service.status]?.label || service.status}
          </Badge>
        </div>

        {/* Provider Name */}
        <h3 className="font-semibold text-xl mb-2 text-slate-800">
          {service.provider_name}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {service.provider_contact?.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={14} />
              <span>{service.provider_contact.phone}</span>
            </div>
          )}
          {service.provider_contact?.email && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail size={14} />
              <span>{service.provider_contact.email}</span>
            </div>
          )}
          {service.provider_contact?.website && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Globe size={14} />
              <a href={service.provider_contact.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Visiter le site
              </a>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
          <CalendarIcon size={16} />
          <span>
            Du {format(new Date(service.start_date), 'PPP', { locale: fr })}
            {service.end_date && ` au ${format(new Date(service.end_date), 'PPP', { locale: fr })}`}
          </span>
        </div>

        {/* Estimated Cost */}
        {service.estimated_cost && (
          <div className="flex items-center gap-2 text-lg font-semibold text-teal-600 mb-4">
            <DollarSign size={18} />
            <span>{service.estimated_cost.toFixed(2)} €</span>
          </div>
        )}

        {/* Action Buttons */}
        {(onEdit || onDelete || onPause || onResume) && (
          <div className="flex gap-2 pt-4 border-t">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(service.id)}
                className="flex-1"
              >
                <Edit size={16} className="mr-2" />
                Modifier
              </Button>
            )}
            {onPause && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPause(service.id)}
                className="flex-1"
              >
                <PauseCircle size={16} className="mr-2" />
                Pause
              </Button>
            )}
            {onResume && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResume(service.id)}
                className="flex-1"
              >
                <PlayCircle size={16} className="mr-2" />
                Reprendre
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(service.id)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AncillaryServiceCard;

