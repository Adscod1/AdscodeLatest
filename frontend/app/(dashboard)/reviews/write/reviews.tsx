"use client";
import React from 'react';
import { getCurrentProfile } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import CustomSidebar from "@/components/ui/custom-sidebar";
import { Profile, Role } from "@prisma/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Smartphone, 
  Headphones, 
  Shirt, 
  Camera, 
  Watch, 
  Gamepad2,
  Bell,
  Settings,
  HelpCircle,
  Star,
  BarChart3,
  Edit,
  TrendingUp,
  FileText,
  MessageSquare,
  Box,
  
  Users,
  User
} from 'lucide-react';

interface CategoryProps {
  icon: React.ReactNode;
  title: string;
  productCount: number;
  description: string;
  reviewsNeeded: number;
}

const CategoryCard: React.FC<CategoryProps> = ({ 
  icon, 
  title, 
  productCount, 
  description, 
  reviewsNeeded 
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow h-full flex flex-col">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{productCount} products</p>
        </div>
      </div>
    </div>
    
    <p className="text-xs sm:text-sm text-gray-600 mb-4 flex-grow">{description}</p>
    
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
      <span className="text-xs sm:text-sm text-gray-500">Need {reviewsNeeded} reviews</span>
      <button className="bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto">
        Browse Products
      </button>
    </div>
  </div>
);

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  disabled?: boolean;
}> = ({ icon, label, active = false, disabled = false }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
    active 
      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
      : disabled 
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-700 hover:bg-gray-50'
  }`}>
    <div className="w-5 h-5">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);



const Reviews = ({ user }: { user: Profile }) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  

  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: getCurrentProfile,
    initialData: user,
  });

  const avatarUrl =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.name || "User"
    )}&background=DC143C&color=fff&size=150`;

  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Electronics",
      productCount: 124,
      description: "Smartphones, laptops, tablets, and gadgets",
      reviewsNeeded: 3
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "Audio & Music",
      productCount: 89,
      description: "Headphones, speakers, and audio equipment",
      reviewsNeeded: 2
    },
    {
      icon: <Shirt className="w-5 h-5" />,
      title: "Fashion & Style",
      productCount: 156,
      description: "Clothing, accessories, and lifestyle products",
      reviewsNeeded: 4
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Photography",
      productCount: 67,
      description: "Cameras, lenses, and photography accessories",
      reviewsNeeded: 2
    },
    {
      icon: <Watch className="w-5 h-5" />,
      title: "Wearables",
      productCount: 43,
      description: "Smartwatches, fitness trackers, and wearable tech",
      reviewsNeeded: 3
    },
    {
      icon: <Gamepad2 className="w-5 h-5" />,
      title: "Gaming",
      productCount: 78,
      description: "Gaming accessories, peripherals, and gear",
      reviewsNeeded: 2
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <CustomSidebar profile={profile} />

        {/* Main Content */}
        <div className={`flex-1 w-0 min-w-0 ${
          isMobile ? 'pt-20' : ''
        }`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-none">
              {/* Header */}
              <div className="mb-6 lg:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Product Categories</h1>
                <p className="text-sm sm:text-base text-gray-600">Browse categories and write reviews to build your profile</p>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
                {categories.map((category, index) => (
                  <CategoryCard key={index} {...category} />
                ))}
              </div>

              {/* Review Writing Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0">
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Review Writing Tips</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Write detailed, honest reviews (200+ words) to qualify for Aspiring Influencer status
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Reviews;