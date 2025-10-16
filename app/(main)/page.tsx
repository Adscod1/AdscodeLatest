"use client";

import { getProducts } from "@/actions/product";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { MainProductCard } from "./components/main-product-card";



const FeedPage = () => {
  const { storeId } = useParams();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => getProducts(storeId as string),
  });

  return (
    <>    
      <div className="container mx-auto py-8">
        {/* <SearchBar /> */}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="bg-gray-200 h-48 w-full" />
              <div className="p-4 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-32 mb-12">
          {products?.map((product) => (
            <MainProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      </div>

      
    </>
  );
};

export default FeedPage;
