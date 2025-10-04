"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { ProductTabs } from "../../../product/components/product-tabs";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ServiceDeliveryInput {
  requiresBooking?: boolean;
  storeId: string;
}

const ServiceDeliveryInfo = () => {
  const { storeId } = useParams();
  const router = useRouter();

  const { handleSubmit, setValue, watch } = useForm<ServiceDeliveryInput>({
    defaultValues: {
      storeId: storeId as string,
      requiresBooking: false,
    },
  });

  const onSubmit = (data: ServiceDeliveryInput) => {
    console.log("Service delivery data:", data);
    router.push(`/${storeId}/service/new/publishing?type=service`);
  };

  const handleBack = () => {
    router.push(`/${storeId}/service/new/sale?type=service`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-white border-b">
        <Button
          variant="ghost"
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={handleBack}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>Continue</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProductTabs activeTab="Scheduling" type="service" />
        
        {/* Scheduling & Availability Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-6 border-b">
            <h2 className="text-xl sm:text-2xl font-semibold">Scheduling & Availability</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure booking and availability
            </p>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
              {/* Requires Booking Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresBooking"
                  checked={watch("requiresBooking")}
                  onCheckedChange={(checked) => setValue("requiresBooking", checked as boolean)}
                />
                <Label htmlFor="requiresBooking" className="text-sm font-normal">
                  Requires booking/appointment
                </Label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDeliveryInfo;