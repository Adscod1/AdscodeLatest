import React from "react";
import { Footer } from "../(main)/components/footer";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      
      {children}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
