"use client";
import React from "react";
import { ChevronLeft, Info } from "lucide-react";
import { ProductTabs } from "../../../product/components/product-tabs";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServicePublishingInput {
  status: "draft" | "published" | "scheduled";
  saleChannels?: string;
  seoTitle?: string;
  seoDescription?: string;
  urlHandle?: string;
  storeId: string;
}

const ServicePublishing = () => {
  const { storeId } = useParams();
  const router = useRouter();

  const { register, handleSubmit, setValue, watch } = useForm<ServicePublishingInput>({
    defaultValues: {
      storeId: storeId as string,
      status: "draft",
      urlHandle: "product-name-slug",
    },
  });

  const onSubmit = (data: ServicePublishingInput) => {
    console.log("Service publishing data:", data);
    router.push(`/${storeId}/products`);
  };

  const handleSaveDraft = () => {
    setValue("status", "draft");
    handleSubmit(onSubmit)();
  };

  const handlePublishNow = () => {
    setValue("status", "published");
    handleSubmit(onSubmit)();
  };

  const handleBack = () => {
    router.push(`/${storeId}/service/new/delivery?type=service`);
  };

  const seoTitle = watch("seoTitle") || "";
  const seoDescription = watch("seoDescription") || "";

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
          <Button variant="outline" onClick={handleSaveDraft}>
            Save as Draft
          </Button>
          <Button onClick={handlePublishNow}>Publish Service</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProductTabs activeTab="Publishing" type="service" />
        
        {/* Publish Listing Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-6 border-b">
            <h2 className="text-xl sm:text-2xl font-semibold">Publish Listing</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure visibility and SEO settings
            </p>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
              {/* Status Radio Buttons */}
              <div className="space-y-2">
                <Label>
                  Status <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      watch("status") === "draft"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="draft"
                      checked={watch("status") === "draft"}
                      onChange={(e) => setValue("status", e.target.value as any)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">Draft</span>
                  </label>

                  <label
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      watch("status") === "published"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="published"
                      checked={watch("status") === "published"}
                      onChange={(e) => setValue("status", e.target.value as any)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">Published</span>
                  </label>

                  <label
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      watch("status") === "scheduled"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="scheduled"
                      checked={watch("status") === "scheduled"}
                      onChange={(e) => setValue("status", e.target.value as any)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">Scheduled</span>
                  </label>
                </div>
              </div>

              {/* Sale Channels */}
              <div className="space-y-2">
                <Label htmlFor="saleChannels">
                  Sale Channels <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("saleChannels")}
                  onValueChange={(value) => setValue("saleChannels", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online Store</SelectItem>
                    <SelectItem value="pos">Point of Sale</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="all">All Channels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SEO Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <Input
                  id="seoTitle"
                  {...register("seoTitle")}
                  placeholder="Optimized title for search engines"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500">
                  {seoTitle.length}/60 characters
                </p>
              </div>

              {/* SEO Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <Textarea
                  id="seoDescription"
                  {...register("seoDescription")}
                  placeholder="Brief description that appears in search results"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  {seoDescription.length}/160 characters
                </p>
              </div>

              {/* URL Handle */}
              <div className="space-y-2">
                <Label htmlFor="urlHandle">URL Handle</Label>
                <Input
                  id="urlHandle"
                  {...register("urlHandle")}
                  placeholder="product-name-slug"
                />
                <p className="text-xs text-gray-500">
                  URL: yourdomain.com/services/url-handle
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePublishing;