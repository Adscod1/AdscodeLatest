import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <div className="py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to transform your Social Commerce Business?
        </h2>
        <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
          Join thousands of Influencers, creators and businesses already using
          Adscod to create meaningful partnerships and drive growth
        </p>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-6 text-lg font-medium rounded-md ">
          Get Started <ArrowRight className=" h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
