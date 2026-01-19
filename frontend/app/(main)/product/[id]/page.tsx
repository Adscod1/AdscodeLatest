"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight,
  Play,
  ChevronDown,
  LucideShare2,
  ShareIcon
} from 'lucide-react';
import api from '@/lib/api-client';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  brand?: string | null;
  condition?: string | null;
  specifications?: string | null;
  vendor?: string | null;
  tags?: string | null;
  price: number;
  relatedProduct?: string | null;
  relatedProducts?: string | null;
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
  store?: {
    id: string;
    name: string;
    tagline?: string | null;
    description?: string | null;
    category?: string | null;
    logo?: string | null;
    banner?: string | null;
  };
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSize, setSelectedSize] = useState('L');
  const [activeTab, setActiveTab] = useState('details');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Check if the current item is a service
  const isService = product?.tags?.includes('SERVICE') || false;

  // Mock reviews data - replace with actual data from database
  const mockReviews: Review[] = [
    {
      id: '1',
      name: 'Arnie Haley',
      rating: 5,
      comment: 'Commodo consequat quis et dolor laboris in aute exceptua quis consequat culpa consectetur atque. Laborum cupidatat velit reprehenderit non cillum sunt sunt commodo.',
      date: '2 days ago',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      name: 'Green William',
      rating: 4,
      comment: 'Consectetur tempor nulla sapientem dis nostrud non. Non elit minim Lorem adipisicing elit veniam commodo non mollit dolore elit incididunt ut at eiusmod officia sunt.',
      date: '3 days ago',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      name: 'James Bower',
      rating: 5,
      comment: 'Ullamco enim ut culpa irure non qui est duis et aute proident reprehenderit tempor mollit. Aliquip excepteur nisl culpa reprehenderit adipisicing aliquip excepteur nulla mollit.',
      date: '5 days ago',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const mockIngredients = [
    {
      name: 'Hyaluronic acid',
      description: 'Elit do sit excepteur duis labore nisl sit anim adipisicing duis incididunt et anim sint sed exercitation aute consectetur irure',
      image: '/api/placeholder/200/150'
    },
    {
      name: 'Green tea',
      description: 'Tempor adipisicing aute pariatur magna enim Lorem voluptate incididunt culpa ex veniam sunt occaecat tempor',
      image: '/api/placeholder/200/150'
    },
    {
      name: 'Olive oil',
      description: 'Cupiditat culpa id do laboris nisl aliqua eu. Veniam aliqua duis esse adipisicing et minim velit quis',
      image: '/api/placeholder/200/150'
    }
  ];

  const mockFaqs = [
    {
      id: '1',
      question: 'Nisl nisl magna nostrud non consequat conse?',
      answer: 'Ullamco enim ut culpa irure non qui est duis et aute proident reprehenderit tempor mollit. Aliquip excepteur nisl culpa reprehenderit adipisicing aliquip excepteur nulla minim.'
    },
    {
      id: '2',
      question: 'Nostrud eiusmod exercitation duis?',
      answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
    },
    {
      id: '3',
      question: 'Velit duis ipsum sint consectetur id sint Lorem minim fugiat?',
      answer: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
    }
  ];

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch the specific product
        const response = await api.products.getById(productId);
        if (response.product) {
          setProduct(response.product as unknown as Product);
          
          // Fetch related products from the same store
          if (response.product.storeId) {
            const storeProductsResponse = await api.products.getByStore({ storeId: response.product.storeId });
            // Filter out current product and get first 4 related products
            const related = storeProductsResponse.products
              ?.filter(p => p.id !== productId)
              .slice(0, 4) || [];
            setRelatedProducts(related as unknown as Product[]);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const calculateDiscount = () => {
    if (product?.comparePrice && product.comparePrice > product.price) {
      return Math.round((1 - product.price / product.comparePrice) * 100);
    }
    return 0;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          <Link href="/business" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 py-8 sm px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <span>Adscod</span> / <span>Best selling</span> / <span>Sub-category</span> / 
          <span>Iphone 15 Pro</span> / <span className="text-gray-900 font-medium">Details</span>
        </nav>

        {/* Product Detail Section */}
        <div className="bg-white rounded shadow-sm p-6 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]?.url || product.images[0].url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    📦
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">{product.title}</h1>
                  {!isService && calculateDiscount() > 0 && (
                    <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Best seller
                    </span>
                  )}
                  {isService && product.vendor && (
                    <p className="text-gray-600 mt-1">{product.vendor}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M 35.478516 5.9804688 A 2.0002 2.0002 0 0 0 34.085938 9.4140625 L 35.179688 10.507812 C 23.476587 10.680668 14 20.256715 14 32 A 2.0002 2.0002 0 1 0 18 32 C 18 22.427546 25.627423 14.702715 35.154297 14.517578 L 34.085938 15.585938 A 2.0002 2.0002 0 1 0 36.914062 18.414062 L 41.236328 14.091797 A 2.0002 2.0002 0 0 0 41.228516 10.900391 L 36.914062 6.5859375 A 2.0002 2.0002 0 0 0 35.478516 5.9804688 z M 12.5 6 C 8.9338464 6 6 8.9338464 6 12.5 L 6 35.5 C 6 39.066154 8.9338464 42 12.5 42 L 35.5 42 C 39.066154 42 42 39.066154 42 35.5 L 42 28 A 2.0002 2.0002 0 1 0 38 28 L 38 35.5 C 38 36.903846 36.903846 38 35.5 38 L 12.5 38 C 11.096154 38 10 36.903846 10 35.5 L 10 12.5 C 10 11.096154 11.096154 10 12.5 10 L 20 10 A 2.0002 2.0002 0 1 0 20 6 L 12.5 6 z"></path>
                </svg>

                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-500">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(4)}
                </div>
                <span className="text-sm font-medium">4.5</span>
                <span className="text-sm text-gray-600">368 reviews</span>
                {!isService && <span className="text-sm text-gray-600"><span className='text-gray-600'>I </span> 823 sold</span>}
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {!isService && product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.comparePrice}
                  </span>
                )}
              </div>

              {isService ? (
                /* Service-specific UI */
                <div className="space-y-6 border-t pt-6">
                  {/* Service Duration - if available in variations */}
                  {product.variations?.some(v => v.name === 'duration') && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Flexible duration: {product.variations.find(v => v.name === 'duration')?.value}
                      </span>
                    </div>
                  )}

                  {/* Remote or On-site availability */}
                  <div className="flex items-center space-x-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Remote & On-site available</span>
                  </div>

                  {/* Team size */}
                  <div className="flex items-center space-x-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Team of 10+ consultants</span>
                  </div>

                  {/* Satisfaction guarantee */}
                  <div className="flex items-center space-x-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>100% satisfaction guarantee</span>
                  </div>

                  {/* Availability */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                    <p className="text-gray-700">
                      Weekdays - Available in 2 weeks
                    </p>
                  </div>

                  {/* Early Bird Special - if discount exists */}
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-blue-900 font-medium">
                          Early Bird Special - {calculateDiscount()}% OFF
                        </p>
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {calculateDiscount()}% OFF
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">
                        Book now and get 1 month free cancellation
                      </p>
                    </div>
                  )}

                  {/* Number of Sessions */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Number of Sessions</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600 ml-2">sessions</span>
                    </div>
                  </div>

                  {/* Service Action Buttons */}
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Add to cart
                    </button>
                    <button 
                      onClick={() => router.push(`/checkout?type=service&itemId=${product.id}&quantity=${quantity}`)}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ) : (
                /* Product-specific UI */
                <>
                  {/* Color Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                    <div className="flex space-x-2">
                      {['blue', 'gray', 'red', 'orange', 'yellow', 'purple', 'green', 'black', 'pink', 'violet', 'magenta', 'white'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-colors ${
                            selectedColor === color ? 'border-gray-100' : 'border-gray-100'
                          } ${
                            color === 'blue' ? 'bg-blue-500' :
                            color === 'red' ? 'bg-red-500' :
                            color === 'orange' ? 'bg-orange-500' :
                            color === 'yellow' ? 'bg-yellow-400' :
                            color === 'purple' ? 'bg-purple-500' :
                            color === 'green' ? 'bg-green-500' :
                            color === 'black' ? 'bg-black' :
                            color === 'pink' ? 'bg-pink-400' :
                            color === 'violet' ? 'bg-violet-500' :
                            color === 'magenta' ? 'bg-pink-600' :
                            color === 'gray' ? 'bg-gray-400' : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-900 mb-2">Size</h3>
                    <div className="flex space-x-2">
                      {['XL', 'L', 'M', 'S', 'XS'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-center border rounded-full transition-colors ${
                            selectedSize === size
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery</h3>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded">
                      <option>AAA Standard delivery - 21a UK Mall, Kabalagala: UGX.5000</option>
                    </select>
                  </div>

                  {/* Promotion */}
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-medium">Mastermind - 10% OFF</span>
                      <span className="text-blue-600">Buy 3 get 1</span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-gray-100 text-gray-900 py-3 px-6 rounded font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to cart</span>
                    </button>
                    <button 
                      onClick={() => router.push(`/checkout?type=product&itemId=${product.id}&quantity=${quantity}`)}
                      className="flex-1 bg-blue-500 text-white py-3 px-6 rounded font-medium hover:bg-blue-600 transition-colors"
                    >
                      Check out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'details', label: 'Product Details' },
                { key: 'reviews', label: 'Reviews (368)' },
                { key: 'store', label: 'About Store' }
              ].map((tab) => (
                
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-bold text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
                {product.category && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900">Category</h4>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                )}
                {product.vendor && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900">Vendor</h4>
                    <p className="text-gray-600">{product.vendor}</p>
                  </div>
                )}

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900">Brand</h4>
                    <p className="text-gray-600">{product.brand}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900">Condition</h4>
                    <p className="text-gray-600">{product.condition}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900">Specification</h4>
                    <p className="text-gray-600">{product.specifications}</p>
                  </div>
                  </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Reviews Summary */}
                <div className="flex items-center space-x-8 mb-8 p-6 bg-gray-50 rounded">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-1">4.5</div>
                    <div className="flex items-center justify-center mb-1">
                      {renderStars(4)}
                    </div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-3 mb-1">
                        <span className="w-3 text-sm text-gray-600">{rating}</span>
                        <Star className="w-4 h-4 text-gray-50" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: rating === 5 ? '60%' : rating === 4 ? '25%' : rating === 3 ? '10%' : rating === 2 ? '3%' : '0%'
                            }}
                          />
                        </div>
                        <span className="w-8 text-sm text-gray-600 text-right">
                          {rating === 5 ? '60%' : rating === 4 ? '25%' : rating === 3 ? '10%' : rating === 2 ? '5%' : '0%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border rounded border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{review.name}</h4>
                            {review.avatar}
                            
                <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" 
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

                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'store' && (
              <div>
                {product.store ? (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{product.store.name}</h3>
                    {product.store.tagline && (
                      <p className="text-gray-600 mb-4">{product.store.tagline}</p>
                    )}
                    {product.store.description && (
                      <p className="text-gray-600 leading-relaxed">{product.store.description}</p>
                    )}
                    {product.store.category && (
                      <div className="mt-4">
                        <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {product.store.category}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Store information not available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Related products</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <img
                          src={relatedProduct.images[0].url}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {relatedProduct.title}
                      </h3>
                      <p className='flex text-center font-medium text-gray-600 text-xs'></p>
                      <span className=" flex truncate text-sm text-center text-gray-600 space-x-1 space-y-1"> <p>By</p> {relatedProduct.store?.name}
                      
                      <svg 
                    className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" 
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
                  </span>

                      <p className='line-clamp-2 text-left text-gray-500 mb-4'>{relatedProduct.description}</p>
                      <div className="flex items-center space-x-1 mb-2">
                        {renderStars(4)}
                        <span className="text-sm text-gray-600">(123)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">${relatedProduct.price}</span>
                        {relatedProduct.comparePrice && relatedProduct.comparePrice > relatedProduct.price && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ${relatedProduct.comparePrice}
                            </span>
                            <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full p-x-4">
                              {Math.round((1 - relatedProduct.price / relatedProduct.comparePrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="bg-white rounded shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 leading-relaxed">
                  Consectetur excepteur elit ullamco incididunt voluptate tempor exercitation. Lorem commodo ullamco quis velit officia aute laboris elit sit exercitation ut esse pariatur occaecat quis
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Laboris consequat ad</h3>
                  <p className="text-gray-600 text-sm">
                    Consectetur excepteur elit ullamco incididunt voluptate tempor exercitation. Lorem commodo ullamco quis velit officia aute laboris elit sit exercitation ut esse pariatur
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Duis duis do labore pariatur</h3>
                  <p className="text-gray-600 text-sm">
                    Ad qui aliqua nulla nostrud consequat laboris nostrud commodo voluptate. Lorem id qui laborum aute voluptate
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Deserunt ex</h3>
                  <p className="text-gray-600 text-sm">
                    Cupidatat culpa id do laboris nisl aliqua eu. Veniam aliqua duis Lorem adipisicing et minim velit quis
                  </p>
                </div>
              </div>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded overflow-hidden">
              <img
                src="/api/placeholder/400/400"
                alt="Product benefits"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="bg-white rounded shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
          
          <div className="mt-4">
                    <div className="grid md:grid-cols-3 gap-6">
                      {mockIngredients.map((ingredient, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded">
                          <div className="relative w-full h-60 bg-gray-200 rounded overflow-hidden mb-6">
                            <img
                              src={ingredient.image}
                              alt={ingredient.name}
                              className="max-w-full max-h-full object-cover"
                            />
                          </div>

                        
                          <h4 className=" font-semibold text-gray-900 mb-2">{ingredient.name}</h4>
                          <p className="text-gray-600 text-sm">{ingredient.description}</p>
                          </div>
                      ))}
                    </div>
                    </div>

          {/* <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {mockIngredients.map((ingredient, index) => (
                <div key={index} className="flex-shrink-0 w-64">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{ingredient.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {ingredient.description}
                  </p>
                </div>
              ))}
            </div>
            
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div> */}
        </div>

        {/* How to Use Section */}
        <div className="bg-white rounded shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to use</h2>
          
          <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
            <img
              src="/api/placeholder/800/400"
              alt="How to use"
              className="w-full h-full object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-colors">
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                <Play className="w-8 h-8 text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">FAQs</h2>
          
          <div className="space-y-4">
            {mockFaqs.map((faq) => (
              <div key={faq.id} className="border border-gray-100 rounded">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}