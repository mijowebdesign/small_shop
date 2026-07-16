import React, { useEffect } from "react";
import { SidebarFilters } from "@/components/app/SidebarFilters";
import ProductCard from "@/components/app/ProductCard";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import type { Product } from "@/types/Products";
import { fetchProducts, resetFilters } from "@/state/product/productSlice";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, currentPage, totalPages, filters } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);
  const { categorySlug } = useParams();

  const PRODUTS_PER_PAGE = 9;

  const currentCategory = categories.find(cat => cat.slug === categorySlug);
  const categoryId = currentCategory?.id;

  useEffect(() => {
    // Resetuj filtere kada se promeni glavna kategorija
    dispatch(resetFilters());
  }, [categorySlug, dispatch]);

  useEffect(() => {
    if (categoryId) {
      dispatch(
        fetchProducts({
          page: 1,
          limit: PRODUTS_PER_PAGE,
          categoryId: categoryId,
          subcategories: filters.subcategories,
          priceRange: filters.priceRange,
        })
      );
    }
  }, [dispatch, categoryId, filters]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && categoryId) {
      dispatch(
        fetchProducts({
          page,
          limit: PRODUTS_PER_PAGE,
          categoryId: categoryId,
          subcategories: filters.subcategories,
          priceRange: filters.priceRange,
        })
      );
    }
  };

  if (loading || (categories.length === 0 && !products.length)) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!categoryId && !loading) return (
    <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
      Kategorija nije pronađena.
    </div>
  );

  return (
    <>
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-1 h-full min-h-screen">
        <SidebarFilters />

        <main className="flex-1 py-8 mb-4 flex flex-col">
          <div className="flex flex-wrap justify-start mb-8 gap-4 flex-1">
            {products.length > 0 ? (
              products
                .filter((product): product is Product & { _id: string } => !!product._id)
                .map((product: Product & { _id: string }) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    title={product.title}
                    categoryName={product?.mainCategory?.name?.sr || ""}
                    imageUrl={product.imageUrl}
                    price={product.price}
                  />
                ))
            ) : (
              <div className="w-full text-center py-10 text-gray-500">
                No products found.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-auto py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Products;
