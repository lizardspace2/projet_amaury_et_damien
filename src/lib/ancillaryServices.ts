import { supabase } from "@/lib/client";

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

export const getMyAncillaryServices = async () => {
  try {
    // Use getSession() for more reliable check
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ancillary_services')
      .select('*')
      .eq('requested_by', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AncillaryService[];
  } catch (error) {
    console.error('Error fetching ancillary services:', error);
    throw error;
  }
};

export const deleteAncillaryService = async (serviceId: string) => {
  try {
    const { error } = await supabase
      .from('ancillary_services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting ancillary service:', error);
    throw error;
  }
};

export const updateAncillaryServiceStatus = async (
  serviceId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
) => {
  try {
    const { error } = await supabase
      .from('ancillary_services')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', serviceId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating ancillary service status:', error);
    throw error;
  }
};

