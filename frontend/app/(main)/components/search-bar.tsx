"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";

export const SearchBar = () => {
  const router = useRouter();
  return (
    <div className="bg-blue-50 h-48 flex items-center justify-center rounded-xl mb-8">
      <div className="flex max-w-4xl w-full bg-white mx-auto overflow-hidden rounded-lg">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search for deals near you on products, services, and more..."
            className="w-full h-[50px] border-0 rounded-none rounded-l-lg text-gray-500 text-lg px-6 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          onClick={() => router.push("/business/all")}
          className="h-[50px] bg-blue-500 hover:bg-blue-600 text-white rounded-none rounded-r-lg px-8 text-lg font-medium"
        >
          Search
        </Button>
      </div>
    </div>
  );
};
