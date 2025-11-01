import { createClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          phone: string | null
          address: string | null
          instagram: string | null
          twitter: string | null
          facebook: string | null
          created_at: string
          updated_at: string
          email: string | null
          liked_properties: Json | null
          profession: string | null
          siret: string | null
          user_type: string | null
          max_listings: number
          max_ancillary_services: number
          stripe_customer_id: string | null
          stripe_subscription_status: string | null
          stripe_subscription_id: string | null
          subscription_current_period_start: string | null
          subscription_current_period_end: string | null
          subscription_cancel_at_period_end: boolean
        }
        Insert: {
          user_id: string
          phone?: string | null
          address?: string | null
          instagram?: string | null
          twitter?: string | null
          facebook?: string | null
          created_at?: string
          updated_at?: string
          email?: string | null
          liked_properties?: Json | null
          profession?: string | null
          siret?: string | null
          user_type?: string | null
          max_listings?: number
          max_ancillary_services?: number
          stripe_customer_id?: string | null
          stripe_subscription_status?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_start?: string | null
          subscription_current_period_end?: string | null
          subscription_cancel_at_period_end?: boolean
        }
        Update: {
          user_id?: string
          phone?: string | null
          address?: string | null
          instagram?: string | null
          twitter?: string | null
          facebook?: string | null
          created_at?: string
          updated_at?: string
          email?: string | null
          liked_properties?: Json | null
          profession?: string | null
          siret?: string | null
          user_type?: string | null
          max_listings?: number
          max_ancillary_services?: number
          stripe_customer_id?: string | null
          stripe_subscription_status?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_start?: string | null
          subscription_current_period_end?: string | null
          subscription_cancel_at_period_end?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          phone_number: string | null
          contact_email: string | null
          instagram_handle: string | null
          facebook_url: string | null
          twitter_handle: string | null
          reference_number: string | null
          cadastral_code: string | null
          title: string
          description: string | null
          price: number
          currency: string
          m2: number | null
          beds: number
          baths: number
          rooms: number | null
          year_built: number | null
          condition: string | null
          status: string | null
          featured: boolean
          terrace_area: number | null
          kitchen_type: string | null
          ceiling_height: number | null
          floor_level: number | null
          total_floors: number | null
          amenities: string[]
          equipment: string[]
          internet_tv: string[]
          storage: string[]
          security: string[]
          nearby_places: string[]
          online_services: string[]
          has_elevator: boolean
          has_ventilation: boolean
          has_air_conditioning: boolean
          is_accessible: boolean
          has_gas: boolean
          has_loggia: boolean
          has_fireplace: boolean
          has_internet: boolean
          has_cable_tv: boolean
          has_satellite_tv: boolean
          has_phone_line: boolean
          has_vent: boolean
          has_cinema: boolean
          has_dishwasher: boolean
          has_gas_stove: boolean
          has_electric_kettle: boolean
          has_induction_oven: boolean
          has_microwave: boolean
          has_electric_oven: boolean
          has_washing_machine: boolean
          has_tv: boolean
          has_coffee_machine: boolean
          has_audio_system: boolean
          has_heater: boolean
          has_hair_dryer: boolean
          has_refrigerator: boolean
          has_vacuum_cleaner: boolean
          has_dryer: boolean
          has_iron: boolean
          has_co_detector: boolean
          has_smoke_detector: boolean
          has_evacuation_ladder: boolean
          has_fire_fighting_system: boolean
          has_perimeter_cameras: boolean
          has_alarm: boolean
          has_live_protection: boolean
          has_locked_entrance: boolean
          has_locked_yard: boolean
          near_bus_stop: boolean
          near_bank: boolean
          near_subway: boolean
          near_supermarket: boolean
          near_kindergarten: boolean
          near_city_center: boolean
          near_pharmacy: boolean
          near_greenery: boolean
          near_park: boolean
          near_shopping_centre: boolean
          near_school: boolean
          near_old_district: boolean
          allows_pets: boolean
          allows_parties: boolean
          allows_smoking: boolean
          building_material: string | null
          furniture_type: string | null
          storeroom_type: string | null
          heating_type: string | null
          hot_water_type: string | null
          parking_type: string | null
          address_street: string | null
          address_city: string | null
          address_district: string | null
          lat: number
          lng: number
          images: string[]
          property_type: string | null
          listing_type: string | null
          plan: string | null
          agent_name: string | null
          agent_phone: string | null
          project_name: string | null
          price_per_m2: number | null
          frais_agence: number | null
          charges_mensuelles: number | null
          taxe_fonciere: number | null
          dpe_classe_energie: string | null
          dpe_consommation: number | null
          ges_classe_gaz: string | null
          ges_emission: number | null
          nom_agence: string | null
          reference_annonce: string | null
          nombre_photos: number
          lien_visite_virtuelle: string | null
          date_publication: string | null
          date_mise_a_jour: string | null
          code_postal: string | null
          surface_balcon_terrasse: number | null
          parking_box: number | null
          cave: boolean
          nombre_etages_immeuble: number | null
          annee_construction: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          phone_number?: string | null
          contact_email?: string | null
          instagram_handle?: string | null
          facebook_url?: string | null
          twitter_handle?: string | null
          reference_number?: string | null
          cadastral_code?: string | null
          title: string
          description?: string | null
          price: number
          currency?: string
          m2?: number | null
          beds?: number
          baths?: number
          rooms?: number | null
          year_built?: number | null
          condition?: string | null
          status?: string | null
          featured?: boolean
          terrace_area?: number | null
          kitchen_type?: string | null
          ceiling_height?: number | null
          floor_level?: number | null
          total_floors?: number | null
          amenities?: string[]
          equipment?: string[]
          internet_tv?: string[]
          storage?: string[]
          security?: string[]
          nearby_places?: string[]
          online_services?: string[]
          has_elevator?: boolean
          has_ventilation?: boolean
          has_air_conditioning?: boolean
          is_accessible?: boolean
          has_gas?: boolean
          has_loggia?: boolean
          has_fireplace?: boolean
          has_internet?: boolean
          has_cable_tv?: boolean
          has_satellite_tv?: boolean
          has_phone_line?: boolean
          has_vent?: boolean
          has_cinema?: boolean
          has_dishwasher?: boolean
          has_gas_stove?: boolean
          has_electric_kettle?: boolean
          has_induction_oven?: boolean
          has_microwave?: boolean
          has_electric_oven?: boolean
          has_washing_machine?: boolean
          has_tv?: boolean
          has_coffee_machine?: boolean
          has_audio_system?: boolean
          has_heater?: boolean
          has_hair_dryer?: boolean
          has_refrigerator?: boolean
          has_vacuum_cleaner?: boolean
          has_dryer?: boolean
          has_iron?: boolean
          has_co_detector?: boolean
          has_smoke_detector?: boolean
          has_evacuation_ladder?: boolean
          has_fire_fighting_system?: boolean
          has_perimeter_cameras?: boolean
          has_alarm?: boolean
          has_live_protection?: boolean
          has_locked_entrance?: boolean
          has_locked_yard?: boolean
          near_bus_stop?: boolean
          near_bank?: boolean
          near_subway?: boolean
          near_supermarket?: boolean
          near_kindergarten?: boolean
          near_city_center?: boolean
          near_pharmacy?: boolean
          near_greenery?: boolean
          near_park?: boolean
          near_shopping_centre?: boolean
          near_school?: boolean
          near_old_district?: boolean
          allows_pets?: boolean
          allows_parties?: boolean
          allows_smoking?: boolean
          building_material?: string | null
          furniture_type?: string | null
          storeroom_type?: string | null
          heating_type?: string | null
          hot_water_type?: string | null
          parking_type?: string | null
          address_street?: string | null
          address_city?: string | null
          address_district?: string | null
          lat?: number
          lng?: number
          images?: string[]
          property_type?: string | null
          listing_type?: string | null
          plan?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          project_name?: string | null
          price_per_m2?: number | null
          frais_agence?: number | null
          charges_mensuelles?: number | null
          taxe_fonciere?: number | null
          dpe_classe_energie?: string | null
          dpe_consommation?: number | null
          ges_classe_gaz?: string | null
          ges_emission?: number | null
          nom_agence?: string | null
          reference_annonce?: string | null
          nombre_photos?: number
          lien_visite_virtuelle?: string | null
          date_publication?: string | null
          date_mise_a_jour?: string | null
          code_postal?: string | null
          surface_balcon_terrasse?: number | null
          parking_box?: number | null
          cave?: boolean
          nombre_etages_immeuble?: number | null
          annee_construction?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          phone_number?: string | null
          contact_email?: string | null
          instagram_handle?: string | null
          facebook_url?: string | null
          twitter_handle?: string | null
          reference_number?: string | null
          cadastral_code?: string | null
          title?: string
          description?: string | null
          price?: number
          currency?: string
          m2?: number | null
          beds?: number
          baths?: number
          rooms?: number | null
          year_built?: number | null
          condition?: string | null
          status?: string | null
          featured?: boolean
          terrace_area?: number | null
          kitchen_type?: string | null
          ceiling_height?: number | null
          floor_level?: number | null
          total_floors?: number | null
          amenities?: string[]
          equipment?: string[]
          internet_tv?: string[]
          storage?: string[]
          security?: string[]
          nearby_places?: string[]
          online_services?: string[]
          has_elevator?: boolean
          has_ventilation?: boolean
          has_air_conditioning?: boolean
          is_accessible?: boolean
          has_gas?: boolean
          has_loggia?: boolean
          has_fireplace?: boolean
          has_internet?: boolean
          has_cable_tv?: boolean
          has_satellite_tv?: boolean
          has_phone_line?: boolean
          has_vent?: boolean
          has_cinema?: boolean
          has_dishwasher?: boolean
          has_gas_stove?: boolean
          has_electric_kettle?: boolean
          has_induction_oven?: boolean
          has_microwave?: boolean
          has_electric_oven?: boolean
          has_washing_machine?: boolean
          has_tv?: boolean
          has_coffee_machine?: boolean
          has_audio_system?: boolean
          has_heater?: boolean
          has_hair_dryer?: boolean
          has_refrigerator?: boolean
          has_vacuum_cleaner?: boolean
          has_dryer?: boolean
          has_iron?: boolean
          has_co_detector?: boolean
          has_smoke_detector?: boolean
          has_evacuation_ladder?: boolean
          has_fire_fighting_system?: boolean
          has_perimeter_cameras?: boolean
          has_alarm?: boolean
          has_live_protection?: boolean
          has_locked_entrance?: boolean
          has_locked_yard?: boolean
          near_bus_stop?: boolean
          near_bank?: boolean
          near_subway?: boolean
          near_supermarket?: boolean
          near_kindergarten?: boolean
          near_city_center?: boolean
          near_pharmacy?: boolean
          near_greenery?: boolean
          near_park?: boolean
          near_shopping_centre?: boolean
          near_school?: boolean
          near_old_district?: boolean
          allows_pets?: boolean
          allows_parties?: boolean
          allows_smoking?: boolean
          building_material?: string | null
          furniture_type?: string | null
          storeroom_type?: string | null
          heating_type?: string | null
          hot_water_type?: string | null
          parking_type?: string | null
          address_street?: string | null
          address_city?: string
          address_district?: string | null
          lat?: number
          lng?: number
          images?: string[]
          property_type?: string | null
          listing_type?: string | null
          plan?: string | null
          agent_name?: string | null
          agent_phone?: string | null
          project_name?: string | null
          price_per_m2?: number | null
          frais_agence?: number | null
          charges_mensuelles?: number | null
          taxe_fonciere?: number | null
          dpe_classe_energie?: string | null
          dpe_consommation?: number | null
          ges_classe_gaz?: string | null
          ges_emission?: number | null
          nom_agence?: string | null
          reference_annonce?: string | null
          nombre_photos?: number
          lien_visite_virtuelle?: string | null
          date_publication?: string | null
          date_mise_a_jour?: string | null
          code_postal?: string | null
          surface_balcon_terrasse?: number | null
          parking_box?: number | null
          cave?: boolean
          nombre_etages_immeuble?: number | null
          annee_construction?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ancillary_services: {
        Row: {
          id: string
          property_id: string | null
          service_type: string
          description: string | null
          estimated_cost: number | null
          provider_name: string | null
          provider_contact: Json | null
          status: string
          requested_at: string
          scheduled_date: string | null
          completed_at: string | null
          metadata: Json | null
          requested_by: string | null
          created_at: string
          updated_at: string
          end_date: string | null
          start_date: string
          is_active: boolean
        }
        Insert: {
          id?: string
          property_id?: string | null
          service_type: string
          description?: string | null
          estimated_cost?: number | null
          provider_name?: string | null
          provider_contact?: Json | null
          status?: string
          requested_at?: string
          scheduled_date?: string | null
          completed_at?: string | null
          metadata?: Json | null
          requested_by?: string | null
          created_at?: string
          updated_at?: string
          end_date?: string | null
          start_date?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          property_id?: string | null
          service_type?: string
          description?: string | null
          estimated_cost?: number | null
          provider_name?: string | null
          provider_contact?: Json | null
          status?: string
          requested_at?: string
          scheduled_date?: string | null
          completed_at?: string | null
          metadata?: Json | null
          requested_by?: string | null
          created_at?: string
          updated_at?: string
          end_date?: string | null
          start_date?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ancillary_services_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ancillary_services_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      property_images: {
        Row: {
          id: string
          property_id: string | null
          image_url: string
          is_primary: boolean
        }
        Insert: {
          id?: string
          property_id?: string | null
          image_url: string
          is_primary?: boolean
        }
        Update: {
          id?: string
          property_id?: string | null
          image_url?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      kitchen_type: "american" | "open" | "closed"
      listing_type: "sale" | "rent" | "rent_by_day" | "auction"
      property_condition: "new" | "good" | "needs_renovation"
      property_status: "free" | "under_caution" | "under_construction"
      property_type: "house" | "apartment" | "land" | "commercial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      kitchen_type: ["american", "open", "closed"],
      listing_type: ["sale", "rent", "rent_by_day"],
      property_condition: ["new", "good", "needs_renovation"],
      property_status: ["free", "under_caution", "under_construction"],
      property_type: ["house", "apartment", "land", "commercial"],
    },
  },
} as const;

// Supabase Client Configuration
const SUPABASE_URL = "https://bgvqyhmaqujkaflaclyh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndnF5aG1hcXVqa2FmbGFjbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTU2OTgsImV4cCI6MjA3NzUzMTY5OH0.sEArm4c-f0LMcNVA-wdbKMpX5gfw9kANIZVgjUREw3M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
