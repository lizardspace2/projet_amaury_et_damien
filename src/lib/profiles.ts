import { supabase } from "./api/supabaseClient";

export const createUserProfile = async (userId: string, email: string, userType?: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { 
        user_id: userId,
        email,
        user_type: userType || null,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[0];
};