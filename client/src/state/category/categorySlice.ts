import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Category } from '@/types/Products';
import { getCategories, getSubCategoriesByCategoryId, createCategory as createCategoryApi } from '@/services/categoryService';

interface CategoryState {
    categories: Category[];
    selectedSubCategories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    selectedSubCategories: [],
    loading: false,
    error: null,
};

export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
    return await getCategories();
});

export const fetchSubCategoriesByCategoryId = createAsyncThunk('category/fetchSubCategoriesByCategoryId', async (id: string) => {
    return await getSubCategoriesByCategoryId(id);
   
});

export const createCategory = createAsyncThunk(
    'category/createCategory',
    async (categoryData: { name: { en:string,sr: string }, slug: string, parent?: string }, { rejectWithValue }) => {
        try {
           
            const newCategory = await createCategoryApi(categoryData);
            return newCategory;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Greška pri kreiranju kategorije');
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        }   
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Greška pri učitavanju kategorija';
            })
            .addCase(fetchSubCategoriesByCategoryId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCategoriesByCategoryId.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedSubCategories = action.payload || [];
            })
            .addCase(fetchSubCategoriesByCategoryId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Greška pri učitavanju podkategorija';
            })
            // Slučajevi za createCategory thunk
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                // Ne radimo ništa ovdje, jer će fetchCategories biti pozvan iz komponente
                // da osvježi cijelu listu.
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || action.error.message || 'Greška pri kreiranju kategorije';
            });
    }
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
