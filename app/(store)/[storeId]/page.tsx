"use client";

import React from "react";
import { ArrowUpRight, ChevronDown, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStoreById } from "@/actions/store";
import { useParams } from "next/navigation";
import { LoadingState } from "@/app/components/skeletons/stores-skeleton-loader";
import { ErrorState } from "@/app/components/errors/error-state";
import ActivityCard from "./components/activity-card";
import PopularProducts from "./components/popular-products";

const DashboardPage = () => {
  const { storeId } = useParams();

  const {
    data: store,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId as string),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Failed to load store details" />;
  if (!store) return <ErrorState message="Store not found" />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Hello, {store.name.split(' ')[0] || 'Ignt'}!</h1>
          <p className="text-gray-600 text-sm">
            {store.tagline || "Welcome back to your store overview"}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm text-gray-700">Today</span>
          <Calendar className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <span className="text-blue-600 text-xl font-bold">$</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-2">Total Revenue</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900">$ 29.2K</h3>
            <div className="flex items-center text-green-500 text-xs bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>+12 This Month</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M17 17a2 2 0 11-4 0 2 2 0 014 0zM9 17a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-2">Total Orders</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900">125</h3>
            <div className="flex items-center text-green-500 text-xs bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>+12 This Month</span>
            </div>
          </div>
        </div>

        {/* Store Views */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-2">Store Views</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900">102K</h3>
            <div className="flex items-center text-green-500 text-xs bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>+12 This Month</span>
            </div>
          </div>
        </div>

        {/* Total Impressions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-2">Total Impressions</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900">646K</h3>
            <div className="flex items-center text-green-500 text-xs bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>+12 This Month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Store Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-blue-500 text-sm hover:underline font-medium">
              See all
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Product added</p>
                <p className="text-sm text-gray-500">Wireless Headphones</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">2 hours ago</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Category created</p>
                <p className="text-sm text-gray-500">Electronics</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">5 hours ago</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Store profile updated</p>
                <p className="text-sm text-gray-500">Business hours changed</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">1 day ago</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Campaign invite sent</p>
                <p className="text-sm text-gray-500">You sent an invite to Joan Fox</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">1 day ago</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Transaction made</p>
                <p className="text-sm text-gray-500">You paid $19 dollars to Alex</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">1 day ago</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Mega G Campaign ended</p>
                <p className="text-sm text-gray-500">Your campaign ended with excellent performance.</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">1 day ago</span>
            </div>
          </div>
        </div>

        {/* Store Traffic */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Store Traffic</h2>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <span className="text-sm text-gray-700">Week</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div className="h-[300px] flex items-end space-x-2 px-2">
            {[
              { day: "Sun", value: 200 },
              { day: "Mon", value: 180 },
              { day: "Tue", value: 300 },
              { day: "Wed", value: 600 },
              { day: "Thu", value: 550 },
              { day: "Fri", value: 180 },
              { day: "Sat", value: 500 },
            ].map((item, index) => (
              <div key={item.day} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  {/* Y-axis labels */}
                  {index === 0 && (
                    <div className="absolute left-2 h-[300px] flex flex-col justify-between text-xs text-gray-400 -ml-8">
                      <span>600</span>
                      <span>500</span>
                      <span>400</span>
                      <span>200</span>
                      <span>0</span>
                    </div>
                  )}
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-300 mb-2"
                    style={{
                      height: `${(item.value / 600) * 260}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders and Popular Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-blue-500 text-sm hover:underline font-medium">
              See all
            </button>
          </div>

          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-50">
                  <td className="py-4 font-medium text-gray-900">#3210</td>
                  <td className="text-gray-700">Sarah Johnson</td>
                  <td>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Delivered</span>
                  </td>
                  <td className="text-right font-semibold text-gray-900">$125.00</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-4 font-medium text-gray-900">#3209</td>
                  <td className="text-gray-700">Michael Chen</td>
                  <td>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">Processing</span>
                  </td>
                  <td className="text-right font-semibold text-gray-900">$74.50</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-4 font-medium text-gray-900">#3208</td>
                  <td className="text-gray-700">Emma Davis</td>
                  <td>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Delivered</span>
                  </td>
                  <td className="text-right font-semibold text-gray-900">$219.00</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-4 font-medium text-gray-900">#3207</td>
                  <td className="text-gray-700">James Wilson</td>
                  <td>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">Pending</span>
                  </td>
                  <td className="text-right font-semibold text-gray-900">$89.99</td>
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-900">#3206</td>
                  <td className="text-gray-700">Olivia Martinez</td>
                  <td>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Delivered</span>
                  </td>
                  <td className="text-right font-semibold text-gray-900">$152.75</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Popular Products</h2>
            <button className="text-blue-500 text-sm hover:underline font-medium">
              See all
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">Bluetooth Headphones</h4>
                <p className="text-xs text-gray-500 mt-1">85 sales • 124 in stock</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">Smartphone Case</h4>
                <p className="text-xs text-gray-500 mt-1">76 sales • 239 in stock</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">Wireless Charger</h4>
                <p className="text-xs text-gray-500 mt-1">54 sales • 89 in stock</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">Fitness Tracker</h4>
                <p className="text-xs text-gray-500 mt-1">43 sales • 38 in stock</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">USB-C Cable</h4>
                <p className="text-xs text-gray-500 mt-1">38 sales • 289 in stock</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;