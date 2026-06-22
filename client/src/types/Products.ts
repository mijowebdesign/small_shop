export interface Category {
    id: string;
    name?: {
        sr: string;
        en: string;
    };
    slug?: string;
    description?: {
        en: string;
        sr: string;
    };
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

export interface PaginatedProducts {
    products: Product[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
}