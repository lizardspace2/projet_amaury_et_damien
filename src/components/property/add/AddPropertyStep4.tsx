import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Images, MapPin } from "lucide-react";
import { CreatePropertyInput } from "@/lib/api/properties";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import LocationMap from "./LocationMap";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import Autocomplete from "@/components/Autocomplete";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES = 10;

const addressSchema = z.object({
  address: z.string().min(1, "L'adresse est requise"),
  lat: z.number(),
  lng: z.number(),
  code_postal: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddPropertyStep4Props {
  onBack: () => void;
  initialData: Partial<CreatePropertyInput>;
  isSubmitting: boolean;
  onNext: (data: Partial<CreatePropertyInput> & { existingImageUrls?: string[], removedImageUrls?: string[] }) => void;
}

const AddPropertyStep4 = ({
  onBack,
  initialData,
  isSubmitting,
  onNext
}: AddPropertyStep4Props) => {
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const totalImages = existingImageUrls.length + newImageFiles.length;

  useEffect(() => {
    if (initialData?.images && initialData.images.length > 0) {
      setExistingImageUrls(initialData.images as string[]);
      setPreviewUrls(initialData.images as string[]);
    }
  }, [initialData]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: initialData.address_street ? `${initialData.address_street}, ${initialData.address_district}, ${initialData.address_city}` : "",
      lat: initialData.lat || 45.764043,
      lng: initialData.lng || 4.835659,
      code_postal: initialData.code_postal || "",
    },
  });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      form.setValue("lat", place.geometry.location.lat());
      form.setValue("lng", place.geometry.location.lng());
    }
    if (place.address_components) {
      const address = {
        street: "",
        city: "",
        district: "",
        postalCode: "",
      };
      place.address_components.forEach((component) => {
        if (component.types.includes("route")) {
          address.street = component.long_name;
        }
        if (component.types.includes("locality")) {
          address.city = component.long_name;
        }
        if (component.types.includes("sublocality_level_1")) {
          address.district = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          address.postalCode = component.long_name;
        }
      });
      form.setValue("address", place.formatted_address || `${address.street}, ${address.district}, ${address.city}`);
      form.setValue("code_postal", address.postalCode);
      Object.assign(initialData, {
        address_street: address.street,
        address_city: address.city,
        address_district: address.district,
        code_postal: address.postalCode,
      });
    }
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Type de fichier non pris en charge.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "La taille du fichier dépasse la limite de 5 Mo.";
    }
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      if (existingImageUrls.length + newImageFiles.length + filesArray.length > MAX_IMAGES) {
        toast.error(`Vous ne pouvez pas télécharger plus de ${MAX_IMAGES} images.`);
        return;
      }

      const validFiles: File[] = [];
      const validPreviewUrls: string[] = [];

      filesArray.forEach(file => {
        const error = validateFile(file);
        if (error) {
          toast.error(error);
        }
        else {
          validFiles.push(file);
          validPreviewUrls.push(URL.createObjectURL(file));
        }
      });

      setNewImageFiles(prevFiles => [...prevFiles, ...validFiles]);
      setPreviewUrls(prevUrls => [...prevUrls, ...validPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    const allImages = [...existingImageUrls, ...newImageFiles];
    const removedItem = allImages[index];

    if (typeof removedItem === 'string') { // It's an existing image URL
      setRemovedImageUrls(prev => [...prev, removedItem]);
      setExistingImageUrls(prev => prev.filter(url => url !== removedItem));
    } else { // It's a new File object
      URL.revokeObjectURL(previewUrls[index]);
      setNewImageFiles(prev => prev.filter(file => file !== removedItem));
    }

    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setValue("lat", lat);
    form.setValue("lng", lng);
  };

  const handleAddressSelect = (address: string) => {
    form.setValue("address", address);
  };

  const handleSubmit = (data: AddressFormValues) => {
    const updatedData = {
      lat: data.lat,
      lng: data.lng,
      address_street: initialData.address_street,
      address_city: initialData.address_city,
      address_district: initialData.address_district,
      code_postal: data.code_postal,
      images: newImageFiles, // Only new files are passed here
      existingImageUrls: existingImageUrls, // Pass existing URLs to keep
      removedImageUrls: removedImageUrls, // Pass URLs to remove
    };
    onNext(updatedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold">{"Localisation et Photos"}</h2>
          <p className="text-muted-foreground mt-2">
            {"Dernière étape ! Ajoutez la localisation de votre propriété et quelques photos."}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{"Localisation de la propriété"}</h3>

            <div className="mb-6">
              <FormLabel>{"Localisation sur la carte"}</FormLabel>
              <LocationMap
                initialLat={form.watch("lat")}
                initialLng={form.watch("lng")}
                onLocationSelect={handleLocationSelect}
                onAddressSelect={handleAddressSelect}
              />
            </div>

            <Autocomplete
              label="Adresse"
              placeholder="Entrez l'adresse de la propriété"
              onPlaceChanged={handlePlaceSelect}
              value={form.watch("address")}
              onChange={(value) => form.setValue("address", value)}
            />

            <div className="mt-4">
              <FormField
                control={form.control}
                name="code_postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 75001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <Label>{"Notes de localisation"}</Label>
              <Textarea
                placeholder="Ex: Près du parc central, à côté de l'école primaire..."
                className="min-h-24"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{"Photos de la propriété"}</h3>
              <span className="text-sm text-muted-foreground">
                {totalImages}/{MAX_IMAGES} {"images"}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('images')?.click()}
                  disabled={totalImages >= MAX_IMAGES}
                >
                  <Images className="mr-2 h-4 w-4" />
                  {"Ajouter des photos"}
                </Button>
                <Input
                  id="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={totalImages >= MAX_IMAGES}
                />
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={url}
                        alt={`Photo de la propriété ${index + 1}`}
                        className="h-full w-full object-cover rounded-md cursor-pointer"
                        onClick={() => {
                          setPreviewImage(url);
                          setPreviewDialogOpen(true);
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            {"Retour"}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || totalImages === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {"Publication..."}
              </>
            ) : (
              "Publier l'annonce"
            )}
          </Button>
        </div>

        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{"Aperçu de l'image"}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img src={previewImage} alt={"Aperçu de l'image"} className="max-h-[70vh] object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default AddPropertyStep4;
