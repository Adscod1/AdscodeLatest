import React from "react";
import { Footer } from "../(main)/components/footer";
import { FeedNavbar } from "../(main)/components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <FeedNavbar />
      {children}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
