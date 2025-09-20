import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  UserCircle,
  CheckCircle,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

interface ExtendedProduct extends Product {
  store: {
    id: string;
    name: string;
    category: string | null;
    avatarUrl?: string;
    verified?: boolean;
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

export const MainProductCard = ({ product }: { product: ExtendedProduct }) => {
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : null;

  const storeAvatar = product.store.avatarUrl;

  // Mock engagement data - replace with real data
  const engagementData = {
    likes: "5.4M",
    comments: "5.4M", 
    shares: "5.4M",
    bookmarks: "5.4M"
  };

  return (
    <Card className="w-120 h-120 border rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      {/* Header with user info and time */}
      <div className="flex items-center justify-between px-4 py-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
            {storeAvatar ? (
              <Image
                src={storeAvatar}
                alt={product.store.name}
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full"
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-gray-900 truncate">
                {product.store.name}
              </span>
              {product.store.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {product.store.category} • Just now
            </div>
          </div>
        </div>
        <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
          5.8K ↗
        </Badge>
      </div>

      {/* Product Image - Rectangle */}
      <div className="px-4">
        <div className="relative h-62 w-full rounded-lg overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-gray-300" />
            </div>
          )}
          
          {/* Discount badge */}
          {discount && discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
              {discount}% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4  flex-1 flex flex-col">
          <h3 className="font-bold text-base text-gray-900 mb-1 truncate">
          {product.title}
        </h3>
        <div className="flex">
      
        
        {/* Star rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {"★".repeat(5)}
          </div>
          <span className="text-xs text-gray-500">(190)</span>
        </div>

        {/* Price */}
        <div className="mb-2 ml-5">
          <span className="text-sm font-medium text-gray-600">Price: </span>
          <span className="text-base font-bold text-blue-600">
            {formatCurrency(product.price)}
          </span>
        </div>
        </div>

        {/* Description - max 2 lines */}
        {/* <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">
          {product.description || "Promotion + marketing services are top notch if not the best in Kampala. Read more..."}
        </p> */}

        {/* Engagement Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{engagementData.likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{engagementData.comments}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>{engagementData.shares}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>{engagementData.shares}</span>
            </button>
          </div>
          <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
            <Bookmark className="w-4 h-4" />
            <span>{engagementData.bookmarks}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};