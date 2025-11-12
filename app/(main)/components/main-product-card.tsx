import React from "react";
import { Card } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  MoreHorizontal,
  Star,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const StarRating = ({ rating }: { rating: number }) => {
  const SoftStar = ({ filled }: { filled: boolean }) => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 2.5c.3 0 .6.2.7.5l2.1 4.3 4.7.7c.3 0 .6.3.7.6.1.3 0 .6-.2.8l-3.4 3.3.8 4.7c.1.3 0 .6-.2.8-.2.2-.5.3-.8.1L12 15.4l-4.2 2.2c-.3.2-.6.1-.8-.1-.2-.2-.3-.5-.2-.8l.8-4.7L4.2 8.7c-.2-.2-.3-.5-.2-.8.1-.3.4-.6.7-.6l4.7-.7L11.3 3c.1-.3.4-.5.7-.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={
            i < Math.floor(rating)
              ? "text-orange-400"
              : i < rating
              ? "text-orange-400 opacity-60"
              : "text-gray-300"
          }
        >
          <SoftStar filled={i < Math.floor(rating)} />
        </div>
      ))}
    </div>
  );
};

const VerifiedBadge = () => (
  <svg 
    className="w-4 h-4" 
    viewBox="0,0,256,256"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g 
      fill="#228be6" 
      fillRule="nonzero" 
      stroke="none" 
      strokeWidth="1" 
      strokeLinecap="butt" 
      strokeLinejoin="miter" 
      strokeMiterlimit="10" 
      strokeDasharray="" 
      strokeDashoffset="0" 
      fontFamily="none" 
      fontWeight="none" 
      fontSize="none" 
      textAnchor="none" 
      style={{mixBlendMode: 'normal'}}
    >
      <g transform="scale(8.53333,8.53333)">
        <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.4 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
      </g>
    </g>
  </svg>
);

interface ExtendedProduct extends Product {
  store: {
    id: string;
    name: string;
    category: string | null;
    logo?: string | null;
    avatarUrl?: string | null;
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
    <Link href={`/product/${product.id}`} className="block">
      <Card className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white hover:bg-gray-50 transition-shadow duration-300 p-0 cursor-pointer ">
        {/* Header with store info */}
      <div className="flex items-center justify-between p-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded overflow-hidden flex items-center justify-center bg-gray-200">
            {product.store.logo || product.store.avatarUrl ? (
              <Image
                src={product.store.logo || product.store.avatarUrl || ''}
                alt={product.store.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-bold text-sm">
                {product.store.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-sm text-gray-900">
                {product.store.name}
              </h3>
              <VerifiedBadge />
            </div>
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
            <StarRating rating={4} />
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