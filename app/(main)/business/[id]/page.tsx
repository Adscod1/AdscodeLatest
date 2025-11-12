"use client";

import { getStoreById } from "@/app/actions/store";
import { getProducts } from "@/app/actions/product";
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
import { useState } from "react";

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

  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store", businessId],
    queryFn: () => getStoreById(businessId),
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", businessId],
    queryFn: () => getProducts(businessId),
    enabled: !!businessId,
  });

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

  const services = [
    { title: "Main page SEO", description: "Lorem ipsum dolor sit amet.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f" },
    { title: "Main page SEO", description: "Lorem ipsum dolor sit amet.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f" },
    { title: "Main page SEO", description: "Lorem ipsum dolor sit amet.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71" },
    { title: "Main page SEO", description: "Lorem ipsum dolor sit amet.", image: "https://images.unsplash.com/photo-1553484771-371a605b060b" }
  ];

  const campaigns = [
    { image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d" },
    { image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd" },
    { image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
    { image: "https://images.unsplash.com/photo-1556155092-490a1ba16284" }
  ];

  if (isLoadingStore || isLoadingProducts) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* Hero Carousel Section with Three Images - Full Width */}
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 gap-0">
            {/* Left Image */}
            <div className="relative bg-gray-200 overflow-hidden">
              <Image
                src={carouselImages[0]}
                alt="Business Image 1"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Center Image (Main) */}
            <div className="relative bg-gray-100 overflow-hidden">
              <Image
                src={carouselImages[1]}
                alt="Business Image 2"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Right Image */}
            <div className="relative bg-gray-300 overflow-hidden">
              <Image
                src={carouselImages[2]}
                alt="Business Image 3"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Dark Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => setCurrentImageIndex(prev => prev === 0 ? carouselImages.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => setCurrentImageIndex(prev => prev === carouselImages.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Business Avatar with White Circle Background - Overlapping */}
         
        </div>

         {/* Top Section: Business Profile + Action Buttons */}
        <div className="bg-white shadow-sm px-12 py-8 pt-5">
          <div className="flex items-center justify-between">
            {/* Left Side: Business Profile - Adjusted for overlapping avatar */}
             <div className="absolute bottom-[400px] left-12 transform translate-y-1/2 z-30">
            <div className="w-36 h-36 bg-white rounded flex items-center justify-center ">
              <div className="w-32 h-32 rounded overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 shadow-md">
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={store.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {store.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
            <div className="flex items-center gap-6 ml-40">
              {/* Business Info */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{store.name}</h1>
                <p className="text-gray-600 text-xl">
                  {store.tagline || "Lorem ipsum dolor sit amet"}
                </p>
              </div>
            </div>
            
            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-3">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-6 py-2.5 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favourite
              </Button>
              <Button variant="outline" className="rounded-lg px-6 py-2.5 bg-white border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Inbox
              </Button>
              <Button variant="outline" className="rounded-lg px-6 py-2.5 bg-white border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Add padding here */}
        <div className="px-20 flex gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-8">
            {/* Business Header - Full Width */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
             

              {/* Description Section */}
              <div className="p-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Description
                </h3>
                <div className="relative">
                  <p className={`text-gray-700 leading-relaxed ${
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

            {/* Campaigns */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Campaigns
                </h2>
                <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  See all campaigns
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
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
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Listing main services
                </h2>
                <Link href={`${store.id}/bservices`} className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  See all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Highlights from the Business</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                {highlights.map((highlight, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 ${highlight.color} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                      <highlight.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="font-medium text-gray-900">{highlight.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Reviews</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Overall rating</span>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center mr-3">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                        ))}
                        {[...Array(2)].map((_, i) => (
                          <Star key={i + 3} className="w-5 h-5 text-gray-300" />
                        ))}
                      </div>
                      <span className="font-bold text-lg">4.0</span>
                      <span className="text-gray-500 ml-2">(45 Reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center text-sm">
                      <span className="w-12">{rating} Stars</span>
                      <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: rating === 5 ? '60%' : rating === 4 ? '30%' : '10%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - About Section (Sticky) */}
          <div className="w-80 sticky top-6 self-start">
            <div className="bg-blue-50 rounded-2xl shadow-sm p-8">
              <h3 className="font-semibold text-gray-900 mb-6">About</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Globe className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="text-sm">www.adscod.com</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="text-sm">{store.phone || "+256 700 000 000"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="text-sm">Kansanga, Kampala</span>
                </div>
                {store.email && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-gray-500" />
                    <span className="text-sm">{store.email}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-blue-200">
                {/* Facebook */}
                <button className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                
                {/* X (Twitter) */}
                <button className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                
                {/* YouTube */}
                <button className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </button>
                
                {/* Instagram */}
                <button className="w-8 h-8 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
                
                {/* LinkedIn */}
                <button className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>

              <Button className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white rounded-lg">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send message
              </Button>

              {/* Business Hours */}
              <div className="mt-6 pt-6 border-t border-blue-200">
                <div className="bg-green-500 text-white rounded-lg px-4 py-2 mb-4 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">OPEN NOW</span>
                  <span className="ml-auto text-sm">08:30 AM to 05:00 PM</span>
                </div>
                
                <div className="space-y-2">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={schedule.isOpen ? "text-green-600 font-medium" : "text-gray-700"}>
                        {schedule.day}
                      </span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
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