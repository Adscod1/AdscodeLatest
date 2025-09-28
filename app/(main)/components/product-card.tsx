"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  storeId: string;
  title: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: Array<{
    url: string;
  }>;
  variations: Array<{
    price: number;
    stock: number;
  }>;
  status: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  storeId,
  title,
  description,
  price,
  comparePrice,
  images,
  variations,
  status,
}) => {
  // Calculate total stock from variations
  const totalStock = variations.reduce((acc, curr) => acc + curr.stock, 0);

  // Calculate discount percentage if comparePrice exists
  const discountPercentage = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null;

  return (
    <Link href={`/${storeId}/product/${id}`}>
      <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <Image
            src={images[0]?.url || "/placeholder-product.png"}
            alt={title}
            width={400}
            height={192}
            className="w-full h-48 object-cover"
          />
          {discountPercentage && discountPercentage > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          )}
          {status === "DRAFT" && (
            <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
              Draft
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold truncate">{title}</h3>
            {description && (
              <p className="text-gray-500 text-sm line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-lg">{formatCurrency(price)}</p>
              {comparePrice && comparePrice > price && (
                <p className="text-gray-500 text-sm line-through">
                  {formatCurrency(comparePrice)}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500">{totalStock} in stock</div>
          </div>

          {variations.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {variations.length} variation
                {variations.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
