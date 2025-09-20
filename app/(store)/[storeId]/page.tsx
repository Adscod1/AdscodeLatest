"use client";

import React from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
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
    <div>
      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">{store.name}</h1>
          <p className="text-gray-600 text-sm">
            {store.tagline || "Welcome back to your store overview"}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          <span className="text-sm">Today</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-white p-4 rounded-xl mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">Contact</p>
            <p className="font-medium">{store.phone || "Not provided"}</p>
            <p className="text-xs">{store.email || "No email"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-medium">{store.address || "Not provided"}</p>
            <p className="text-xs">
              {[store.city, store.state, store.country]
                .filter(Boolean)
                .join(", ") || "No location"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Business Details</p>
            <p className="font-medium">
              Reg: {store.regNumber || "Not provided"}
            </p>
            <p className="text-xs">Est. {store.yearEstablished || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">$</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">$ 29.2K</h3>
            <div className="flex items-center text-green-500 text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12 This Month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">🛒</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Orders</p>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">125</h3>
            <div className="flex items-center text-green-500 text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12 This Month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👁️</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Store Views</p>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">102K</h3>
            <div className="flex items-center text-green-500 text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12 This Month</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Impressions</p>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">646K</h3>
            <div className="flex items-center text-green-500 text-xs">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12 This Month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Store Traffic */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Activity */}
        <ActivityCard />

        {/* Store Traffic */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Store Traffic</h2>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <span className="text-sm">Week</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className="h-[300px] flex items-end space-x-4">
            {[
              { day: "Sun", value: 200 },
              { day: "Mon", value: 180 },
              { day: "Tue", value: 250 },
              { day: "Wed", value: 600 },
              { day: "Thu", value: 450 },
              { day: "Fri", value: 180 },
              { day: "Sat", value: 400 },
            ].map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-300"
                  style={{
                    height: `${(item.value / 600) * 100}%`,
                  }}
                ></div>
                <span className="mt-2 text-sm text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders and Popular Products */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <button className="text-blue-500 text-sm hover:underline">
              See all
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-3 font-normal">Order</th>
                <th className="pb-3 font-normal">Customer</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-50">
                <td className="py-2.5">#3210</td>
                <td>Sarah Johnson</td>
                <td>
                  <span className="text-green-500">Delivered</span>
                </td>
                <td className="text-right">$125.00</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5">#3209</td>
                <td>Michael Chen</td>
                <td>
                  <span className="text-blue-500">Processing</span>
                </td>
                <td className="text-right">$74.50</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5">#3208</td>
                <td>Emma Davis</td>
                <td>
                  <span className="text-green-500">Delivered</span>
                </td>
                <td className="text-right">$219.00</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-2.5">#3207</td>
                <td>James Wilson</td>
                <td>
                  <span className="text-yellow-500">Pending</span>
                </td>
                <td className="text-right">$89.99</td>
              </tr>
              <tr>
                <td className="py-2.5">#3206</td>
                <td>Olivia Martinez</td>
                <td>
                  <span className="text-green-500">Delivered</span>
                </td>
                <td className="text-right">$152.75</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Popular Products */}
        <PopularProducts />
      </div>
    </div>
  );
};

export default DashboardPage;
