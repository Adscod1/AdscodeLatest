"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../../../product/components/product-tabs";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ServicePricingInput {
  price: number;
  comparePrice?: number;
  costPerService?: number;
  status: string;
}

interface Service {
  id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  comparePrice?: number;
  costPerItem?: number;
  status: string;
  variations: Array<{
    name: string;
    value: string;
  }>;
}

const ServiceSalePage = () => {
  const { storeId, serviceId } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ServicePricingInput>({
    defaultValues: {
      price: 0,
      comparePrice: 0,
      costPerService: 0,
      status: "DRAFT",
    },
  });

  // Load service data
  useEffect(() => {
    const loadService = async () => {
      try {
        const response = await fetch(`/api/service/${serviceId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setService(result.service);
            // Pre-fill form with existing data
            if (result.service.price) setValue('price', result.service.price);
            if (result.service.comparePrice) setValue('comparePrice', result.service.comparePrice);
            if (result.service.costPerItem) setValue('costPerService', result.service.costPerItem);
            setValue('status', result.service.status);
          }
        }
      } catch (error) {
        console.error('Error loading service:', error);
        toast.error('Failed to load service data');
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
      loadService();
    }
  }, [serviceId, setValue]);

  const onSubmit = async (data: ServicePricingInput) => {
    if (!data.price || data.price <= 0) {
      toast.error('Service price is required and must be greater than 0');
      return;
    }

    if (data.comparePrice && data.comparePrice <= data.price) {
      toast.error('Compare price must be greater than the service price');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/service/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: Number(data.price),
          comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
          costPerService: data.costPerService ? Number(data.costPerService) : undefined,
          status: data.status,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Service pricing updated successfully!');
        
        if (data.status === 'PUBLISHED') {
          router.push(`/${storeId}/products?tab=services`);
        } else {
          router.push(`/${storeId}/products?tab=services&status=draft`);
        }
      } else {
        toast.error(result.error || 'Failed to update service pricing');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${storeId}/products`);
  };

  const handleSaveAsDraft = async () => {
    setValue('status', 'DRAFT');
    await handleSubmit(onSubmit)();
  };

  const handlePublish = async () => {
    setValue('status', 'PUBLISHED');
    await handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Service not found</h2>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href={`/${storeId}/products`}>Back to Products</Link>
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
          <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="flex-1 sm:flex-none text-sm">
            Back
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} className="flex-1 sm:flex-none text-sm">
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={isSubmitting || !watch('price')} className="flex-1 sm:flex-none text-sm">
            {isSubmitting && watch('status') === 'PUBLISHED' ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs activeTab="Sale Information" type="service" />
            
            {/* Service Summary */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">{service.title}</h3>
                  <p className="text-sm text-blue-700">
                    {service.description ? service.description.substring(0, 100) + '...' : 'No description provided'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Category: {service.category || 'Uncategorized'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pricing Form */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 sm:px-6 lg:px-8 py-6 border-b">
                <h2 className="text-xl sm:text-2xl font-semibold">Service Pricing</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Set your service pricing and publication status
                </p>
              </div>
              <div className="px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
              
              {/* Service Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Service Price <span className="text-red-500">*</span>
                </Label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("price", { 
                      required: "Service price is required",
                      min: {
                        value: 0.01,
                        message: "Price must be greater than 0"
                      }
                    })}
                    placeholder="0.00"
                    className={`pl-8 ${errors.price ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  The price customers will pay for your service
                </p>
              </div>

              {/* Compare Price */}
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare at Price (Optional)</Label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("comparePrice")}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Show customers how much they're saving (must be higher than service price)
                </p>
              </div>

              {/* Cost per Service */}
              <div className="space-y-2">
                <Label htmlFor="costPerService">Cost per Service (Optional)</Label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="costPerService"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("costPerService")}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Your cost to provide this service (for profit tracking)
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) => setValue("status", value)}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Draft services are not visible to customers
                </p>
              </div>

              {/* Profit Calculation */}
              {watch('price') && watch('costPerService') && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Profit Calculation</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Service Price:</span>
                      <span>${Number(watch('price')).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost per Service:</span>
                      <span>-${Number(watch('costPerService')).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-medium">
                      <span>Profit per Service:</span>
                      <span className={Number(watch('price')) - Number(watch('costPerService')) > 0 ? 'text-green-600' : 'text-red-600'}>
                        ${(Number(watch('price')) - Number(watch('costPerService'))).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 order-first lg:order-last">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-6 border-b">
              <h3 className="text-lg font-semibold">Service Status</h3>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sidebar-status">Status</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(value) => setValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    This service will be available to customers
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Service channels
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="online-booking" defaultChecked className="rounded" />
                      <Label htmlFor="online-booking" className="text-sm">Online Booking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="in-person" defaultChecked className="rounded" />
                      <Label htmlFor="in-person" className="text-sm">In-Person</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ServiceSalePage;