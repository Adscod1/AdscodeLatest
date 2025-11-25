"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { ProductTabs } from "../../../product/components/product-tabs";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useServiceStore } from "@/store/use-service-store";
import Link from "next/link";

interface ServiceDeliveryInput {
  requiresBooking?: boolean;
  storeId: string;
}

const ServiceDeliveryInfo = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { service, updateService, reset } = useServiceStore();

  const { handleSubmit, setValue, watch } = useForm<ServiceDeliveryInput>({
    defaultValues: {
      ...service,
      storeId: storeId as string,
      requiresBooking: service.requiresBooking || false,
    },
  });

  const onSubmit = (data: ServiceDeliveryInput) => {
    updateService({
      ...data,
      storeId: storeId as string,
    });
    router.push(`/${storeId}/service/new/publishing`);
  };

  const handleCancel = () => {
    reset();
    router.push(`/${storeId}/products`);
  };

  if (!service.title) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No service data found</h2>
          <p className="text-gray-600 mb-4">Please start by creating the basic service information.</p>
          <Button asChild>
            <Link href={`/${storeId}/service/new`}>Start Creating Service</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 bg-white border-b gap-4 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            asChild
          >
            <Link href={`/${storeId}/products`}>
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back to service listing</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none text-sm">
            Back
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none text-sm">
            Continue
          </Button>
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