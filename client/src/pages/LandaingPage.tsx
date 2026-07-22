import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchLandingPageProducts } from "@/state/product/productSlice";
import ProductCard from "@/components/app/ProductCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LandingPage: React.FC = () => {


  
  const dispatch = useAppDispatch();
    const { landingPageProducts, loading} = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchLandingPageProducts());
  }, [dispatch]);

 
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const checkIfProductsExist = Object.values(landingPageProducts).some((category) => category.data.length > 0)

  return (
    <>
      <div className="container mx-auto px-4 flex flex-col gap-12 h-full min-h-screen my-8">
       {checkIfProductsExist ? (
          <div className="flex flex-col gap-12 w-full">
            {Object.entries(landingPageProducts).map(([slug, category]) => (
              category.data.length > 0 && (
                <div key={slug} className="w-full">
                  <h2 className="text-2xl font-bold mb-4">{category?.name?.sr}</h2>
                  <Carousel
                    opts={{
                      align: "start",
                      loop: category.data.length > 4, // Loop only if there are more cards than visible
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2">
                      {category.data.map((product) => (
                        <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/4 p-2">
                           <ProductCard
                              id={product._id || ''}
                              title={product.title || ""}
                              categoryName={category.name.sr}
                              imageUrl={product.imageUrl || ""}
                              price={product.price || 0}
                            />
                        </CarouselItem>
                      ))}
                      {/* Dodajemo placeholder kartice ako ih ima manje od 4 */}
                      {Array.from({ length: Math.max(0, 4 - category.data.length) }).map((_, index) => (
                        <CarouselItem key={`skeleton-${index}`} className="md:basis-1/2 lg:basis-1/4 p-2">
                          <Card className="flex flex-col h-full max-w-sm max-h-80 p-2">
                            <CardHeader className="p-2">
                              <Skeleton className="h-[125px] w-full rounded-md" />
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center flex-grow p-2">
                              <Skeleton className="h-4 w-3/4 mb-2" />
                              <p className="text-sm text-muted-foreground">Još uvek raste...</p>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="ml-3 hidden sm:flex" />
                    <CarouselNext className="mr-3 hidden sm:flex" />
                  </Carousel>
                </div>
              )
            ))}
          </div>
          
        ) : (
          <p>No products available.</p>
        )}
      </div>

    </>
  );
};

export default LandingPage;