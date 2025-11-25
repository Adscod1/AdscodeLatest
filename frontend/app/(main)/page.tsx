"use client";

import api from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSearch } from "@/contexts/SearchContext";
import { useMemo } from "react";

import { MainProductCard } from "./components/main-product-card";



const FeedPage = () => {
  const { storeId } = useParams();
  const { searchTerm, activeCategory } = useSearch();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storeId],
    queryFn: async () => {
      const response = await api.products.getByStore({ storeId: storeId as string });
      return response.products;
    },
  });

  // Filter products based on search term and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((product) => 
        product.title.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.store?.name?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (activeCategory && activeCategory !== "All") {
      filtered = filtered.filter((product) =>
        product.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    return filtered;
  }, [products, searchTerm, activeCategory]);

  return (
    <>    
      <div className="w-full pt-4 pb-8 px-4 sm:px-6 lg:px-8">
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
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-12">
          {filteredProducts.map((product) => (
            <MainProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-gray-400 mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 max-w-md">
            {searchTerm ? (
              `No products match "${searchTerm}"${activeCategory !== "All" ? ` in ${activeCategory}` : ""}`
            ) : activeCategory !== "All" ? (
              `No products found in ${activeCategory} category`
            ) : (
              "No products available at the moment"
            )}
          </p>
        </div>
      )}
      </div>

      
    </>
  );
};

export default FeedPage;
