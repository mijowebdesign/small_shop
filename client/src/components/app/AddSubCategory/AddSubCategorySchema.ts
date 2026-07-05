import { z } from 'zod';

export const subCategorySchema = z.object({
  name: z.object({
    en: z.string().min(2, { message: "English name must be at least 2 characters." }),
    sr: z.string().min(2, { message: "Serbian name must be at least 2 characters." }),
  }),
  parent: z.string().min(1, { message: "You must select a parent category." }),
});

export type SubCategoryFormData = z.infer<typeof subCategorySchema>;