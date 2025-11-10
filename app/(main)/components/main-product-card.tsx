import React from "react";
import { Card } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

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
  // Mock engagement data - replace with real data from your database
  const engagementData = {
    likes: "8.2M",
    comments: "3.1M",
    views: "12.5M",
    shares: "2.8M",
    bookmarks: "6.7M",
  };

  // Calculate review count (mock data - replace with actual reviews)
  const reviewCount = 324;

  return (
    <Link href={`/${product.store.id}/product/${product.id}`} className="block">
  <Card className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 p-0 cursor-pointer ">
        {/* Header with store info */}
      <div className="flex items-center justify-between p-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            {product.store.avatarUrl ? (
              <Image
                src={product.store.avatarUrl}
                alt={product.store.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {product.store.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">
              {product.store.name}
            </h3>
            <p className="text-xs text-gray-500">
              {product.store.category || "Other"} • Just now
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full h-96 bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
            className="object-cover object-center"
            priority={false}
          />
        ) : (
          <div className="w-full h-80 flex items-center justify-center">
            <div className="text-white text-6xl opacity-50">📱</div>
          </div>
        )}
        
        {/* Discount Badge */}
        {product.comparePrice && product.comparePrice > product.price && (
          <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 text-sm w-auto rounded-full ">
            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
  <div className="p-4  space-y-2.5">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-base text-gray-900 leading-tight line-clamp-1 flex-1">
            {product.title}
          </h2>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex text-yellow-400 text-sm">
              {"★★★★"}
              <span className="text-gray-300">★</span>
            </div>
            <span className="text-xs text-gray-600">({reviewCount})</span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(product.price)}
          </p>
          {product.comparePrice && product.comparePrice > product.price && (
            <p className="text-base text-gray-400 line-through">
              {formatCurrency(product.comparePrice)}
            </p>
          )}
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-between pt-3 mt-2 text-gray-500 border-t border-gray-200">
          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm ">{engagementData.likes}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm ">{engagementData.comments}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm ">{engagementData.views}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-purple-500 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm ">{engagementData.shares}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm ">{engagementData.bookmarks}</span>
          </button>
        </div>
      </div>
  </Card>
    </Link>
  );
};