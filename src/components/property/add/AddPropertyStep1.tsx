import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyType, ListingType, PropertyStatus, PropertyCondition, KitchenType } from "@/types/property";

export type CreatePropertyInput = {
  title?: string;
  description?: string;
  price?: number;
  phone_number?: string;
  cadastral_code?: string;
  reference_number?: string;
  property_type?: PropertyType;
  listing_type?: ListingType;
  status?: PropertyStatus;
  condition?: PropertyCondition;
  plan?: string;
  address_street?: string;
  address_city?: string;
  address_district?: string;
  lat?: number;
  lng?: number;
  beds?: number;
  baths?: number;
  m2?: number;
  rooms?: number;
  [key: string]: any;
};

const propertyStep1Schema = z.object({
  phone_number: z.string().min(6, "Numéro de téléphone trop court").max(20, "Numéro de téléphone trop long"),
  contact_email: z.string().email("Adresse e-mail invalide").optional().or(z.literal('')),
  instagram_handle: z.string().optional(),
  facebook_url: z.string().url("URL invalide").optional().or(z.literal('')),
  twitter_handle: z.string().optional(),
  reference_number: z.string().optional(),
  nom_agence: z.string().optional(),
  reference_annonce: z.string().optional(),
  lien_visite_virtuelle: z.string().url("URL invalide").optional().or(z.literal('')),
});

interface AddPropertyStep1Props {
  onNext: (data: Partial<CreatePropertyInput>) => void;
  onBack?: () => void;
  initialData?: Partial<CreatePropertyInput>;
}

const AddPropertyStep1: React.FC<AddPropertyStep1Props> = ({ onNext, onBack, initialData }) => {
  const form = useForm<z.infer<typeof propertyStep1Schema>>({
    resolver: zodResolver(propertyStep1Schema),
    defaultValues: {
      phone_number: initialData?.phone_number || '',
      contact_email: initialData?.contact_email || '',
      instagram_handle: initialData?.instagram_handle || '',
      facebook_url: initialData?.facebook_url || '',
      twitter_handle: initialData?.twitter_handle || '',
      reference_number: initialData?.cadastral_code || '', // Assuming cadastral_code is used as reference_number
      nom_agence: initialData?.nom_agence || '',
      reference_annonce: initialData?.reference_annonce || '',
      lien_visite_virtuelle: initialData?.lien_visite_virtuelle || '',
    }
  });

  useEffect(() => {
    if (!initialData?.cadastral_code) {
      const generateReferenceNumber = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 7; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      };
      form.setValue('reference_number', generateReferenceNumber());
    }
  }, [form, initialData]);

  const onSubmit = (values: z.infer<typeof propertyStep1Schema>) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold">Informations supplémentaires</h2>
          <p className="text-muted-foreground mt-2">
            Fournissez des informations supplémentaires pour votre annonce.
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone*</FormLabel>
                <FormControl>
                  <Input placeholder="Votre numéro de contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de contact</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email pour les contacts" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de référence</FormLabel>
                <FormControl>
                  <Input placeholder="Référence interne" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="text-lg font-medium mt-6">Réseaux sociaux</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="instagram_handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom d'utilisateur Instagram" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebook_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="Lien vers votre profil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter_handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom d'utilisateur Twitter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-lg font-medium mt-6">Informations agence</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom_agence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'agence</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de votre agence immobilière" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference_annonce"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence annonce</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ANN-2024-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="lien_visite_virtuelle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lien visite virtuelle</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://example.com/tour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between mt-8">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
            >
              Retour
            </Button>
          )}
          <Button type="submit" className={onBack ? "" : "w-full"}>Suivant</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPropertyStep1;
