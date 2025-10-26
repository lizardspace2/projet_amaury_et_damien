import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreatePropertyInput } from '@/lib/api/properties';


const formSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  price: z.coerce.number().positive("Le prix doit être un nombre positif"),
  beds: z.coerce.number().int().min(0, "Le nombre de lits doit être supérieur ou égal à 0").optional(),
  baths: z.coerce.number().int().min(0, "Le nombre de salles de bain doit être supérieur ou égal à 0").optional(),
  m2: z.coerce.number().positive("La surface doit être un nombre positif"),
  year_built: z.coerce.number().int().min(1800, "L'année doit être 1800 ou ultérieure").max(new Date().getFullYear(), "L'année ne peut pas être dans le futur"),
  cadastral_code: z.string().optional(),
  condition: z.enum(["newly_renovated", "under_renovation", "white_frame", "green_frame", "not_renovated", "black_frame", "old_renovation"]),
  status: z.enum(["available", "pending", "sold", "new_building_under_construction", "old_building"]).default("available"),
  kitchen_type: z.enum(["isolated", "outside", "studio"]).optional(),
  ceiling_height: z.coerce.number().min(2, "La hauteur sous plafond doit être d'au moins 2 mètres").max(7, "La hauteur sous plafond doit être d'au plus 7 mètres").optional(),
  terrace_area: z.coerce.number().optional(),
  floor_level: z.coerce.number().optional(),
  total_floors: z.coerce.number().optional(),
  featured: z.boolean().default(false),
  rooms: z.coerce.number().int().min(0, "Le nombre de pièces doit être supérieur ou égal à 0").optional(),
  // SeLoger fields
  frais_agence: z.coerce.number().optional(),
  charges_mensuelles: z.coerce.number().optional(),
  taxe_fonciere: z.coerce.number().optional(),
  dpe_classe_energie: z.string().optional(),
  dpe_consommation: z.coerce.number().optional(),
  ges_classe_gaz: z.string().optional(),
  ges_emission: z.coerce.number().optional(),
  surface_balcon_terrasse: z.coerce.number().optional(),
  parking_box: z.coerce.number().int().optional(),
  cave: z.boolean().default(false),
  nombre_etages_immeuble: z.coerce.number().int().optional(),
  annee_construction: z.coerce.number().int().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPropertyStep2Props {
  onBack: () => void;
  onNext: (data: FormValues & { currency: string }) => void;
  initialData?: Partial<CreatePropertyInput>;
}

