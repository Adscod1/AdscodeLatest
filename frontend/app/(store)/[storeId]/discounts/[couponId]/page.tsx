"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CouponDetailsPage() {
  const params = useParams();
  const storeId = params?.storeId as string;
  const couponId = params?.couponId as string;

  // Mock data - in production, fetch this based on couponId
  const couponData = {
    id: parseInt(couponId || '1'),
    code: 'SUMMER25',
    title: 'Summer Sale',
    discount: '25% Off',
    discountValue: 'Discount Value',
    status: 'Active',
    totalRevenue: '$45,230',
    usageCount: '347',
    avgOrderValue: '$130.35',
    conversionRate: '8.4%',
    startDate: '01/06/2024',
    endDate: '31/08/2024',
    minimumOrder: '$50',
    peakUsageTime: '2-4 PM',
    redemptionProgress: {
      current: 347,
      total: 1000,
      percentage: 34.7
    },
    topProducts: [
      { name: 'Blue Sneakers', rank: '#1' },
      { name: 'Running Shoes', rank: '#2' },
      { name: 'Sports Wear', rank: '#3' }
    ],
    restrictions: {
      applicableCategories: ['Footwear', 'Sportswear'],
      customerGroups: 'All Customers'
    },
    customerSegments: [
      { segment: 'New Customers', devices: '145 customers', percentage: 42 },
      { segment: 'Returning Customers', devices: '100 customers', percentage: 43 },
      { segment: 'VIP Customers', devices: '52 customers', percentage: 15 }
    ],
    deviceData: [
      { device: 'Mobile', percentage: 68 },
      { device: 'Desktop', percentage: 25 },
      { device: 'Tablet', percentage: 7 }
    ],
    geographyData: [
      { region: 'North America', percentage: 52 },
      { region: 'Europe', percentage: 28 },
      { region: 'Asia', percentage: 15 },
      { region: 'Others', percentage: 5 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/${storeId}/discounts`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{couponData.title}</h1>
              <p className="text-sm text-gray-500">Code: {couponData.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{couponData.totalRevenue}</div>
          <div className="text-xs text-green-600">↑ +12%</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Usage Count</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{couponData.usageCount}</div>
          <div className="text-xs text-green-600">↑ +8%</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Avg Order Value</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{couponData.avgOrderValue}</div>
          <div className="text-xs text-green-600">↑ +5%</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{couponData.conversionRate}</div>
          <div className="text-xs text-green-600">↑ +2%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Coupon Information Card 1 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Coupon Information</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {couponData.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">%</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{couponData.discountValue}</div>
                  <div className="text-xl font-bold text-gray-900">{couponData.discount}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600 mb-2">{couponData.code}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Start Date</div>
                <div className="font-semibold text-gray-900">{couponData.startDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">End Date</div>
                <div className="font-semibold text-gray-900">{couponData.endDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Minimum Order</div>
                <div className="font-semibold text-gray-900">{couponData.minimumOrder}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Peak Usage Time</div>
                <div className="font-semibold text-gray-900">{couponData.peakUsageTime}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Redemption Progress</div>
              <div className="text-sm font-semibold text-gray-900 mb-2">
                {couponData.redemptionProgress.current} used
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${couponData.redemptionProgress.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {couponData.redemptionProgress.percentage}% of limit reached
              </div>
              <div className="text-right text-sm text-gray-500 mt-1">
                {1000 - couponData.redemptionProgress.current} remaining
              </div>
            </div>
          </div>

          {/* Coupon Information Card 2 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Coupon Information</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                {couponData.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">%</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{couponData.discountValue}</div>
                  <div className="text-xl font-bold text-gray-900">{couponData.discount}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600 mb-2">{couponData.code}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Start Date</div>
                <div className="font-semibold text-gray-900">{couponData.startDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">End Date</div>
                <div className="font-semibold text-gray-900">{couponData.endDate}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Minimum Order</div>
                <div className="font-semibold text-gray-900">{couponData.minimumOrder}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Peak Usage Time</div>
                <div className="font-semibold text-gray-900">{couponData.peakUsageTime}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Redemption Progress</div>
              <div className="text-sm font-semibold text-gray-900 mb-2">
                {couponData.redemptionProgress.current} used
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${couponData.redemptionProgress.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {couponData.redemptionProgress.percentage}% of limit reached
              </div>
              <div className="text-right text-sm text-gray-500 mt-1">
                {1000 - couponData.redemptionProgress.current} remaining
              </div>
            </div>

            {/* Customer Segments */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Customer Segments</h4>
              <div className="space-y-3">
                {couponData.customerSegments.map((segment, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{segment.segment}</span>
                      <span className="text-sm font-medium text-gray-600">{segment.devices}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">{segment.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Devices</h4>
              <div className="space-y-3">
                {couponData.deviceData.map((device, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{device.device}</span>
                      <span className="text-sm font-medium text-gray-600">{device.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geography */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Geography</h4>
              <div className="space-y-3">
                {couponData.geographyData.map((geo, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{geo.region}</span>
                      <span className="text-sm font-medium text-gray-600">{geo.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${geo.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
              {couponData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm font-bold">{product.rank}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{product.rank}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restrictions</h3>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-2">Applicable Categories</div>
              <div className="flex gap-2">
                {couponData.restrictions.applicableCategories.map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">Customer Groups</div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {couponData.restrictions.customerGroups}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}