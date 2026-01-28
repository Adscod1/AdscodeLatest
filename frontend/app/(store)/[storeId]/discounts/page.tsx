"use client";
import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, TrendingUp, DollarSign, Users, BarChart3, MoreVertical, Plus, Eye, Edit, Copy, Trash2 } from 'lucide-react';

export default function CouponsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const storeId = pathname.split("/")[1];
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const [customCoupons, setCustomCoupons] = useState<any[]>([]);

  const coupons = [
    {
      id: 1,
      code: 'SUMMER25',
      title: 'Summer Sale 25% Off',
      description: '25% Off • Min order: $100',
      usage: { current: 347, total: 1000 },
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      conversionRate: '35%',
      status: 'Active',
      categories: ['Summer Collection', 'Sandals'],
      customerGroups: 'All Customers'
    },
    {
      id: 2,
      code: 'FIRST15',
      title: 'First Time Customer Discount',
      description: '15% Off',
      usage: { current: 123, total: 500 },
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      conversionRate: '25%',
      status: 'Active',
      customerGroups: 'New Customers'
    },
    {
      id: 3,
      code: 'FIRST15',
      title: 'First Time Customer Discount',
      description: '15% Off',
      usage: { current: 123, total: 500 },
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      conversionRate: '25%',
      status: 'Active',
      customerGroups: 'New Customers'
    },
    {
      id: 4,
      code: 'FREESHIP',
      title: 'Free Shipping',
      description: 'Free Shipping • Min order: $75',
      usage: { current: 856, total: 2000 },
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      conversionRate: '43%',
      status: 'Active',
      customerGroups: 'All Customers'
    },
    {
      id: 5,
      code: 'SAVE50',
      title: '$50 Off Orders Over $200',
      description: '$50 Off • Min order: $200',
      usage: { current: 45, total: 200 },
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      conversionRate: '23%',
      applicants: 120,
      status: 'Active',
      products: 'Premium Sneakers',
      customerGroups: 'VIP Customers'
    },
    {
      id: 6,
      code: 'HOLIDAY30',
      title: 'Holiday Special 30% Off',
      description: '30% Off • Min order: $150',
      usage: { current: 500, total: 500 },
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      conversionRate: '100%',
      status: 'Expired',
      categories: ['Winter Collection'],
      customerGroups: 'All Customers'
    }
  ];

  // Load custom coupons from localStorage on mount
  useEffect(() => {
    const savedCoupons = JSON.parse(localStorage.getItem(`coupons_${storeId}`) || '[]');
    setCustomCoupons(savedCoupons);
  }, [storeId]);

  // Combine mock coupons with custom coupons
  const allCoupons = [...customCoupons, ...coupons];

  const stats = [
    { label: 'Active Coupons', value: '4', subtext: '5 total coupons', icon: null },
    { label: 'Total Redemptions', value: '1,871', subtext: '+15% from last month', icon: Users },
    { label: 'Avg. Usage Rate', value: '45%', subtext: 'Coupon effectiveness', icon: TrendingUp },
    { label: 'Revenue Impact', value: '$12,450', subtext: 'Generated this month', icon: DollarSign }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(ref => 
        !ref || !ref.contains(event.target as Node)
      );
      
      if (clickedOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (couponId: number) => {
    setOpenDropdown(openDropdown === couponId ? null : couponId);
  };

  const handleMenuAction = (action: string, coupon: any) => {
    setOpenDropdown(null);
    
    switch (action) {
      case 'view':
        // Navigate to coupon details
        console.log('Navigating to:', `/${storeId}/coupons/${coupon.id}`);
        router.push(`/${storeId}/discounts/${coupon.id}`);
        break;
      case 'edit':
        // Navigate to edit coupon
        console.log('Edit coupon:', coupon);
        break;
      case 'duplicate':
        // Duplicate coupon logic
        console.log('Duplicate coupon:', coupon);
        break;
      case 'delete':
        // Delete coupon logic
        console.log('Delete coupon:', coupon);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Coupons and Discounts</h1>
        <Link
                href={`/${storeId}/discounts/new`}
                className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Coupon</span>
                <span className="sm:hidden">Create</span>
              </Link>
              </div>
        <p className="text-xs sm:text-sm text-gray-600">Manage promotional codes and discount campaigns</p>
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded p-3 sm:p-4 md:p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600 tracking-wide truncate pr-2">
                {stat.label}
              </span>
              {stat.icon && <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />}
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs text-blue-500 truncate">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded shadow-sm border border-gray-100">
        {/* Search and Filters */}
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Expired</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Types</option>
                <option>Percentage</option>
                <option>Fixed Amount</option>
                <option>Free Delivery</option>
              </select>
              
            </div>
          </div>
        </div>

        {/* Coupons List */}
        <div className="divide-y divide-gray-100">
          {allCoupons.map((coupon) => (
            <div key={coupon.id} className="p-3 sm:p-4 md:p-5 hover:bg-blue-50 transition-colors">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {coupon.title}
                        </h3>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full self-start">
                          {coupon.code}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{coupon.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-base ${
                        coupon.status === 'Active' 
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {coupon.status}
                      </span>
                      <div className="relative" ref={el => { dropdownRefs.current[coupon.id] = el; }}>
                        <button 
                          onClick={() => handleDropdownToggle(coupon.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        
                        {openDropdown === coupon.id && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <button
                              onClick={() => handleMenuAction('view', coupon)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleMenuAction('edit', coupon)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleMenuAction('duplicate', coupon)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => handleMenuAction('delete', coupon)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    
                    {/* Usage */}
                    <div className="col-span-2 lg:col-span-1">
                      <div className="text-xs text-gray-500 mb-1">Usage</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                        {coupon.usage.current} / {coupon.usage.total}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500                          sed -n '280,330p' /Users/admin/Documents/Adscodfinal/AdscodeLatest/frontend/app/\(store\)/\[storeId\]/discounts/page.tsx h-1.5 rounded-full transition-all"
                          style={{ width: `${(coupon.usage.current / coupon.usage.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Start Date */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Start Date</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-900">
                        {coupon.startDate}
                      </div>
                    </div>

                    {/* End Date */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">End Date</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-900">
                        {coupon.endDate}
                      </div>
                    </div>

                    {/* Conversion Rate */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Conversion Rate</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-900">
                        {coupon.conversionRate}
                      </div>
                    </div>
                  </div>


                  {/* Additional Info */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
                    {coupon.categories && (
                      <div className="truncate">
                        <span className="text-gray-500">Categories: </span>
                        <span className="text-gray-700">
                          {coupon.categories.join(', ')}
                        </span>
                      </div>
                    )}
                    {coupon.products && (
                      <div className="truncate">
                        <span className="text-gray-500">Products: </span>
                        <span className="text-gray-700">{coupon.products}</span>
                      </div>
                    )}
                    {coupon.customerGroups && (
                      <div className="truncate">
                        <span className="text-gray-500">Customer Groups: </span>
                        <span className="text-gray-700">{coupon.customerGroups}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}