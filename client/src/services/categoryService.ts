import { getByPathAndParams } from './httpClient';
import type { Category } from '@/types/Products';

export const getCategories = async (): Promise<Category[]> => {
  const response = await getByPathAndParams<Category[]>('api/categories');
  return response.data;
};

export const getSubCategoriesByCategoryId = async (id: string): Promise<Category[] | undefined> => {
  const response = await getByPathAndParams<Category[]>('api/categories/sub/' + id);
  return response.data;
};
