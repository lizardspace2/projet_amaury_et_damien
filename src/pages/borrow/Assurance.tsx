import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse e-mail invalide."),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres."),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères.").max(500, "Le message ne peut pas dépasser 500 caractères."),
});

type FormValues = z.infer<typeof formSchema>;

const Assurance = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast.success("Votre demande a été envoyée avec succès. Un courtier vous contactera bientôt.");
    form.reset();
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center">Assurance de prêt : en savoir plus</h1>
            <p className="text-lg text-slate-600 mb-8 text-center">Remplissez le formulaire ci-dessous pour être contacté par un de nos courtiers partenaires et obtenir les meilleures offres d'assurance de prêt.</p>
            <Card>
                <CardHeader>
                    <CardTitle>Prendre contact avec un courtier</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom complet</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Votre nom complet" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Votre adresse e-mail" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="Votre numéro de téléphone" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Décrivez brièvement votre projet..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Envoyer la demande</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Assurance;