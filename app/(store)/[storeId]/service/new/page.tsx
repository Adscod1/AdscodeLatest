"use client";
import React, { useState } from "react";
import { ChevronLeft, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../../product/components/product-tabs";
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
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";
import { X } from "lucide-react";
import { useServiceStore, CreateServiceInput } from "@/store/use-service-store";

interface MediaFile {
  url: string;
  type: string;
  filename: string;
  size: number;
}

const CreateNewService = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { service, updateService, reset } = useServiceStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateServiceInput>({
    defaultValues: {
      ...service,
      storeId: storeId as string,
      experience: service.experience || 0,
      status: service.status || "DRAFT",
    },
  });

  // State for service media
  const [serviceMedia, setServiceMedia] = useState<MediaFile[]>(
    service.media || []
  );

  const handleMediaUpload = (response: any) => {
    if (response.success) {
      const mediaFile: MediaFile = {
        url: response.url,
        type: response.type,
        filename: response.filename,
        size: response.size
      };
      const updatedMedia = [...serviceMedia, mediaFile];
      setServiceMedia(updatedMedia);
      updateService({ media: updatedMedia });
      toast.success('Media uploaded successfully');
    } else {
      toast.error('Failed to upload media');
    }
  };

  const removeMedia = (index: number) => {
    const updatedMedia = serviceMedia.filter((_, i) => i !== index);
    setServiceMedia(updatedMedia);
    updateService({ media: updatedMedia });
    toast.success('Media removed');
  };

  const onSubmit = (data: CreateServiceInput) => {
    updateService({
      ...data,
      storeId: storeId as string,
      media: serviceMedia,
      experience: Number(data.experience) || 0,
    });
    router.push(`/${storeId}/service/new/sale`);
  };

  const handleCancel = () => {
    reset();
    router.push(`/${storeId}/products`);
  };

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
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none">
            Continue
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs activeTab="Basic Information" type="service" />

            {/* Basic Information Form */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 sm:px-6 lg:px-8 py-6 border-b">
                <h2 className="text-xl sm:text-2xl font-semibold">Basic Information</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Provide essential details about your service
                </p>
              </div>
              <div className="px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Creating a Service Listing
                  </p>
                </div>
              </div>

              {/* Service Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Service Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title", { 
                    required: "Service title is required",
                    minLength: {
                      value: 3,
                      message: "Service title must be at least 3 characters"
                    }
                  })}
                  placeholder="e.g., Professional Web Design"
                  className={`max-w-2xl ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Service Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Service Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("category")}
                  onValueChange={(value) => setValue("category", value)}
                >
                  <SelectTrigger className="max-w-2xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="education">Education & Training</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="professional">Professional Services</SelectItem>
                    <SelectItem value="creative">Creative Services</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <Input
                  id="tags"
                  {...register("tags")}
                  placeholder="e.g., wireless, bluetooth, noise-cancelling"
                  className="max-w-2xl"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register("description", {
                    required: "Service description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters"
                    }
                  })}
                  placeholder="Describe your service in detail. Include what you offer, your approach, and the results clients can expect."
                  className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  A detailed description helps customers understand your offering better
                </p>
              </div>

              {/* Service Provider */}
              <div className="space-y-2">
                <Label htmlFor="serviceProvider">Service Provider (Optional)</Label>
                <Input
                  id="serviceProvider"
                  {...register("serviceProvider")}
                  placeholder="Your name or company name"
                  className="max-w-2xl"
                />
              </div>

              {/* Service Location & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="location">Service Location <span className="text-red-500">*</span></Label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <Select
                    value={watch("location")}
                    onValueChange={(value) => setValue("location", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-store">In-Store</SelectItem>
                      <SelectItem value="on-site">On-Site</SelectItem>
                      <SelectItem value="online">Online/Virtual</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="duration">Duration <span className="text-red-500">*</span></Label>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <Select
                    value={watch("duration")}
                    onValueChange={(value) => setValue("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="1hour">1 hour</SelectItem>
                      <SelectItem value="2hours">2 hours</SelectItem>
                      <SelectItem value="half-day">Half day</SelectItem>
                      <SelectItem value="full-day">Full day</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Service Type & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">
                    Service Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("serviceType")}
                    onValueChange={(value) => setValue("serviceType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    {...register("experience")}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* What's Included */}
              <div className="space-y-2">
                <Label htmlFor="whatsIncluded">
                  What's Included <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="whatsIncluded"
                  {...register("whatsIncluded")}
                  placeholder="List everything included in your service (one item per line)&#10;• Initial consultation&#10;• Detailed analysis&#10;• Final report"
                  className="min-h-[100px]"
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
                <Input
                  id="targetAudience"
                  {...register("targetAudience")}
                  placeholder="e.g., Small businesses, Entrepreneurs, Startups"
                  className="max-w-2xl"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Terms & Conditions (Optional)</Label>
                <Textarea
                  id="termsAndConditions"
                  {...register("termsAndConditions")}
                  placeholder="Any specific terms, policies, or requirements clients should know"
                  className="min-h-[100px]"
                />
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <Label>Images, Video or 3D (Optional for services)</Label>
                
                {serviceMedia.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <FileUpload
                        type="gallery"
                        onUpload={handleMediaUpload}
                        accept="image/*,video/*"
                        maxSize={10}
                        endpoint="/api/service/media"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Click to upload or drag and drop
                          </p>
                        </div>
                      </FileUpload>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {serviceMedia.map((media, index) => (
                      <div key={`media-${index}`} className="relative aspect-square group">
                        <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
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
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeMedia(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {serviceMedia.length < 10 && (
                      <div className="aspect-square">
                        <FileUpload
                          type="gallery"
                          onUpload={handleMediaUpload}
                          accept="image/*,video/*"
                          maxSize={10}
                          endpoint="/api/service/media"
                          className="h-full"
                        >
                          <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer">
                            <span className="text-2xl text-gray-400">+</span>
                          </div>
                        </FileUpload>
                      </div>
                    )}
                  </div>
                )}
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watch("status") || "DRAFT"}
                    onValueChange={(value) => setValue("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
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

export default CreateNewService;