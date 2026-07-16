import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { createCategory, fetchCategories } from '@/state/category/categorySlice';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { subCategorySchema} from './AddSubCategorySchema';
import type {SubCategoryFormData} from './AddSubCategorySchema';

interface AddSubCategoryFormProps {
  onFinished: () => void;
}

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

const AddSubCategoryForm: React.FC<AddSubCategoryFormProps> = ({ onFinished }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.category);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const form = useForm<SubCategoryFormData>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: { en: "", sr: "" },
      parent: "",
    },
  });

  const onSubmit = async (data: SubCategoryFormData) => {
    setApiError(null);
    try {
      await dispatch(createCategory({
        name: data.name,
        slug: generateSlug(data.name.en),
        parent: data.parent,
      })).unwrap();
    // Nakon uspješnog kreiranja, ponovo dohvatimo sve kategorije
    dispatch(fetchCategories());
      form.reset();
      onFinished();
    } catch (err: any) {
      setApiError(err.message || 'Došlo je do greške prilikom dodavanja podkategorije.');
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}
        <FormField
          control={form.control}
          name="parent"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Glavna kategorija</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={categoriesLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={categoriesLoading ? "Učitavanje..." : "Izaberi glavnu kategoriju"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat?.name?.sr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="name.en" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Ime podkategorije (Engleski)</FormLabel>
            <FormControl><Input placeholder="e.g. Fresh Vegetables" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="name.sr" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg">Ime podkategorije (Srpski)</FormLabel>
            <FormControl><Input placeholder="Npr. Sveže povrće" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400">
          {form.formState.isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
          <span>Dodaj podkategoriju</span>
        </Button>
      </form>
    </Form>
  );
};

export default AddSubCategoryForm;