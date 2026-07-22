import { 
    getByPathAndParams, 
    postByPathAndData, 
    putByPathAndData, 
    deleteByPath 
} from './httpClient';
import type { Product, PaginatedProducts, LandingData } from '@/types/Products';

export type GetProductsParams = {
    page?: number;
    limit?: number;
    categoryId?: string;
    subcategories?: string[];
    priceRange?: [number, number];
};
export const getProducts = async (params: GetProductsParams = {}): Promise<PaginatedProducts> => {
    const { priceRange, ...otherParams } = params;
    const queryParams: Record<string, any> = { ...otherParams };

    if (priceRange) {
        queryParams.price_gte = priceRange[0];
        queryParams.price_lte = priceRange[1];
    }

    const response = await getByPathAndParams<PaginatedProducts>('api/products', queryParams);
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await getByPathAndParams<Product>(`api/products/${id}`);
    return response.data;
};

export const createProduct = async (data: Partial<Product>): Promise<Product> => {
    const response = await postByPathAndData<Product>('api/products', data);
    return response.data;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await putByPathAndData<Product>(`api/products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
    await deleteByPath(`api/products/${id}`);
};

export const getLandingPageProducts = async (): Promise<LandingData> => {
    const response = await getByPathAndParams<LandingData>('api/landing');
    return response.data;
};