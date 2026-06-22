import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Category } from '@/types/Products';
import { getCategories, getSubCategoriesByCategoryId } from '@/services/categoryService';

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
            });
    }
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
