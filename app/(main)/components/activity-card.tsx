import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

interface ExtendedProduct extends Product {
  store: {
    id: string;
    name: string;
  };
  variations: {
    id: string;
    name: string;
    value: string;
    price: number;
    stock: number;
  }[];
  images: {
    id: string;
    url: string;
  }[];
}

interface ProductCardProps {
  product: ExtendedProduct;
}

export const ActivityCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : null;

  return (
    <Card className="border rounded-lg overflow-hidden group">
      <div className="relative">
        <div className="h-40 bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Heart className="h-8 w-8" />
            </div>
          )}
        </div>
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm">
          <Heart className="h-4 w-4 text-gray-400" />
        </button>
        {discount && discount > 0 && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-500 text-white">
              Sale {discount}% Off
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3">
        <Link
          href={`/business/${product.storeId}`}
          className="text-xs text-gray-600 hover:text-blue-600 transition-colors block mb-1"
        >
          {product.store.name}
        </Link>
        <h3 className="font-medium text-sm">{product.title}</h3>
        <p className="text-gray-500 text-xs line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-blue-500 font-bold text-sm">
            {formatCurrency(product.price)}
          </p>
          <div className="flex items-center gap-1">
            <StarRating rating={4} />
            <span className="text-xs text-gray-500">
              {product.variations.length} items
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < Math.floor(rating)
              ? "text-yellow-400"
              : i < rating
              ? "text-yellow-400 opacity-60"
              : "text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};
