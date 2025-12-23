"use client";
import React from "react";
import { ChevronLeft, Info } from "lucide-react";
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
import { useServiceStore } from "@/store/use-service-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface ServicePricingInput {
  price: number;
  comparePrice?: number;
  costPerService?: number;
  status: string;
  currency: string;
}

const NewServiceSalePage = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { service, updateService, reset } = useServiceStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ServicePricingInput>({
    defaultValues: {
      price: service.price || 0,
      comparePrice: service.comparePrice || 0,
      costPerService: service.costPerService || 0,
      status: service.status || "DRAFT",
      currency: service.currency || "USD",
    },
  });

  const price = watch("price");
  const costPerService = watch("costPerService");
  const profit = price && costPerService ? price - costPerService : 0;
  const margin = price && costPerService ? ((price - costPerService) / price) * 100 : 0;

  const onSubmit = (data: ServicePricingInput) => {
    updateService({
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      costPerService: data.costPerService ? Number(data.costPerService) : undefined,
      status: data.status,
      currency: data.currency,
      storeId: storeId as string,
    });
    router.push(`/${storeId}/service/new/delivery`);
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
          <Button onClick={handleSubmit(onSubmit)} disabled={!watch('price')} className="flex-1 sm:flex-none text-sm">
            Continue
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
                <h2 className="text-xl sm:text-2xl font-semibold">Service Pricing & Sales</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Set your service pricing and manage publication
                </p>
              </div>
              <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Pricing Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Service Price <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                            {watch("currency") === "USD" ? "$" : 
                             watch("currency") === "EUR" ? "€" : 
                             watch("currency") === "GBP" ? "£" : 
                             watch("currency") === "UGX" ? "USh" : 
                             watch("currency") === "KES" ? "KSh" : 
                             watch("currency") === "TZS" ? "TSh" : 
                             watch("currency") === "NGN" ? "₦" : 
                             watch("currency") === "ZAR" ? "R" : "$"}
                          </span>
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
                            className={`pl-12 ${errors.price ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.price && (
                          <p className="text-sm text-red-500">{errors.price.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comparePrice">Compare at Price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                            {watch("currency") === "USD" ? "$" : 
                             watch("currency") === "EUR" ? "€" : 
                             watch("currency") === "GBP" ? "£" : 
                             watch("currency") === "UGX" ? "USh" : 
                             watch("currency") === "KES" ? "KSh" : 
                             watch("currency") === "TZS" ? "TSh" : 
                             watch("currency") === "NGN" ? "₦" : 
                             watch("currency") === "ZAR" ? "R" : "$"}
                          </span>
                          <Input
                            id="comparePrice"
                            type="number"
                            step="0.01"
                            min="0"
                            {...register("comparePrice")}
                            placeholder="0.00"
                            className="pl-12"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Original price to show discount
                        </p>
                      </div>
                    </div>

                  {/* Cost and Profit Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="costPerService">Cost per Service</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                          {watch("currency") === "USD" ? "$" : 
                           watch("currency") === "EUR" ? "€" : 
                           watch("currency") === "GBP" ? "£" : 
                           watch("currency") === "UGX" ? "USh" : 
                           watch("currency") === "KES" ? "KSh" : 
                           watch("currency") === "TZS" ? "TSh" : 
                           watch("currency") === "NGN" ? "₦" : 
                           watch("currency") === "ZAR" ? "R" : "$"}
                        </span>
                        <Input
                          id="costPerService"
                          type="number"
                          step="0.01"
                          min="0"
                          {...register("costPerService")}
                          placeholder="0.00"
                          className="pl-12"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Your cost to provide this service
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Profit</Label>
                      <div className="bg-muted px-3 py-2.5 rounded-md">
                        <span className="text-sm text-muted-foreground">
                          {watch("currency") === "USD" ? "$" : 
                           watch("currency") === "EUR" ? "€" : 
                           watch("currency") === "GBP" ? "£" : 
                           watch("currency") === "UGX" ? "USh" : 
                           watch("currency") === "KES" ? "KSh" : 
                           watch("currency") === "TZS" ? "TSh" : 
                           watch("currency") === "NGN" ? "₦" : 
                           watch("currency") === "ZAR" ? "R" : "$"}{profit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Margin</Label>
                      <div className="bg-muted px-3 py-2.5 rounded-md">
                        <span className="text-sm text-muted-foreground">
                          {margin.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={watch("currency")}
                        onValueChange={(value) => setValue("currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                          <SelectItem value="UGX">UGX - Ugandan Shilling (USh)</SelectItem>
                          <SelectItem value="KES">KES - Kenyan Shilling (KSh)</SelectItem>
                          <SelectItem value="TZS">TZS - Tanzanian Shilling (TSh)</SelectItem>
                          <SelectItem value="NGN">NGN - Nigerian Naira (₦)</SelectItem>
                          <SelectItem value="ZAR">ZAR - South African Rand (R)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Promotional Discount Section */}
                  <div className="border-t pt-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <span className="text-2xl text-blue-600">%</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Promotional Discount
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Offer a limited-time discount to attract customers
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div>
                          <Label htmlFor="enable-discount" className="text-sm font-medium text-gray-900">
                            Enable Discount
                          </Label>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Show a promotional price
                          </p>
                        </div>
                        <Switch id="enable-discount" />
                      </div>
                    </div>
                  </div>
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
                        <Checkbox id="online-booking" defaultChecked />
                        <Label htmlFor="online-booking" className="text-sm">Online Booking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-person" defaultChecked />
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

export default NewServiceSalePage;