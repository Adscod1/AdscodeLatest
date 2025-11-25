"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  activeTab:
    | "Basic Information"
    | "Sale Information"
    | "Delivery"
    | "Scheduling"
    | "Publishing";
  productId?: string;
  type?: "product" | "service";
}

export function ProductTabs({ activeTab, productId, type }: ProductTabsProps) {
  const { storeId } = useParams();
  const searchParams = useSearchParams();
  const isEdit = !!productId;
  
  // Get type from props or search params
  const itemType = type || searchParams.get("type") || "product";
  const basePath = itemType === "service" ? "service" : "product";

  const tabs = [
    {
      name: "Basic Information",
      href: isEdit
        ? `/${storeId}/${basePath}/${productId}/edit`
        : `/${storeId}/${basePath}/new${itemType === "service" ? "?type=service" : ""}`,
    },
    {
      name: "Sale Information",
      href: isEdit
        ? `/${storeId}/${basePath}/${productId}/edit/sale`
        : `/${storeId}/${basePath}/new/sale${itemType === "service" ? "?type=service" : ""}`,
    },
    {
      name: itemType === "service" ? "Scheduling" : "Delivery",
      href: isEdit
        ? `/${storeId}/${basePath}/${productId}/edit/delivery`
        : `/${storeId}/${basePath}/new/delivery${itemType === "service" ? "?type=service" : ""}`,
    },
    {
      name: "Publishing",
      href: isEdit
        ? `/${storeId}/${basePath}/${productId}/edit/publishing`
        : `/${storeId}/${basePath}/new/publishing${itemType === "service" ? "?type=service" : ""}`,
    },
  ];

  return (
    <div className="mb-6">
      <div className="overflow-x-auto">
        <nav className="flex space-x-2 sm:space-x-4 justify-center min-w-max sm:min-w-0" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.name === activeTab;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap flex-shrink-0",
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
    </div>
  );
}
