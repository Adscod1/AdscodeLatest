"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api-client";

const MediaGalleryPage = () => {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;

  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos">("all");

  // Fetch store data
  const { data: store } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => api.stores.getById(storeId),
  });

  // Fetch products
  const { data: productsData } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => api.products.getByStore({ storeId }),
  });
  const products = productsData?.products || [];

  // Fetch services
  const { data: servicesData } = useQuery({
    queryKey: ["services", storeId],
    queryFn: () => api.services.getByStore(storeId),
  });
  const services = servicesData?.services || [];

  // Dummy media data
  const dummyMedia = [
    { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8", type: "image", title: "Shawn Mendes - Treat You Better" },
    { url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43", type: "image", title: "Ed Sheeran - Shape of You" },
    { url: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d", type: "image", title: "Marshmello & Anne-Marie - Friends" },
    { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d", type: "video", title: "The Chainsmokers & Coldplay - Something" },
    { url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd", type: "image", title: "The Chainsmokers - Don't Let Me Down" },
    { url: "https://images.unsplash.com/photo-1552664730-d307ca884978", type: "image", title: "Business Conference 2024" },
    { url: "https://images.unsplash.com/photo-1556155092-490a1ba16284", type: "video", title: "Product Launch Event" },
    { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c", type: "image", title: "Team Building Workshop" },
    { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b", type: "image", title: "Store Opening Day" },
    { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87", type: "video", title: "Behind The Scenes" },
    { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7", type: "image", title: "Customer Testimonials" },
    { url: "https://images.unsplash.com/photo-1556761175-4b46a572b786", type: "image", title: "Office Tour 2024" },
    { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0", type: "image", title: "Annual Gala Event" },
    { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0", type: "video", title: "Product Demo Video" },
    { url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952", type: "image", title: "Staff Training Session" },
    { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655", type: "image", title: "Workshop Highlights" },
  ];

  // Collect all media from products and services
  const actualMedia = [
    ...(products?.flatMap((p: any) => 
      p.images?.map((img: any) => ({
        url: img.url,
        type: "image",
        title: p.title,
        id: p.id,
      })) || []
    ) || []),
    ...(services?.flatMap((s: any) => 
      s.images?.map((img: any) => ({
        url: img.url,
        type: "image",
        title: s.title,
        id: s.id,
      })) || []
    ) || []),
    ...(services?.flatMap((s: any) => 
      s.videos?.map((vid: any) => ({
        url: vid.url,
        type: "video",
        title: s.title,
        id: s.id,
      })) || []
    ) || []),
  ];

  // Use actual media if available, otherwise use dummy data
  const allMedia = actualMedia.length > 0 ? actualMedia : dummyMedia;

  const filteredMedia = activeTab === "all" 
    ? allMedia 
    : allMedia.filter((m: any) => m.type === activeTab.replace("s", ""));

  // Group media into sections
  const recentMedia = filteredMedia.slice(0, 8);
  const popularMedia = filteredMedia.slice(0, 8).reverse();
  const featuredMedia = filteredMedia.slice(0, 8);

  const ScrollSection = ({ title, items }: { title: string; items: any[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
      if (scrollRef.current) {
        const scrollAmount = 300;
        scrollRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 group cursor-pointer"
            >
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3 shadow-md hover:shadow-xl transition-shadow">
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      12:28
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">
                {store?.store?.name || "Business Name"}
              </p>
              <p className="text-xs text-gray-400">1,854,481,298 views</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
                <p className="text-sm text-gray-500">{store?.store?.name || "Loading..."}</p>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search media..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "images"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "videos"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Videos
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {filteredMedia.length > 0 ? (
          <>
            <ScrollSection title="DISCOVER" items={recentMedia} />
            <ScrollSection title="TRENDING" items={popularMedia} />
            <ScrollSection title="FOLLOWING" items={featuredMedia} />
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Media Available</h3>
            <p className="text-gray-600">This business hasn't uploaded any media yet.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MediaGalleryPage;
