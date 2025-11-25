"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getProductById } from '@/actions/product';

interface Product {
  id: string;
  title: string;
  description?: string | null;
  vendor?: string | null;
  tags?: string | null;
  price: number;
  comparePrice?: number | null;
  images: { id: string; url: string; productId: string }[];
  store?: {
    name: string;
  };
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const itemType = searchParams.get('type') || 'product'; // 'product' or 'service'
  const itemId = searchParams.get('itemId');
  const quantity = parseInt(searchParams.get('quantity') || '1');
  
  const [step, setStep] = useState<'checkout' | 'confirmation'>('checkout');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  });

  const isService = itemType === 'service';

  useEffect(() => {
    const fetchProduct = async () => {
      if (!itemId) {
        setLoading(false);
        return;
      }
      
      try {
        const productData = await getProductById(itemId);
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [itemId]);

  const calculateTotals = () => {
    if (!product) return { subtotal: 0, tax: 0, total: 0 };
    
    const subtotal = product.price * quantity;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment here
    setStep('confirmation');
  };

  const isFormValid = () => {
    return formData.fullName && 
           formData.email && 
           formData.phone &&
           formData.cardNumber &&
           formData.nameOnCard &&
           formData.expiryDate &&
           formData.cvv &&
           (!isService || (formData.streetAddress && formData.city && formData.zipCode));
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
          <p className="text-gray-600 mb-4">The item you're trying to checkout doesn't exist.</p>
          <Link href="/business" className="text-blue-600 hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Banner */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isService ? 'Booking Confirmed!' : 'Order Confirmed!'}
            </h1>
            <p className="text-gray-600 mb-4">
              {isService 
                ? "Your booking has been successfully confirmed. We've sent a confirmation email to"
                : "Your order has been successfully placed. We've sent a confirmation email to"
              }
            </p>
            <p className="text-blue-600 font-medium">{formData.email}</p>
            
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-block mt-4">
              <span className="font-semibold">
                {isService ? 'Booking ID:' : 'Order ID:'} BK-2024-001234
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Service/Product Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isService ? 'Service Details' : 'Product Details'}
              </h2>
              
              <div className="mb-4">
                <img
                  src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <h3 className="font-bold text-gray-900 mb-1">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.store?.name || product.vendor || 'Store'}</p>

              {isService && (
                <>
                  <div className="flex items-center text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Start Date: January 15, 2024</span>
                  </div>
                  <div className="flex items-center text-gray-700 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Duration: {quantity} {quantity > 1 ? 'sessions' : 'session'}</span>
                  </div>
                </>
              )}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span className="font-medium">Total Paid</span>
                  <span className="font-bold text-xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Details</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium">Full Name</span>
                  </div>
                  <p className="text-gray-900 ml-6">{formData.fullName}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-gray-900 ml-6">{formData.email}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="text-gray-900 ml-6">{formData.phone}</p>
                </div>

                {isService && formData.streetAddress && (
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">Address</span>
                    </div>
                    <p className="text-gray-900 ml-6">
                      {formData.streetAddress}<br />
                      {formData.city}, {formData.zipCode}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      {isService 
                        ? 'Check your email for booking confirmation'
                        : 'Check your email for order confirmation'
                      }
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      {isService
                        ? 'Provider will contact you within 24 hours'
                        : 'Track your order status in My Orders'
                      }
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      {isService
                        ? 'Save your booking ID for reference'
                        : 'Prepare for delivery in 3-5 business days'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            <Link href="/business/all">
              <button className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Browse More {isService ? 'Services' : 'Products'}
              </button>
            </Link>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions about your {isService ? 'booking' : 'order'}, please contact our support team.
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/product/${itemId}`}>
            <button className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {isService ? 'Service' : 'Product'}
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Billing Address - Show for services */}
              {isService && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Billing Address</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        placeholder="123 Main St, Apt 4B"
                        required={isService}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          required={isService}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="10001"
                          required={isService}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {isService ? '3' : '2'}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={19}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        maxLength={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Booking Button */}
              <button
                type="submit"
                disabled={!isFormValid()}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isService ? 'Complete Booking' : 'Complete Purchase'}
              </button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                <div className="mb-4">
                  <img
                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>

                <h3 className="font-bold text-gray-900 mb-1">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.store?.name || product.vendor || 'Store'}</p>
                {isService && (
                  <p className="text-gray-600 text-sm mb-4">
                    {quantity} {quantity > 1 ? 'sessions' : 'session'}
                  </p>
                )}
                {!isService && (
                  <p className="text-gray-600 text-sm mb-4">Quantity: {quantity}</p>
                )}

                <div className="border-t border-b py-4 my-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                  <p className="mb-2">
                    By completing this {isService ? 'booking' : 'purchase'}, you agree to our{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
