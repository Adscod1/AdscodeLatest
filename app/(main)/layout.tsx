import React from "react";
import { FeedNavbar } from "./components/navbar";
import { Footer } from "./components/footer";

const FeedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <FeedNavbar />
      <main className="pt-24">{children}</main>
      
    </div>
  );
};

export default FeedLayout;
