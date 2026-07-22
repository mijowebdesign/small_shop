
interface LocalizedText {
  en: string;
  sr: string;
}

export interface Category {
    id: string;
    name?: LocalizedText;
    slug?: string;
    description?: LocalizedText;
    parent?: string 
}



export interface Product {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    mainCategory: Category;
    subCategory: string | null;
    price: number;
}

// Jedna kategorija u okviru landing response-a
interface LandingCategory {
  name: LocalizedText;
  data: Partial<Product>[];
}

export interface LandingData {
  [slug: string]: LandingCategory;
}

export interface PaginatedProducts {
    products: Product[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
}