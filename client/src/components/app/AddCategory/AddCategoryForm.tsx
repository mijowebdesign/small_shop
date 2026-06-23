import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/state/hooks';
import { createCategory } from '@/state/category/categorySlice';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { categorySchema } from './AddCategorySchema';
import { z } from 'zod';


interface AddCategoryFormProps {
  onFinished: () => void;
}

type CategoryFormData = z.infer<typeof categorySchema>;

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // Zameni razmake sa -
    .replace(/[^\w\-]+/g, ''); // Ukloni sve karaktere koji nisu reči ili -
};

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onFinished }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // 2. Inicijalizacija react-hook-form
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: { en: "", sr: "" },
    },
  });

  // 3. onSubmit funkcija koju poziva react-hook-form
  const onSubmit = async (data: CategoryFormData) => { 
    setApiError(null);
    try {
      await dispatch(createCategory({ 
        name: data.name, 
        slug: generateSlug(data.name.en) 
      })).unwrap();
    
      form.reset();
      onFinished();
    } catch (err: any) {
      setApiError(err.message || 'Došlo je do greške prilikom dodavanja kategorije.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}
        <FormField
          control={form.control}
          name="name.en"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Ime kategorije (Engleski)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Fruits" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name.sr"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Ime kategorije (Srpski)</FormLabel>
              <FormControl>
                <Input placeholder="Npr. Voće" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
        >
          {form.formState.isSubmitting 
            ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
            : <Save className="mr-2 h-5 w-5" />}
          <span>Dodaj kategoriju</span>
        </Button>
      </form>
    </Form>
  );
};

export default AddCategoryForm;