import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/Products';
import { getProducts, getProductById, updateProduct as updateProductApi, deleteProduct as deleteProductApi, createProduct as createProductApi } from '@/services/productService';

interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
    filters: {
        subcategories: string[];
        priceRange: [number, number];
    };
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}

const DEFAULT_PRICE_RANGE: [number, number] = [0, 10000];

const initialState: ProductState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    filters: {
        subcategories: [],
        priceRange: DEFAULT_PRICE_RANGE,
    },
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params: { 
    page: number; 
    limit: number; 
    categoryId?: string;
    subcategories?: string[];
    priceRange?: [number, number];
}) => {
    const data = await getProducts(params);
    return data;
});

export const fetchProductById = createAsyncThunk('product/fetchProductById', async (id: string) => {
    return await getProductById(id);
});

export const updateProduct = createAsyncThunk('product/updateProduct', async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const updatedProduct = await updateProductApi(id, data);
    return updatedProduct;
});

export const createProduct = createAsyncThunk('product/createProduct', async (data: Partial<Product>) => {
    const newProduct = await createProductApi(data);
    return newProduct;
});

export const deleteProduct = createAsyncThunk('product/deleteProduct', async (id: string) => {
    await deleteProductApi(id);
    return id;
});

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setSelectedProduct(state, action: PayloadAction<Product | null>) {
            state.selectedProduct = action.payload;
        },
        setSubCategoryFilters(state, action: PayloadAction<string[]>) {
            state.filters.subcategories = action.payload;
        },
        setPriceFilter(state, action: PayloadAction<[number, number]>) {
            state.filters.priceRange = action.payload;
        },
        resetFilters(state) {
            state.filters.subcategories = [];
            state.filters.priceRange = DEFAULT_PRICE_RANGE;
        },
        clearProductError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Greška pri učitavanju proizvoda';
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Greška pri učitavanju detalja proizvoda';
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                if (state.selectedProduct && state.selectedProduct._id === action.payload._id) {
                    state.selectedProduct = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.error = action.error.message || 'Greška pri ažuriranju proizvoda';
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Greška pri dodavanju proizvoda';
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p._id !== action.payload);
                if (state.selectedProduct && state.selectedProduct._id === action.payload) {
                    state.selectedProduct = null;
                }
            });
    }
});

export const { setSelectedProduct, setSubCategoryFilters, setPriceFilter, resetFilters, clearProductError } = productSlice.actions;
export default productSlice.reducer;
