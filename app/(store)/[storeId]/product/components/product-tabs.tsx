"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  activeTab:
    | "Basic Information"
    | "Sale Information"
    | "Delivery"
    | "Publishing";
  productId?: string;
}

export function ProductTabs({ activeTab, productId }: ProductTabsProps) {
  const { storeId } = useParams();
  const isEdit = !!productId;

  const tabs = [
    {
      name: "Basic Information",
      href: isEdit
        ? `/${storeId}/product/${productId}/edit`
        : `/${storeId}/product/new`,
    },
    {
      name: "Sale Information",
      href: isEdit
        ? `/${storeId}/product/${productId}/edit/sale`
        : `/${storeId}/product/new/sale`,
    },
    {
      name: "Delivery",
      href: isEdit
        ? `/${storeId}/product/${productId}/edit/delivery`
        : `/${storeId}/product/new/delivery`,
    },
    {
      name: "Publishing",
      href: isEdit
        ? `/${storeId}/product/${productId}/edit/publishing`
        : `/${storeId}/product/new/publishing`,
    },
  ];

  return (
    <div className="mb-6">
      <nav className="flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.name === activeTab;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md",
                isActive
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-500 hover:text-gray-700"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
