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
    <Card className="w-full max-w-md border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-lg transition-shadow duration-300">
      {/* Header with store info */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500">
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
            <h3 className="font-bold text-sm text-gray-900">
              {product.store.name}
            </h3>
            <p className="text-xs text-gray-500">
              {product.store.category || "Electronics"} • Just now
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-6xl opacity-50">📱</div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <h2 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1">
          {product.title}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400 text-base">
            {"★★★★"}
            <span className="text-gray-300">★</span>
          </div>
          <span className="text-xs text-gray-600">({reviewCount})</span>
        </div>

        {/* Price and Buy Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(product.price)}
            </p>
            {product.comparePrice && product.comparePrice > product.price && (
              <p className="text-xs text-gray-400 line-through">
                {formatCurrency(product.comparePrice)}
              </p>
            )}
          </div>
          <Link href={`/${product.store.id}/product/${product.id}`}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all">
              Buy now
            </Button>
          </Link>
        </div>

        {/* Engagement Metrics */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-gray-600">
          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium">{engagementData.likes}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{engagementData.comments}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">{engagementData.views}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-purple-500 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-medium">{engagementData.shares}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
            <Bookmark className="w-4 h-4" />
            <span className="text-xs font-medium">{engagementData.bookmarks}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};