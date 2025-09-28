"use client";
import { Plus, Search, LayoutDashboard, Package, Megaphone, Star, TrendingUp, Search as SearchIcon, Smile, Ticket, MessageSquare, Bell, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { UserAuthButton } from "../(main)/components/UserAuthButton";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const storeId = pathname.split("/")[1];

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/") return true;
    return pathname.includes(path);
  };

  const getLinkClassName = (path: string) => {
    const baseClasses =
      "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium";
    return isActive(path)
      ? `${baseClasses} text-white bg-black hover:bg-gray-800`
      : `${baseClasses} text-gray-600 hover:text-gray-900 hover:bg-gray-50`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Adscod</h1>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">MENU</h2>
            <nav className="space-y-1">
              <Link
                href={`/${storeId}`}
                className={getLinkClassName("/dashboard")}
              >
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Dashboard
              </Link>
              <Link
                href={`/${storeId}/listings`}
                className={getLinkClassName("/listings")}
              >
                <Package className="w-4 h-4 mr-3" />
                Listings
              </Link>
              <Link href={`/${storeId}/campaign`} className={getLinkClassName("/campaign")}>
                <Megaphone className="w-4 h-4 mr-3" />
                Campaigns
              </Link>
              <Link href={`/${storeId}/creator-studio`} className={getLinkClassName("/creator-studio")}>
                <Settings className="w-4 h-4 mr-3" />
                Creator Studio
              </Link>
              <Link href={`/${storeId}/reviewss`} className={getLinkClassName("/reviewss")}>
                <Star className="w-4 h-4 mr-3" />
                Reviews
              </Link>
              <Link href={`/${storeId}/analytics`} className={getLinkClassName("/analytics")}>
                <TrendingUp className="w-4 h-4 mr-3" />
                Analytics
              </Link>
              <Link
                href={`/${storeId}/competitor-analysis`}
                className={getLinkClassName("/competitor-analysis")}
              >
                <SearchIcon className="w-4 h-4 mr-3" />
                Competitor Analysis
              </Link>
              <Link
                href={`/${storeId}/sentiment-analysis`}
                className={getLinkClassName("/sentiment-analysis")}
              >
                <Smile className="w-4 h-4 mr-3" />
                Sentiment Analysis
              </Link>
              <Link href={`/${storeId}/coupons`} className={getLinkClassName("/coupons")}>
                <Ticket className="w-4 h-4 mr-3" />
                Coupons
              </Link>
            </nav>
          </div>

          {/* Personal Section */}
          <div className="space-y-1 mt-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">PERSONAL</h2>
            <nav className="space-y-1">
              <Link href="/messages" className={getLinkClassName("/messages")}>
                <MessageSquare className="w-4 h-4 mr-3" />
                Messages
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  14+
                </span>
              </Link>
              <Link href="/notifications" className={getLinkClassName("/notifications")}>
                <Bell className="w-4 h-4 mr-3" />
                Notifications
              </Link>
              <Link href="/settings" className={getLinkClassName("/settings")}>
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Link>
            </nav>
          </div>
        </div>

        {/* User Profile at bottom */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">IG</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Iga</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search order ID..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <UserAuthButton />
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default StoreLayout;