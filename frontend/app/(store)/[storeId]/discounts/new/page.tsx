"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Calendar, Plus } from 'lucide-react';

export default function CreateCouponModal() {
  const router = useRouter();
  const pathname = usePathname();
  const storeId = pathname.split("/")[1];
  
  const [discountType, setDiscountType] = useState('Percentage Discount');
  const [showDiscountDropdown, setShowDiscountDropdown] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [activateCoupon, setActivateCoupon] = useState(true);
  const [startDate, setStartDate] = useState('October 10th, 2025');
  const [endDate, setEndDate] = useState('October 10th, 2025');
  const [selectedEndDate, setSelectedEndDate] = useState(10);
  
  // Calendar navigation state
  const [startCalendarMonth, setStartCalendarMonth] = useState(9); // October (0-indexed)
  const [startCalendarYear, setStartCalendarYear] = useState(2025);
  const [endCalendarMonth, setEndCalendarMonth] = useState(9); // October (0-indexed)
  const [endCalendarYear, setEndCalendarYear] = useState(2025);

  const [formData, setFormData] = useState({
    couponTitle: '',
    couponCode: '',
    description: '',
    discountPercentage: '25',
    minimumOrderAmount: '0',
    usageLimit: '',
    categories: [],
    products: []
  });

  const discountTypes = [
    { icon: '%', label: 'Percentage Discount' },
    { icon: '$', label: 'Fixed Amount' },
    { icon: '🚚', label: 'Free Shipping' }
  ];

  const generateCode = () => {
    const code = 'SUMMER' + Math.floor(Math.random() * 100);
    setFormData({ ...formData, couponCode: code });
  };

  const handleDateSelect = (date: number) => {
    setSelectedEndDate(date);
    setEndDate(`${monthNames[endCalendarMonth]} ${date}th, ${endCalendarYear}`);
    setShowEndCalendar(false);
  };

  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const navigateStartMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (startCalendarMonth === 0) {
        setStartCalendarMonth(11);
        setStartCalendarYear(startCalendarYear - 1);
      } else {
        setStartCalendarMonth(startCalendarMonth - 1);
      }
    } else {
      if (startCalendarMonth === 11) {
        setStartCalendarMonth(0);
        setStartCalendarYear(startCalendarYear + 1);
      } else {
        setStartCalendarMonth(startCalendarMonth + 1);
      }
    }
  };

  const navigateEndMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (endCalendarMonth === 0) {
        setEndCalendarMonth(11);
        setEndCalendarYear(endCalendarYear - 1);
      } else {
        setEndCalendarMonth(endCalendarMonth - 1);
      }
    } else {
      if (endCalendarMonth === 11) {
        setEndCalendarMonth(0);
        setEndCalendarYear(endCalendarYear + 1);
      } else {
        setEndCalendarMonth(endCalendarMonth + 1);
      }
    }
  };

  const handleClose = () => {
    router.push(`/${storeId}/discounts`);
  };

  const handleCreateCoupon = () => {
    // Validate required fields
    if (!formData.couponTitle.trim()) {
      alert('Please enter a coupon title');
      return;
    }
    if (!formData.couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    // Create new coupon object
    const newCoupon = {
      id: Date.now(),
      code: formData.couponCode,
      title: formData.couponTitle,
      description: formData.description || `${formData.discountPercentage}% Off`,
      discountType,
      discountValue: formData.discountPercentage,
      minimumOrderAmount: formData.minimumOrderAmount,
      usage: { current: 0, total: parseInt(formData.usageLimit) || 0 },
      startDate,
      endDate,
      conversionRate: '0%',
      status: activateCoupon ? 'Active' : 'Inactive',
      categories: formData.categories,
      products: formData.products,
      customerGroups: 'All Customers',
      createdAt: new Date().toISOString()
    };

    // Get existing coupons from localStorage
    const existingCoupons = JSON.parse(localStorage.getItem(`coupons_${storeId}`) || '[]');
    
    // Add new coupon
    existingCoupons.push(newCoupon);
    
    // Save to localStorage
    localStorage.setItem(`coupons_${storeId}`, JSON.stringify(existingCoupons));

    // Navigate back to discount list
    router.push(`/${storeId}/discounts`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xl">🎟️</span>
              Create New Coupon
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Create a new discount coupon for your customers</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Coupon Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Summer Sale 25% Off"
                  value={formData.couponTitle}
                  onChange={(e) => setFormData({ ...formData, couponTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., SUMMER25"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button
                    onClick={generateCode}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Optional description for internal use"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Discount Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowDiscountDropdown(!showDiscountDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span>{discountTypes.find(d => d.label === discountType)?.icon}</span>
                      {discountType}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showDiscountDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {discountTypes.map((type) => (
                        <button
                          key={type.label}
                          onClick={() => {
                            setDiscountType(type.label);
                            setShowDiscountDropdown(false);
                          }}
                          className={`w-full px-3 py-2.5 text-sm text-left hover:bg-gray-100 flex items-center gap-2 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            discountType === type.label ? 'bg-gray-100 text-black font-medium' : 'text-gray-700'
                          }`}
                        >
                          <span>{type.icon}</span>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Discount Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  value={formData.minimumOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Usage Limit
                </label>
                <input
                  type="text"
                  placeholder="Leave empty for unlimited"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Validity Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {startDate}
                  </button>
                  
                  {showStartCalendar && (
                    <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80">
                      <div className="flex items-center justify-between mb-4">
                        <button 
                          onClick={() => navigateStartMonth('prev')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="font-semibold text-sm">{monthNames[startCalendarMonth]} {startCalendarYear}</span>
                        <button 
                          onClick={() => navigateStartMonth('next')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {[28, 29, 30].map((day) => (
                          <button
                            key={`prev-${day}`}
                            className="p-2 text-sm text-gray-400 hover:bg-gray-100 rounded-lg"
                          >
                            {day}
                          </button>
                        ))}
                        {getDaysInMonth().map((day) => (
                          <button
                            key={day}
                            onClick={() => {
                              setStartDate(`${monthNames[startCalendarMonth]} ${day}th, ${startCalendarYear}`);
                              setShowStartCalendar(false);
                            }}
                            className="p-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">{endDate}</span>
                  </button>
                  
                  {showEndCalendar && (
                    <div className="absolute z-20 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80">
                      <div className="flex items-center justify-between mb-4">
                        <button 
                          onClick={() => navigateEndMonth('prev')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="font-semibold text-sm">{monthNames[endCalendarMonth]} {endCalendarYear}</span>
                        <button 
                          onClick={() => navigateEndMonth('next')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {[28, 29, 30].map((day) => (
                          <button
                            key={`prev-${day}`}
                            className="p-2 text-sm text-gray-400 hover:bg-gray-100 rounded-lg"
                          >
                            {day}
                          </button>
                        ))}
                        {getDaysInMonth().map((day) => (
                          <button
                            key={day}
                            onClick={() => handleDateSelect(day)}
                            className={`p-2 text-sm rounded-lg transition-colors ${
                              day === selectedEndDate
                                ? 'bg-black text-white font-semibold'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Restrictions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Restrictions (Optional)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categories</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add category"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Products</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add product"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Status</h3>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={activateCoupon}
                  onChange={() => setActivateCoupon(!activateCoupon)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
              <span className="text-sm font-medium text-gray-900">Activate coupon immediately</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreateCoupon}
            className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Create Coupon
          </button>
        </div>
      </div>
    </div>
  );
}