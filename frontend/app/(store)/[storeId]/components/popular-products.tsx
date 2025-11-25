"use client";

import { getPopularProducts } from "@/actions/product";
import { LoadingState } from "@/app/components/skeletons/stores-skeleton-loader";
import { ErrorState } from "@/app/components/errors/error-state";
import { useQuery } from "@tanstack/react-query";
import { Dot, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { Product } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

const PopularProducts = () => {
  const { storeId } = useParams();
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["popular-products"],
    queryFn: () => getPopularProducts(storeId as string),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Failed to load popular products" />;

  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Popular Products</h2>
      </div>

      <div className="space-y-4">
        {products?.slice(0, 6).map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-row">
              <div className="size-10 bg-neutral-200 rounded-md"></div>
              <div>
                <h3 className="text-sm font-medium">{product.title}</h3>

                {/*  */}
                <div className="flex items-center ">
                  <p className="text-xs text-gray-500">{product.views} views</p>
                  <Dot className="w-4 h-4" />
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(product.createdAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}

        {!products ||
          (products.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No products found
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopularProducts;
