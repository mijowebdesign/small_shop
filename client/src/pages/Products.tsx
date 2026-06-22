import React, { useEffect, useState } from "react";
import { SidebarFilters } from "@/components/app/SidebarFilters";
import ProductCard from "@/components/app/ProductCard";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import type { Product } from "@/types/Products";
import { fetchProducts } from "@/state/product/productSlice";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useParams, useLocation} from "react-router-dom";
import { Loader2 } from "lucide-react";

const Products: React.FC = () => {
  const { products, loading, currentPage, totalPages } = useAppSelector(
    (state) => state.product
  );
  const { categories } = useAppSelector((state) => state.category);
  const { categorySlug } = useParams();
  const location = useLocation();
  const categoryIdFromState = location.state?.categoryId;

  const [pendingCategory, setPendingCategory] = useState(categorySlug);

  const PRODUTS_PER_PAGE = 9;

  const dispatch = useAppDispatch();

  useEffect(() => {
    setPendingCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    if (!categoryIdFromState) return;

    dispatch(
      fetchProducts({
        page: 1,
        limit: PRODUTS_PER_PAGE,
        categoryId: categoryIdFromState,
      })
    );
  }, [dispatch, categoryIdFromState]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(
        fetchProducts({
          page,
          limit: PRODUTS_PER_PAGE,
          categoryId: categoryIdFromState,
        })
      );
    }
  };

  const isTransitioning = pendingCategory !== categorySlug;
  const isCategoriesLoading = categories.length === 0;

  if (loading || isCategoriesLoading || isTransitioning) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!categoryIdFromState) return (
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
              products.map((product: Product) => (
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
