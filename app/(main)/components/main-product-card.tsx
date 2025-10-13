import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  MoreVertical,
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
    <Card className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 p-0">
      {/* Header with store info */}
      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            {product.store.avatarUrl ? (
              <Image
                src={product.store.avatarUrl}
                alt={product.store.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">
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
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl opacity-50">📱</div>
          </div>
        )}
        
        {/* Discount Badge */}
        {product.comparePrice && product.comparePrice > product.price && (
          <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 pt-2 space-y-2">
        {/* Title */}
        <h2 className="font-semibold text-base text-gray-900 leading-tight line-clamp-2">
          {product.title}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex text-yellow-400 text-base">
            {"★★★★"}
            <span className="text-gray-300">★</span>
          </div>
          <span className="text-sm text-gray-600">({reviewCount})</span>
        </div>

        {/* Price and Buy Button */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(product.price)}
            </p>
            {product.comparePrice && product.comparePrice > product.price && (
              <p className="text-sm text-gray-400 line-through">
                {formatCurrency(product.comparePrice)}
              </p>
            )}
          </div>
          <Link href={`/${product.store.id}/product/${product.id}`}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
              See more
            </Button>
          </Link>
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-gray-500">
          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{engagementData.likes}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{engagementData.comments}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{engagementData.views}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-purple-500 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">{engagementData.shares}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-medium">{engagementData.bookmarks}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};