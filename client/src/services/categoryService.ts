import { getByPathAndParams, postByPathAndData } from './httpClient';
import type { Category } from '@/types/Products';

export const getCategories = async (): Promise<Category[]> => {
  const response = await getByPathAndParams<Category[]>('api/categories');
  return response.data;
};

export const getSubCategoriesByCategoryId = async (id: string): Promise<Category[] | undefined> => {
  const response = await getByPathAndParams<Category[]>('api/categories/sub/' + id);
  return response.data;
};

export const createCategory = async (categoryData: { name: { en:string,sr: string }, slug: string }): Promise<Category> => {
  const response = await postByPathAndData<Category>('api/categories', categoryData);
  return response.data;
};