const AddPropertyStep2 = ({ onBack, onNext, initialData }: AddPropertyStep2Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || undefined,
      beds: initialData?.beds || undefined,
      baths: initialData?.baths || undefined,
      m2: initialData?.m2 || undefined,
      year_built: initialData?.year_built || new Date().getFullYear(),
      cadastral_code: initialData?.cadastral_code || "",
      condition: initialData?.condition || "newly_renovated",
      status: initialData?.status || "available",
      kitchen_type: initialData?.kitchen_type || undefined,
      ceiling_height: initialData?.ceiling_height || undefined,
      terrace_area: initialData?.terrace_area || undefined,
      floor_level: initialData?.floor_level || undefined,
      total_floors: initialData?.total_floors || undefined,
      featured: initialData?.featured || false,
      rooms: initialData?.rooms || undefined,
      frais_agence: initialData?.frais_agence || undefined,
      charges_mensuelles: initialData?.charges_mensuelles || undefined,
      taxe_fonciere: initialData?.taxe_fonciere || undefined,
      dpe_classe_energie: initialData?.dpe_classe_energie || undefined,
      dpe_consommation: initialData?.dpe_consommation || undefined,
      ges_classe_gaz: initialData?.ges_classe_gaz || undefined,
      ges_emission: initialData?.ges_emission || undefined,
      surface_balcon_terrasse: initialData?.surface_balcon_terrasse || undefined,
      parking_box: initialData?.parking_box || undefined,
      cave: initialData?.cave || false,
      nombre_etages_immeuble: initialData?.nombre_etages_immeuble || undefined,
      annee_construction: initialData?.annee_construction || undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      onNext({ ...data, currency: "EUR" });
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">{"Informations de base"}</h2>
            <p className="text-muted-foreground mt-2">
              {"Veuillez fournir les détails essentiels de votre propriété."}
            </p>
          </div>

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{"Titre de la propriété"}*</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Appartement spacieux au centre-ville" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Description de la propriété"}*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez votre propriété en détail..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Prix"}*</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Entrez le prix"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? undefined : value);
                        }}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                      EUR
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="year_built"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Année de construction"}*</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cadastral_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Code cadastral"}</FormLabel>
                  <FormControl>
                    <Input placeholder="Code cadastral (facultatif)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="beds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Chambres"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Salles de bain"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="m2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Surface (m²)"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nombre de pièces"}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Entrez le nombre de pièces"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"État de la propriété"}*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'état" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="newly_renovated">{"Rénové récemment"}</SelectItem>
                      <SelectItem value="under_renovation">{"En cours de rénovation"}</SelectItem>
                      <SelectItem value="white_frame">{"Cadre blanc"}</SelectItem>
                      <SelectItem value="green_frame">{"Cadre vert"}</SelectItem>
                      <SelectItem value="not_renovated">{"Non rénové"}</SelectItem>
                      <SelectItem value="black_frame">{"Cadre noir"}</SelectItem>
                      <SelectItem value="old_renovation">{"Ancienne rénovation"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Statut de la propriété"}*</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">{"Disponible"}</SelectItem>
                      <SelectItem value="pending">{"En attente"}</SelectItem>
                      <SelectItem value="sold">{"Vendu"}</SelectItem>
                      <SelectItem value="new_building_under_construction">{"Nouvelle construction en cours"}</SelectItem>
                      <SelectItem value="old_building">{"Ancien bâtiment"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kitchen_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Type de cuisine"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type de cuisine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="isolated">{"Isolée"}</SelectItem>
                      <SelectItem value="outside">{"Extérieure"}</SelectItem>
                      <SelectItem value="studio">{"Studio"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ceiling_height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Hauteur sous plafond"}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.05"
                      min="2"
                      max="7"
                      placeholder="e.g. 2.75"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          field.onChange(undefined);
                          form.clearErrors("ceiling_height");
                        } else {
                          const numValue = parseFloat(value);
                          if (numValue < 2 || numValue > 7) {
                            form.setError("ceiling_height", {
                              type: "manual",
                              message: "La hauteur sous plafond doit être entre 2 et 7 mètres.",
                            });
                          } else {
                            form.clearErrors("ceiling_height");
                          }
                          field.onChange(numValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terrace_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Surface de la terrasse"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floor_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Niveau de l'étage"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_floors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nombre total d'étages"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{"Mettre en avant"}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-lg font-medium mt-6">Informations financières</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="frais_agence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Frais d'agence"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Frais d'agence en €" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="charges_mensuelles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Charges mensuelles"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Charges mensuelles en €" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxe_fonciere"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Taxe foncière (annuelle)"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Taxe foncière en €" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-lg font-medium mt-6">Diagnostic de performance énergétique (DPE)</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dpe_classe_energie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Classe énergétique DPE"}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="E">E</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                        <SelectItem value="G">G</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dpe_consommation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Consommation énergétique (kWh/m²/an)"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 120" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ges_classe_gaz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Classe émissions GES"}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="E">E</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                        <SelectItem value="G">G</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ges_emission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Émissions GES (kg CO₂/m²/an)"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 15" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h3 className="text-lg font-medium mt-6">Informations supplémentaires</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="surface_balcon_terrasse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Surface balcon/terrasse (m²)"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Surface en m²" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parking_box"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nombre de places de parking/box"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Nombre de places" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre_etages_immeuble"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nombre d'étages de l'immeuble"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Nombre d'étages" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="annee_construction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Année de construction du bâtiment"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 1995" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : value);
                      }}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cave"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{"Cave disponible"}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            {"Retour"}
          </Button>
          <Button type="submit">{"Étape suivante"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPropertyStep2;