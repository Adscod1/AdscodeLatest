import React from "react";
import { FeedNavbar } from "./components/navbar";
import { SearchProvider } from "@/contexts/SearchContext";

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SearchProvider>
      <div className="min-h-screen">
        <FeedNavbar />
        <main className="pt-4">{children}</main>
        
      </div>
    </SearchProvider>
  );
};

export default FeedLayout;
