"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductTabs } from "../../../product/components/product-tabs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServiceStore, CreateServiceInput } from "@/store/use-service-store";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const NewServicePublishingPage = () => {
  const router = useRouter();
  const { storeId } = useParams();
  const { service, reset } = useServiceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<CreateServiceInput>({
    defaultValues: {
      ...service,
      storeId: storeId as string,
    },
  });

  const onSubmit = async (data: CreateServiceInput) => {
    setIsSubmitting(true);

    try {
      // Ensure all required fields are present and properly typed
      const finalData = {
        ...service,
        ...data,
        storeId: storeId as string,
        status: "PUBLISHED",
        // Ensure all numeric fields are properly converted
        price: Number(service.price) || 0,
        comparePrice: service.comparePrice ? Number(service.comparePrice) : undefined,
        costPerService: service.costPerService ? Number(service.costPerService) : undefined,
        experience: Number(service.experience) || 0,
        // Ensure arrays are properly initialized
        media: service.media || [],
      };

      const response = await fetch('/api/service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Service published successfully!");
        reset();
        router.push(`/${storeId}/products?tab=services`);
      } else {
        toast.error(result.error || 'Failed to publish service');
      }
    } catch (error) {
      console.error('Error publishing service:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Back to service listing</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none text-sm">
            Back
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="flex-1 sm:flex-none text-sm">
            {isSubmitting ? (
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
            <ProductTabs activeTab="Publishing" type="service" />

            {/* Publishing Preview */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 sm:px-6 lg:px-8 py-6 border-b">
                <h2 className="text-xl sm:text-2xl font-semibold text-pink-500">
                  Let&apos;s check everything before publishing
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Make sure all info is correct before offering your service
                </p>
              </div>
              <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Basic information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Service title</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {service.title || "No title provided"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Service category</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {service.category || "No category provided"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Service Provider</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {service.serviceProvider || "No provider specified"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {service.tags || "No tags provided"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <div className="px-3 py-2 bg-muted rounded-md whitespace-pre-wrap">
                      {service.description || "No description provided"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {service.location || "Not specified"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {service.duration || "Not specified"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {service.serviceType || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Media{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      (images, video or 3D models)
                    </span>
                  </h3>
                  {service.media && service.media.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {service.media.slice(0, 4).map((media, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          {media.type.startsWith('video/') ? (
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                              controls
                            />
                          ) : (
                            <img
                              src={media.url}
                              alt={`Service ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No media</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Pricing information</h3>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <Label>Service Price</Label>
                          <div className="text-lg font-medium">
                            $ {service.price?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                        <div>
                          <Label>Compare-at price</Label>
                          <div className="text-lg font-medium">
                            $ {service.comparePrice?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <Label>Cost per service</Label>
                          <div className="text-lg font-medium">
                            $ {service.costPerService?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                        <div>
                          <Label>Profit</Label>
                          <div className="text-lg font-medium">
                            ${" "}
                            {(
                              (service.price || 0) - (service.costPerService || 0)
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <Label>Margin</Label>
                          <div className="text-lg font-medium">
                            {(
                              (((service.price || 0) -
                                (service.costPerService || 0)) /
                                (service.price || 1)) *
                              100
                            ).toFixed(0)}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Service details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>What&apos;s included</Label>
                      <div className="px-3 py-2 bg-muted rounded-md whitespace-pre-wrap">
                        {service.whatsIncluded || "Not specified"}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label>Target Audience</Label>
                        <div className="px-3 py-2 bg-muted rounded-md">
                          {service.targetAudience || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <Label>Experience (Years)</Label>
                        <div className="px-3 py-2 bg-muted rounded-md">
                          {service.experience || 0} years
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <Label className="mb-1">Status</Label>
                    <Select
                      {...register("status")}
                      defaultValue={service.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
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
                        <Checkbox id="select-all" defaultChecked />
                        <Label htmlFor="select-all">Select all</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="online-booking" defaultChecked />
                        <Label htmlFor="online-booking">Online Booking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-person" defaultChecked />
                        <Label htmlFor="in-person">In-Person</Label>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="text-pink-500 mt-2 h-auto p-0"
                    >
                      Schedule availability
                    </Button>
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

export default NewServicePublishingPage;