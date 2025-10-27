import { supabase } from "./supabaseClient";

export interface AncillaryService {
  id: string;
  service_type: string;
  description: string;
  estimated_cost?: number;
  provider_name: string;
  provider_contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  requested_by: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export const getMyAncillaryServices = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('ancillary_services')
      .select('*')
      .eq('requested_by', user.id)
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

