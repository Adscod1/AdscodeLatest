"use client";

import api from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Phone, 
  Globe, 
  Mail,
  Star,
  Wifi,
  Car,
  Monitor,
  Utensils,
  Calendar,
  Building,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, lazy, Suspense } from "react";

interface PrismaProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  category: string | null;
  vendor: string | null;
  tags: string | null;
  createdAt: Date;
  images: { url: string }[];
  variations: {
    name: string;
    value: string;
    price: number;
    stock: number;
  }[];
}

const BusinessPage = () => {
  const params = useParams();
  const businessId = params.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<{[key: string]: Array<{id: string, text: string, user: string, date: Date}>}>({});

  const handleReplyClick = (reviewId: string) => {
    setReplyingTo(reviewId);
    setReplyText("");
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyText.trim()) return;

    // TODO: Add API call to save reply
    const newReply = {
      id: Date.now().toString(),
      text: replyText,
      user: "Current User",
      date: new Date()
    };

    setReplies(prev => ({
      ...prev,
      [reviewId]: [...(prev[reviewId] || []), newReply]
    }));

    setReplyText("");
    setReplyingTo(null);
  };

  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store", businessId],
    queryFn: async () => {
      const response = await api.stores.getById(businessId);
      return response.store;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", businessId],
    queryFn: async () => {
      const response = await api.products.getByStore({ storeId: businessId });
      return response.products;
    },
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", businessId],
    queryFn: async () => {
      const response = await api.services.getByStore(businessId);
      return response.services;
    },
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", businessId],
    queryFn: async () => {
      const response = await api.reviews.getByStore(businessId);
      return response.reviews;
    },
    enabled: !!businessId,
    staleTime: 2 * 60 * 1000,
  });

  const { data: similarStores, isLoading: isLoadingSimilarStores } = useQuery({
    queryKey: ["similarStores", store?.category],
    queryFn: async () => {
      if (!store?.category) return { stores: [] };
      const response = await api.stores.getAllStores({ category: store.category, limit: 10 });
      return { stores: response.stores || [] };
    },
    enabled: !!store?.category,
    staleTime: 5 * 60 * 1000,
  });

  // Combine products and services for the main listing - Memoized for performance
  const allItems = useMemo(() => 
    [...(products || []), ...(services || [])].slice(0, 4),
    [products, services]
  );

  // Calculate average rating - Memoized for performance
  const averageRating = useMemo(() => 
    reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0,
    [reviews]
  );

  // Sample images for carousel - replace with actual store images
  const carouselImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43",
    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d"
  ];

  const highlights = [
    { icon: Wifi, name: "Free Wifi", color: "bg-green-500" },
    { icon: Car, name: "Parking", color: "bg-yellow-500" },
    { icon: Monitor, name: "TV", color: "bg-blue-500" },
    { icon: Utensils, name: "Restaurant", color: "bg-orange-500" },
    { icon: Calendar, name: "Events", color: "bg-pink-500" },
    { icon: Building, name: "Hotel", color: "bg-purple-500" }
  ];

  const businessHours = [
    { day: "Monday", hours: "08:30 AM - 05:30 PM", isOpen: false },
    { day: "Tuesday", hours: "08:30 AM - 05:30 PM", isOpen: true },
    { day: "Wednesday", hours: "08:30 AM - 05:30 PM", isOpen: false },
    { day: "Thursday", hours: "08:30 AM - 05:30 PM", isOpen: false },
    { day: "Friday", hours: "08:30 AM - 05:30 PM", isOpen: false },
    { day: "Saturday", hours: "08:30 AM - 05:30 PM", isOpen: false },
    { day: "Sunday", hours: "08:30 AM - 05:30 PM", isOpen: false }
  ];

  const campaigns = [
    { image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d" },
    { image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd" },
    { image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
    { image: "https://images.unsplash.com/photo-1556155092-490a1ba16284" }
  ];

  if (isLoadingStore || isLoadingProducts || isLoadingServices || isLoadingReviews) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Store Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The store you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/business/all">
            <Button>Back to Stores</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  overflow-x-hidden">
      <div className="mx-auto w-full">
        {/* Hero Carousel Section with Three Images - Full Width */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden w-full">
          <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-3 gap-1">
            {/* Left Image */}
            <div className="relative bg-gray-200 overflow-hidden hidden sm:block">
              <Image
                src={carouselImages[0]}
                alt="Business Image 1"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 0vw, 33vw"
                loading="lazy"
              />
            </div>
            
            {/* Center Image (Main) */}
            <div className="relative bg-gray-100 overflow-hidden sm:border-l-2 border-white/30">
              <Image
                src={carouselImages[1]}
                alt="Business Image 2"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            
            {/* Right Image */}
            <div className="relative bg-gray-300 overflow-hidden border-l-2 border-white/30 hidden sm:block">
              <Image
                src={carouselImages[2]}
                alt="Business Image 3"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 0vw, 33vw"
                loading="lazy"
              />
            </div>
          </div>
          
          {/* Dark Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentImageIndex(prev => prev === 0 ? carouselImages.length - 1 : prev - 1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all z-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => setCurrentImageIndex(prev => prev === carouselImages.length - 1 ? 0 : prev + 1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:shadow-xl transition-all z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
        </div>

        
        {/* Top Section: Business Profile + Action Buttons */}
        <div className="bg-white border border-gray-100 px-4 sm:px-6 lg:px-12 py-1 sm:py-4 w-full overflow-visible">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-full">
            {/* Left Side: Business Profile with Logo and Name inline */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Business Avatar - Larger size with negative margin to overlap hero */}
              <div className="flex-shrink-0 bg-white rounded-lg flex items-center justify-center  border-2 border-white -mt-4 sm:-mt-6 lg:-mt-8 z-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-md border-2 border-white">
                  {store.logo ? (
                    <Image
                      src={store.logo}
                      alt={store.name}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg sm:text-2xl lg:text-2xl font-bold text-white">
                        {store.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Business Info */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-2">
                  <span className="truncate">{store.name}</span>
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" 
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
                      fontWeight="normal" 
                      fontSize="none" 
                      textAnchor="inherit" 
                      style={{mixBlendMode: 'normal'}}
                    >
                      <g transform="scale(8.53333,8.53333)">
                        <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.4 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
                      </g>
                    </g>
                  </svg>

                  <span className="text-gray-500 font-normal text-sm sm:text-base">@username</span>

                  {store.category && (
                  <span className=" mt-1 font-normal px-2 py-0.5 bg-gray-100 text-gray-700 text-xs sm:text-xs rounded-full">
                    {store.category}
                  </span>
                )}
                  <span className="text-gray-300 mx-1 text-sm">|</span>
                  <span className="text-sm font-normal text-gray-600 flex items-center gap-1">
                    <span className="font-semibold text-gray-900">1.2K</span> Followers
                  </span>
                  <span className="text-gray-300 mx-1 text-sm">|</span>
                  <span className="text-sm font-normal text-gray-600 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span><span>Rating</span>
                  </span>
                  <span className="text-gray-300 mx-1 text-sm">|</span>
                  <span className="text-sm font-normal text-gray-600 flex items-center gap-1">
                    <span className="font-semibold text-green-600">92%</span> Performance Score
                  </span>
                </h1>
                
                <p className="text-gray-500 text-xs sm:text-[14px] truncate -mt-1">
                  {store.tagline || "Lorem ipsum dolor sit amet"}
                </p>
                
              </div>
            </div>
            
            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto max-w-full">
              <Button className="bg-white rounded-full border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-gray-800 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 text-xs sm:text-sm">
                <svg className="w-3.5 h-3.5" viewBox="0 0 640 512" fill="currentColor">
                  <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                </svg>
                <span className="hidden sm:inline">Follow</span>
              </Button>
              <Link href={`/business/${store.id}/reviews/write`}>
                <Button variant="outline" className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 flex items-center gap-1.5 text-xs sm:text-sm rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Write Review</span>
                </Button>
              </Link>
              <Button variant="outline" className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 flex items-center gap-1.5 text-xs sm:text-sm rounded-full">
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inbox</span>
              </Button>
              <Button variant="outline" className="px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 flex items-center gap-1.5 text-xs sm:text-sm rounded-full">
                <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M 35.478516 5.9804688 A 2.0002 2.0002 0 0 0 34.085938 9.4140625 L 35.179688 10.507812 C 23.476587 10.680668 14 20.256715 14 32 A 2.0002 2.0002 0 1 0 18 32 C 18 22.427546 25.627423 14.702715 35.154297 14.517578 L 34.085938 15.585938 A 2.0002 2.0002 0 1 0 36.914062 18.414062 L 41.236328 14.091797 A 2.0002 2.0002 0 0 0 41.228516 10.900391 L 36.914062 6.5859375 A 2.0002 2.0002 0 0 0 35.478516 5.9804688 z M 12.5 6 C 8.9338464 6 6 8.9338464 6 12.5 L 6 35.5 C 6 39.066154 8.9338464 42 12.5 42 L 35.5 42 C 39.066154 42 42 39.066154 42 35.5 L 42 28 A 2.0002 2.0002 0 1 0 38 28 L 38 35.5 C 38 36.903846 36.903846 38 35.5 38 L 12.5 38 C 11.096154 38 10 36.903846 10 35.5 L 10 12.5 C 10 11.096154 11.096154 10 12.5 10 L 20 10 A 2.0002 2.0002 0 1 0 20 6 L 12.5 6 z"></path>
                </svg>
                <span className="hidden sm:inline">Share</span>
              </Button>
              
            </div>
          </div>
        </div>

        {/* Main Content - Responsive padding */}
        <div className="px-4 sm:px-6 lg:px-12  pt-5 w-full max-w-full overflow-hidden">
          {/* Top Row: Description + About side by side */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-0 lg:mb-0">
            {/* Description Section */}
            <div className="flex-1 bg-white shadow-sm overflow-hidden w-full max-h-120">
              <div className="p-3 sm:p-4 lg:p-5 w-full">
                <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 pb-2 border-b border-gray-200 flex items-center text-base sm:text-lg break-words">
                  Description
                </h3>
                <div className="relative w-full overflow-hidden mt-3">
                  <p className={`text-gray-700 leading-relaxed break-words ${
                    !isDescriptionExpanded ? "line-clamp-3" : ""
                  }`}>
                    {store.description || "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa incidunt commodi ab totam illo quidem quas porro doloribus consequuntur adipisci placeat numquam vero hic perspiciatis minus facere aperiam dolor alias accusamus omnis reiciendis, nisl pariatur ad molestias? Voluptas assumenda porro tempora ipsum animi libero incidunt iure ut facilis, soluta consequuntur totam beatae voluptate qui quasi, tenetur perferendis? Laboriosam ipsum ad libero numquam obcaecati consectetur dolores ratione earum? Soluta placeat ipsum nesciunt sequi. Impedit sapiente fugit labore delectus minus, vitae maxime ab ea velit distinctio neque alias? Error, iure! Rem nihil id dolorum repellendus tempora quis dolor sapiente cumque tempore?"}
                  </p>
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-3 transition-colors"
                  >
                    {isDescriptionExpanded ? "Show less" : "Show more"}
                  </button>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 w-full overflow-hidden h-full">
                <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">About</h3>
                <div className="border-b border-gray-200 mb-4 sm:mb-6"></div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-gray-700 group cursor-pointer">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                    </div>
                    <span className="text-xs sm:text-sm break-all group-hover:text-blue-600 transition-colors">www.adscod.com</span>
                  </div>
                  <div className="flex items-center text-gray-700 group cursor-pointer">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                    </div>
                    <span className="text-xs sm:text-sm group-hover:text-blue-600 transition-colors">{store.phone || "+256 700 000 000"}</span>
                  </div>
                  <div className="flex items-center text-gray-700 group cursor-pointer">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                    </div>
                    <span className="text-xs sm:text-sm group-hover:text-blue-600 transition-colors">Kansanga, Kampala</span>
                  </div>
                  {store.email && (
                    <div className="flex items-center text-gray-700 group cursor-pointer">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      </div>
                      <span className="text-xs sm:text-sm break-all group-hover:text-blue-600 transition-colors">{store.email}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 flex-wrap">
                  {/* Facebook */}
                  <button className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 text-gray-500 rounded flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 320 512">
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                    </svg>
                  </button>
                  
                  {/* X (Twitter) */}
                  <button className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 text-gray-500 rounded flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  
                  {/* YouTube */}
                  <button className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 text-gray-500 rounded flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </button>
                  
                  {/* Instagram */}
                  <button className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 text-gray-500 rounded flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </button>
                  
                  {/* LinkedIn */}
                  <button className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 text-gray-500 rounded flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 448 512">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/>
                    </svg>
                  </button>
                </div>

                <Button className="w-full mt-4 sm:mt-6 hover:bg-gray-200 hover:text-blue-600 text-white rounded text-sm sm:text-base">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>

          {/* Rest of Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mt-12 lg:mt-16">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-8 lg:space-y-10 min-w-0 w-full">

            {/* Campaigns */}
            <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-xl font-bold text-gray-900 flex items-center">
                  {/* <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" /> */}
                  Campaigns
                </h2>
                <Link href={`/business/${store?.id}/campaigns`} className="text-blue-600 hover:text-blue-700 flex items-center text-sm sm:text-base">
                  <span className="hidden sm:inline">See all campaigns</span>
                  <span className="sm:hidden">See all</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={campaign.image}
                      alt={`Campaign ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Services */}
            <div className="bg-white shadow-sm p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-xl font-bold text-gray-900 flex items-center">
                  {/* <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" /> */}
                  <span className="hidden sm:inline">Listings</span>
                  <span className="sm:hidden">Products & Services</span>
                </h2>
                <Link href={`${store.id}/bservices`} className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm sm:text-base">
                  See all listings
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {isLoadingProducts || isLoadingServices ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-square bg-gray-200 mb-4"></div>
                      <div className="h-4 bg-gray-200 mb-2"></div>
                      <div className="h-3 bg-gray-200 w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : allItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {allItems.map((item, index) => (
                    <Link key={item.id} href={`/product/${item.id}`}>
                      <Card className="overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer shadow-none">
                        <div className="h-40 bg-gray-100">
                          {item.images && item.images.length > 0 ? (
                            <Image
                              src={item.images[0].url}
                              alt={item.title}
                              width={300}
                              height={300}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base">{item.title}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-2">
                            {item.description || "No description available"}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-base sm:text-lg font-bold text-gray-900">${item.price}</span>
                            {item.comparePrice && item.price && item.comparePrice > item.price && (
                              <span className="text-xs sm:text-sm text-gray-400 line-through">${item.comparePrice}</span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛍️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products or Services</h3>
                  <p className="text-gray-600">This business hasn't added any products or services yet.</p>
                </div>
              )}
            </div>

            {/* Media */}
            <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-xl font-bold text-gray-900 flex items-center">
                  {/* <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" /> */}
                Media
                </h2>
                <Link href={`/business/${store?.id}/media`} className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm sm:text-base">
                  <span className="hidden sm:inline">See all media</span>
                  <span className="sm:hidden">See all</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={campaign.image}
                      alt={`Campaign ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </div>


            {/* Highlights */}
            <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Business Highlights</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
                {highlights.map((highlight, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${highlight.color} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg`}>
                      <highlight.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">{highlight.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended Reviews</h2>
                <Link href={`/business/${store.id}/reviews`} className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm sm:text-base">
                  <span className="hidden sm:inline">See all reviews</span>
                  <span className="sm:hidden">See all</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {isLoadingReviews ? (
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="h-6 bg-gray-200 mb-4 w-32"></div>
                      <div className="h-8 bg-gray-200 mb-2 w-48"></div>
                      <div className="h-4 bg-gray-200 w-24"></div>
                    </div>
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-3 bg-gray-200"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : reviews && reviews.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-8 mb-8">
                    <div>
                      <div className="mb-4">
                        <span className="text-sm text-gray-600 font-bold">Overall rating</span>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center mr-3 ">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-5 h-5 ${
                                  star <= Math.round(averageRating) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                          <span className="text-gray-500 ml-2">({reviews.length} Reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 ">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={rating} className="flex items-center text-sm">
                            <span className="w-12">{rating} Stars</span>
                            <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="w-12 text-right text-gray-500">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Latest Reviews */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                      <h3 className="text-lg font-bold text-gray-900">Latest Reviews</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="bg-white   pb-4 ">
                          {/* Review Header */}
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              {review.user.image ? (
                                <Image
                                  src={review.user.image}
                                  alt={review.user.name || "User"}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-sm font-bold text-white">
                                  {(review.user.name || "U").charAt(0)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {review.user.name || "Anonymous User"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(review.createdAt).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: false 
                                  })}
                                </span>
                              </div>
                              
                              {/* Star Rating */}
                              <div className="flex items-center mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                      star <= review.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              
                              {/* Review Text */}
                              <p className="text-gray-700 text-sm leading-relaxed mb-3 break-words max-w-[100%]">
                                {review.comment}
                              </p>
                              
                              {/* Review Images (if any) - Placeholder for future implementation */}
                              {/* You can add image support here */}
                              
                              {/* Reply Button with Icon */}
                              <div className="flex items-center gap-4 mt-2">
                                <button
                                  onClick={() => handleReplyClick(review.id)}
                                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  <span className="text-xs">Reply</span>
                                </button>
                                
                                {/* Show reply count if there are replies */}
                                {replies[review.id] && replies[review.id].length > 0 && (
                                  <button 
                                    className="flex items-center gap-1 text-blue-600 text-xs"
                                    onClick={() => {
                                      // Toggle showing replies (optional)
                                    }}
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Reply ({replies[review.id].length})</span>
                                  </button>
                                )}
                              </div>

                              {/* Reply Form */}
                              {replyingTo === review.id && (
                                <div className="mt-4 pl-4 border-l-2 border-blue-400">
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Write a reply..."
                                      className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                      rows={3}
                                    />
                                    {/* Emoji Toolbar */}
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="flex items-center gap-1 text-lg">
                                        <button className="hover:scale-110 transition-transform">👍</button>
                                        <button className="hover:scale-110 transition-transform">❤️</button>
                                        <button className="hover:scale-110 transition-transform">👏</button>
                                        <button className="hover:scale-110 transition-transform">😂</button>
                                        <button className="hover:scale-110 transition-transform">😍</button>
                                        <button className="hover:scale-110 transition-transform">🔥</button>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            setReplyingTo(null);
                                            setReplyText("");
                                          }}
                                          className="text-gray-600"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => handleReplySubmit(review.id)}
                                          className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                          Post Reply
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Display Replies */}
                              {replies[review.id] && replies[review.id].length > 0 && (
                                <div className="mt-4 space-y-3">
                                  {replies[review.id].map((reply) => (
                                    <div key={reply.id} className="pl-6 border-l-2 border-gray-200">
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                          <span className="text-xs font-bold text-white">
                                            {reply.user.charAt(0)}
                                          </span>
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900 text-xs">
                                              {reply.user}
                                            </span>
                                            {reply.user === "Chris Helson" && (
                                              <Badge className="bg-blue-500 text-white text-xs px-2 py-0">Author</Badge>
                                            )}
                                            <span className="text-xs text-gray-500">
                                              {new Date(reply.date).toLocaleTimeString('en-US', { 
                                                hour: '2-digit', 
                                                minute: '2-digit',
                                                hour12: false 
                                              })}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-700">{reply.text}</p>
                                          
                                          {/* Reply to reply button */}
                                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 mt-1">
                                            <MessageCircle className="w-3 h-3" />
                                            <span className="text-xs">Reply</span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {reviews.length > 3 && (
                    <div className="mt-6 text-center">
                      <Link href={`/business/${store.id}/reviews`}>
                        <Button variant="outline">
                          View all {reviews.length} reviews
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to share your experience!</p>
                  <Link href={`/business/${store.id}/reviews/write`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Write First Review
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebars Container */}
          <div className="w-full  lg:w-80 flex flex-col gap-8 lg:gap-10 mt-12 lg:mt-0 flex-shrink-0">
            {/* Business Hours Sidebar */}
            <div className="bg-white border border-gray-100 w-full overflow-hidden lg:sticky lg:top-6 lg:self-start">
              {/* Business Hours */}
              <div>
                <div className="bg-green-400 text-white  sm:px-4 py-2 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="font-medium">OPEN NOW</span>
                  <span className="ml-auto text-xs sm:text-sm">08:30 AM to 05:00 PM</span>
                </div>
                
                <div className="space-y-4 sm:space-y-4 p-3">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm sm:text-sm">
                      <span className={schedule.isOpen ? "text-green-400" : "text-gray-500"}>
                        {schedule.day}
                      </span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Similar Businesses Sidebar */}
            <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <ChevronRight className="w-5 h-5 text-gray-700" />
                <h3 className="text-base font-bold text-gray-900">Similar Businesses</h3>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {isLoadingSimilarStores ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">Loading similar businesses...</p>
                  </div>
                ) : similarStores && similarStores.stores.length > 0 ? (
                  similarStores.stores
                    .filter((s: any) => s.id !== store?.id) // Exclude current store
                    .slice(0, 5)
                    .map((similarStore: any) => (
                      <Link key={similarStore.id} href={`/business/${similarStore.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                          <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            {similarStore.logo ? (
                              <Image
                                src={similarStore.logo}
                                alt={similarStore.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-sm font-bold text-white">
                                {similarStore.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">
                              {similarStore.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {similarStore.category || "Business"}
                            </p>
                            {similarStore.verified && (
                              <span className="inline-block mt-1 text-xs text-blue-600">✓ Verified</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No similar businesses found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;