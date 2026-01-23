"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api-client';
import Link from 'next/link';
import localImage from '@/public/beauty-image.jpg'; 

interface Product {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  vendor?: string | null;
  tags?: string | null;
  price: number;
  comparePrice?: number | null;
  costPerItem?: number | null;
  weight?: number | null;
  weightUnit?: string | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  sizeUnit?: string | null;
  countryOfOrigin?: string | null;
  harmonizedSystemCode?: string | null;
  status: string;
  storeId: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  images: { id: string; url: string; productId: string }[];
  variations: { id: string; name: string; value: string; price: number; stock: number; productId: string }[];
  videos: { id: string; url: string; productId: string }[];
  store: {
    id: string;
    name: string;
    tagline?: string | null;
    description?: string | null;
    category?: string | null;
    regNumber?: string | null;
    yearEstablished?: number | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zip?: string | null;
    website?: string | null;
    logo?: string | null;
    banner?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface Service {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  vendor?: string | null;
  tags?: string | null;
  price: number;
  comparePrice?: number | null;
  costPerItem?: number | null;
  weight?: number | null;
  weightUnit?: string | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  sizeUnit?: string | null;
  countryOfOrigin?: string | null;
  harmonizedSystemCode?: string | null;
  status: string;
  storeId: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  images: { id: string; url: string; productId: string }[];
  variations: { id: string; name: string; value: string; price: number; stock: number; productId: string }[];
  videos: { id: string; url: string; productId: string }[];
  store: {
    id: string;
    name: string;
    tagline?: string | null;
    description?: string | null;
    category?: string | null;
    regNumber?: string | null;
    yearEstablished?: number | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zip?: string | null;
    website?: string | null;
    logo?: string | null;
    banner?: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function EcommercePage() {
  const params = useParams();
  const businessId = params.id as string;
  const [activeTab, setActiveTab] = useState('Fashion');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      gradient: 'from-blue-500 to-blue-400',
      title: 'Flash Sale',
      subtitle: '5 Days left',
      icon: '⚡'
    },
    {
      gradient: 'from-purple-500 to-purple-400',
      title: 'New Arrivals',
      subtitle: 'Check out latest products',
      icon: '🎁'
    },
    {
      gradient: 'from-pink-500 to-pink-400',
      title: 'Special Offer',
      subtitle: 'Limited time only',
      icon: '✨'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products for this business
        const productsResponse = await api.products.getByStore({ storeId: businessId });
        // Fetch services for this business
        const servicesResponse = await api.services.getByStore(businessId);
        
        setProducts(productsResponse.products as unknown as Product[] || []);
        setServices(servicesResponse.services as unknown as Service[] || []);
      } catch (error) {
        console.error('Error fetching products and services:', error);
        setProducts([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchData();
    }
  }, [businessId]);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Combine products and services for display
  const allItems = [...products, ...services];

  const categories = [
    { name: 'Technology', discount: '10% OFF', image: '🎧', link: 'Shop now →' },
    { name: 'Beauty', discount: '20% OFF', image: '🎧', link: 'Shop now →' },
    { name: 'Fashion', discount: '30% OFF', image: '🧢', link: 'Shop now →' }
  ];

  const tabs = ['Electronics', 'Fashion', 'Furniture', 'Beauty', 'Automobile', 'Food & Drinks', 'Appliances'];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Banner - Full Width */}
      <div className="relative bg-gradient-to-r overflow-hidden mb-8 h-[36rem] w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-10 right-20 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute top-32 right-32 w-16 h-16 bg-white rounded-full"></div>
            </div>
            <div className="relative h-full flex items-center justify-between px-12">
              <div className="text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-5xl font-bold">{slide.title}</h3>
                  <span className="text-4xl">{slide.icon}</span>
                </div>
                <p className="text-3xl font-bold mb-6">{slide.subtitle}</p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Shop Now!</span>
                </button>
              </div>
              <div className="relative">
                <div className="text-9xl transform rotate-12">
                  {index === 0 ? '👟' : index === 1 ? '🎁' : '✨'}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition backdrop-blur-sm z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition backdrop-blur-sm z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index 
                  ? 'w-8 h-3 bg-white' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/70'
              }`}
            ></button>
          ))}
        </div>
      </div>

      <div className=" mx-auto px-4 py-8">

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-8 mb-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{cat.discount}</p>
                  <p className="text-lg font-bold text-blue-600 mb-2">{cat.name}</p>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600">{cat.link}</a>
                </div>
                <div className="text-5xl">{cat.image}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Message */}
        {/* <div className="bg-green-500 text-white px-4 py-3 rounded-lg mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Success toast message</span>
          </div>
          <button className="text-white hover:text-gray-200">✕</button>
        </div> */}

        {/* Explore New Products */}
        <div className="m-10">
          <h2 className="text-3xl font-bold text-left mb-6">Explore our products</h2>
          
          {/* Tabs */}
          <div className="flex justify-left space-x-8 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-2 px-2 font-medium transition ${
                  activeTab === tab
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products and services...</p>
            </div>
          ) : allItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Product Cards */}
                {allItems.slice(0, 3).map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/product/${item.id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden block"
                  >
                    <div className="relative bg-gray-100">
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 z-10">
                        <Heart className="w-3 h-3" />
                      </button>
                      {item.comparePrice && item.price < item.comparePrice && (
                        <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10">
                          {Math.round((1 - item.price /  item.comparePrice) * 100)}% OFF
                        </div>
                      )}
                      <div className="aspect-square flex items-center justify-center overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0].url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-7xl">📦</div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                      {item.description && (<span className="text-sm text-gray-600 line-clamp-2">{item.description}</span>)}

                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        {item.comparePrice && item.comparePrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">${item.comparePrice}</span>

                        )}
                      </div>
                      <div className="flex items-center space-x-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                            viewBox="0 0 24 24"
                            fill={i < 4 ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M12 2.5c.3 0 .6.2.7.5l2.1 4.3 4.7.7c.3 0 .6.3.7.6.1.3 0 .6-.2.8l-3.4 3.3.8 4.7c.1.3 0 .6-.2.8-.2.2-.5.3-.8.1L12 15.4l-4.2 2.2c-.3.2-.6.1-.8-.1-.2-.2-.3-.5-.2-.8l.8-4.7L4.2 8.7c-.2-.2-.3-.5-.2-.8.1-.3.4-.6.7-.6l4.7-.7L11.3 3c.1-.3.4-.5.7-.5z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ))}
                      </div>
                      {item.store && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span>By {item.store.name}</span>

                          <svg 
                      className="w-4 h-4 sm:w-3 sm:h-3 flex-shrink-0" 
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
                          <path d="M26.97,16.3l-1.57,-2.57l0.78,-2.91c0.12,-0.46 -0.1,-0.95 -0.53,-1.15l-2.71,-1.32l-0.92,-2.87c-0.14,-0.46 -0.6,-0.74 -1.07,-0.69l-2.99,0.36l-2.32,-1.92c-0.37,-0.31 -0.91,-0.31 -1.28,0l-2.32,1.92l-2.99,-0.36c-0.47,-0.05 -0.93,0.23 -1.07,0.69l-0.92,2.87l-2.71,1.32c-0.43,0.2 -0.65,0.69 -0.53,1.15l0.78,2.91l-1.57,2.57c-0.25,0.41 -0.17,0.94 0.18,1.27l2.23,2.02l0.07,3.01c0.02,0.48 0.37,0.89 0.84,0.97l2.97,0.49l1.69,2.5c0.27,0.40 0.78,0.55 1.22,0.36l2.77,-1.19l2.77,1.19c0.13,0.05 0.26,0.08 0.39,0.08c0.33,0 0.64,-0.16 0.83,-0.44l1.69,-2.5l2.97,-0.49c0.47,-0.08 0.82,-0.49 0.84,-0.97l0.07,-3.01l2.23,-2.02c0.35,-0.33 0.43,-0.86 0.18,-1.27zM19.342,13.443l-4.438,5.142c-0.197,0.229 -0.476,0.347 -0.758,0.347c-0.215,0 -0.431,-0.069 -0.613,-0.211l-3.095,-2.407c-0.436,-0.339 -0.514,-0.967 -0.175,-1.403c0.339,-0.434 0.967,-0.516 1.403,-0.175l2.345,1.823l3.816,-4.422c0.359,-0.42 0.993,-0.465 1.41,-0.104c0.419,0.361 0.466,0.992 0.105,1.41z"></path>
                        </g>
                      </g>
                    </svg>

                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Second Row */}
              {allItems.length > 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  {allItems.slice(3).map((item) => (
                    <Link 
                      key={item.id} 
                      href={`/product/${item.id}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden block"
                    >
                      <div className="relative bg-gray-100">
                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 z-10">
                          <Heart className="w-4 h-4" />
                        </button>
                        {item.comparePrice && item.price < item.comparePrice && (
                          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                            {Math.round((1 - item.price / item.comparePrice) * 100)}% OFF
                          </div>
                        )}
                        <div className="aspect-square flex items-center justify-center overflow-hidden">
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={item.images[0].url} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-7xl">📦</div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
                          {item.comparePrice && item.comparePrice > item.price && (
                            <span className="text-sm text-gray-400 line-through">${item.comparePrice}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                              viewBox="0 0 24 24"
                              fill={i < 4 ? "currentColor" : "none"}
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                d="M12 2.5c.3 0 .6.2.7.5l2.1 4.3 4.7.7c.3 0 .6.3.7.6.1.3 0 .6-.2.8l-3.4 3.3.8 4.7c.1.3 0 .6-.2.8-.2.2-.5.3-.8.1L12 15.4l-4.2 2.2c-.3.2-.6.1-.8-.1-.2-.2-.3-.5-.2-.8l.8-4.7L4.2 8.7c-.2-.2-.3-.5-.2-.8.1-.3.4-.6.7-.6l4.7-.7L11.3 3c.1-.3.4-.5.7-.5z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ))}
                        </div>
                        {item.store && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <span>by {item.store.name}</span>
                            {item.store.logo && (
                              <span className="text-blue-500">✓</span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products or Services Found</h3>
              <p className="text-gray-600">This business hasn't added any products or services yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}