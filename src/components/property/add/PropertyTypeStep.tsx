import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreatePropertyInput, ListingType } from "@/lib/api/properties";

const formSchema = z.object({
  listing_type: z.enum(["sale", "rent", "rent_by_day", "lease", "auction"], {
    required_error: "Veuillez sélectionner un type d'annonce",
  }),
  property_type: z.enum(["house", "apartment", "land", "commercial"], {
    required_error: "Veuillez sélectionner un type de propriété",
  }),
});

interface PropertyTypeStepProps {
  onNext: (data: Partial<CreatePropertyInput>) => void;
  onBack?: () => void;
  initialData?: Partial<CreatePropertyInput>;
  fixedListingType?: ListingType;
}

const PropertyTypeStep: React.FC<PropertyTypeStepProps> = ({ onNext, onBack, initialData, fixedListingType }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listing_type: fixedListingType || initialData?.listing_type,
      property_type: initialData?.property_type,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        listing_type: fixedListingType || initialData.listing_type,
        property_type: initialData.property_type,
      });
    }
    if (fixedListingType) {
        form.setValue("listing_type", fixedListingType);
    }
  }, [initialData, form, fixedListingType]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">{"Type d'annonce"}</h2>
            <p className="text-muted-foreground mt-2">
              {"Sélectionnez le type de transaction et le type de propriété."}
            </p>
          </div>

          {!fixedListingType && <FormField
            control={form.control}
            name="listing_type"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>{"Type d'annonce"}*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="sale" id="sale" className="peer sr-only" />
                      <Label
                        htmlFor="sale"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-medium">{"À vendre"}</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="rent" id="rent" className="peer sr-only" />
                      <Label
                        htmlFor="rent"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-medium">{"À louer"}</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="rent_by_day" id="rent_by_day" className="peer sr-only" />
                      <Label
                        htmlFor="rent_by_day"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-medium">{"Location journalière"}</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="lease" id="lease" className="peer sr-only" />
                      <Label
                        htmlFor="lease"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-medium">{"Bail commercial"}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />}

          <FormField
            control={form.control}
            name="property_type"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>{"Type de propriété"}*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="house" id="house" className="peer sr-only" />
                      <Label
                        htmlFor="house"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-medium">{"Maison"}</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="apartment" id="apartment" className="peer sr-only" />
                      <Label
                        htmlFor="apartment"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-medium">{"Appartement"}</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="land" id="land" className="peer sr-only" />
                      <Label
                        htmlFor="land"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-medium">{"Terrain"}</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="commercial" id="commercial" className="peer sr-only" />
                      <Label
                        htmlFor="commercial"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="font-medium">{"Propriété commerciale"}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              {"Retour"}
            </Button>
          )}
          <Button type="submit">{"Suivant"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyTypeStep;
