import React, { useState, useEffect } from 'react';
import type { Product, Category } from '@/types/Products';
import { Save, Loader2, Tag, Euro } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { fetchCategories, fetchSubCategoriesByCategoryId } from '@/state/category/categorySlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductDetailsFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  setImageUrl?: (url: string) => void;
}

const ProductDetailsForm: React.FC<ProductDetailsFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  setImageUrl,
}) => {
  const dispatch = useAppDispatch();
  const { categories, selectedSubCategories, loading: categoriesLoading } = useAppSelector((state) => state.category);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    mainCategory: (initialData?.mainCategory as any)?.id || (initialData?.mainCategory as any)?._id || "",
    subCategory: (initialData?.subCategory as any)?.id || (initialData?.subCategory as any)?._id || (typeof initialData?.subCategory === 'string' ? initialData.subCategory : ""),
    price: initialData?.price || 0,
  });

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const selectedMainCategoryId = typeof formData.mainCategory === 'string' ? formData.mainCategory : (formData.mainCategory as any)?.id;

  useEffect(() => {
    if (selectedMainCategoryId) {
      dispatch(fetchSubCategoriesByCategoryId(selectedMainCategoryId));
    }
  }, [dispatch, selectedMainCategoryId]);

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mainCategory: value as any,
      subCategory: "", // Reset subcategory when main category changes
    }));
  };

  const handleSubCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subCategory: value
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
    if (name === 'imageUrl' && setImageUrl) {
      setImageUrl(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Filter main categories (those without a parent)
  const mainCategories = categories.filter(cat => !cat.parent);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData?._id ? 'Izmeni proizvod' : 'Novi proizvod'}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Otkaži
          </button>
        )}
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-1">Naslov</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-1">Opis</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-lg font-medium text-gray-700 mb-1">
            <Tag className="w-4 h-4 mr-2" />
            Kategorija
          </label>
          <Select
            onValueChange={handleCategoryChange}
            value={selectedMainCategoryId || ''}
            disabled={categoriesLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={categoriesLoading ? "Učitavanje..." : "Izaberi kategoriju"} />
            </SelectTrigger>
            <SelectContent>
              {mainCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat?.name?.sr || ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="flex items-center text-lg font-medium text-gray-700 mb-1">
            <Tag className="w-4 h-4 mr-2" />
            Podkategorija
          </label>
          <Select
            onValueChange={handleSubCategoryChange}
            value={formData.subCategory || ''}
            disabled={categoriesLoading || !selectedMainCategoryId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={!selectedMainCategoryId ? "Prvo izaberi kategoriju" : "Izaberi podkategoriju"} />
            </SelectTrigger>
            <SelectContent>
            {selectedSubCategories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat?.name?.sr || ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="col-span-2">
          <label className="flex items-center text-lg font-medium text-gray-700 mb-1">
            <Euro className="w-4 h-4 mr-2" />
            Cena
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-1">URL Slike</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
        {initialData?._id ? 'Sačuvaj promene' : 'Dodaj proizvod'}
      </button>
    </form>
  );
};

export default ProductDetailsForm;
