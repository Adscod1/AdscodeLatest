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
import { Checkbox } from "@/components/ui/checkbox";

interface ServiceSaleInput {
  pricingModel?: string;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  taxRate?: number;
  allowQuoteRequests?: boolean;
  storeId: string;
}

const ServiceSaleInfo = () => {
  const { storeId } = useParams();
  const router = useRouter();

  const { register, handleSubmit, setValue, watch } = useForm<ServiceSaleInput>({
    defaultValues: {
      storeId: storeId as string,
      currency: "UGX",
      taxRate: 0,
      allowQuoteRequests: false,
    },
  });

  const onSubmit = (data: ServiceSaleInput) => {
    console.log("Service sale data:", data);
    router.push(`/${storeId}/service/new/delivery?type=service`);
  };

  const handleBack = () => {
    router.push(`/${storeId}/service/new?type=service`);
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
        <ProductTabs activeTab="Sale Information" type="service" />
        
        {/* Pricing & Sales Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-6 border-b">
            <h2 className="text-xl sm:text-2xl font-semibold">Pricing & Sales</h2>
            <p className="text-sm text-gray-500 mt-1">
              Set your pricing and manage rates
            </p>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
              {/* Pricing Model & Allow Quote Requests */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pricingModel">
                      Pricing Model <span className="text-red-500">*</span>
                    </Label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <Select
                    value={watch("pricingModel")}
                    onValueChange={(value) => setValue("pricingModel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="hourly">Hourly Rate</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                      <SelectItem value="custom">Custom Quote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowQuoteRequests"
                      checked={watch("allowQuoteRequests")}
                      onCheckedChange={(checked) => setValue("allowQuoteRequests", checked as boolean)}
                    />
                    <Label htmlFor="allowQuoteRequests" className="text-sm font-normal">
                      Allow quote requests
                    </Label>
                  </div>
                </div>
              </div>

              {/* Price & Compare at Price */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", { required: true })}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      {...register("compareAtPrice")}
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Original price to show discount
                  </p>
                </div>
              </div>

              {/* Currency & Tax Rate */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    Currency <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("currency")}
                    onValueChange={(value) => setValue("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                      <SelectItem value="TZS">TZS - Tanzanian Shilling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    {...register("taxRate")}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSaleInfo;