"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductTabs } from "../../components/product-tabs";
import { useForm } from "react-hook-form";
import api, { CreateProductInput } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductStore } from "@/store/use-product-store";
import { useParams } from "next/navigation";
import { ScheduleAvailabilityModal } from "../../components/schedule-availability-modal";
import ProductStatusCard from "../../components/product-status-card";

const getCategoryLabel = (categoryValue: string): string => {
  const categoryMap: Record<string, string> = {
    smartphone: "Smartphones",
    laptop: "Laptops",
    tablet: "Tablets",
    desktop: "Desktop Computers",
    accessory: "Electronics Accessories",
    camera: "Cameras",
    headphones: "Headphones & Audio",
    mens_clothing: "Men's Clothing",
    womens_clothing: "Women's Clothing",
    shoes: "Shoes",
    bags: "Bags & Luggage",
    accessories_fashion: "Fashion Accessories",
    jewelry: "Jewelry",
    watches: "Watches",
    furniture: "Furniture",
    home_decor: "Home Decor",
    bedding: "Bedding",
    kitchen: "Kitchen Appliances",
    lighting: "Lighting",
    skincare: "Skincare",
    cosmetics: "Cosmetics",
    haircare: "Hair Care",
    health_supplements: "Health Supplements",
    fitness: "Fitness Equipment",
    beverages: "Beverages",
    snacks: "Snacks",
    groceries: "Groceries",
    bakery: "Bakery Products",
    organic_food: "Organic Food",
    sports_equipment: "Sports Equipment",
    outdoor_gear: "Outdoor Gear",
    bikes: "Bikes",
    camping: "Camping Gear",
    books: "Books",
    ebooks: "E-Books",
    magazines: "Magazines",
    music: "Music & CDs",
    toys: "Toys",
    games: "Games",
    hobbies: "Hobbies & Crafts",
    car_parts: "Car Parts",
    car_accessories: "Car Accessories",
    motorcycle: "Motorcycle Parts",
    pet_food: "Pet Food",
    pet_accessories: "Pet Accessories",
    pet_toys: "Pet Toys",
    stationery: "Stationery",
    office_supplies: "Office Supplies",
    furniture_office: "Office Furniture",
    service_repair: "Repair Services",
    service_cleaning: "Cleaning Services",
    service_consulting: "Consulting Services",
    service_tutoring: "Tutoring Services",
    service_photography: "Photography Services",
    service_personal_training: "Personal Training",
    other: "Other",
  };
  return categoryMap[categoryValue] || categoryValue;
};

const formatNumberWithCommas = (value: number): string => {
  return value.toLocaleString("en-US");
};

const NewProductPublishingPage = () => {
  const router = useRouter();
  const { storeId } = useParams();
  const { product, updateProduct, reset, _hasHydrated } = useProductStore();
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [hasDiscount, setHasDiscount] = React.useState(false);
  const [publishTiming, setPublishTiming] = React.useState("immediate");
  const [isFeatured, setIsFeatured] = React.useState(false);

  const handleDiscountToggle = (checked: boolean) => {
    setHasDiscount(checked);
    if (checked) {
      router.push(`/${storeId}/discounts`);
    }
  };

  // Get currency symbol based on selected currency
  const getCurrencySymbol = (currency?: string): string => {
    const currencyMap: Record<string, string> = {
      "UGX - Ugandan Shilling": "UGX",
      "USD - US Dollar": "$",
      "EUR - Euro": "€",
      "GBP - British Pound": "£",
    };
    const selectedCurrency = currency || (product as any).currency || "UGX - Ugandan Shilling";
    return currencyMap[selectedCurrency] || "UGX";
  };

  const currencySymbol = getCurrencySymbol((product as any).currency);

  const { register, handleSubmit, reset: resetForm } = useForm<CreateProductInput>({
    defaultValues: {
      ...product,
      storeId: storeId as string,
    },
  });

  // Sync form with store data after hydration
  React.useEffect(() => {
    if (_hasHydrated) {
      resetForm({
        ...product,
        storeId: storeId as string,
      });
    }
  }, [_hasHydrated, product, resetForm, storeId]);

  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductInput) => api.products.create(data),
    onSuccess: () => {
      toast.success("Product published successfully!");
      reset();
      router.push(`/${storeId}/listings`);
    },
    onError: (error: any) => {
      console.error("Product creation error:", error);
      
      // Extract detailed error message if available
      let errorMessage = "Failed to publish product";
      
      // Check for ApiError with data property
      if (error?.data?.message) {
        // Handle array of validation messages
        if (Array.isArray(error.data.message)) {
          errorMessage = error.data.message.join(", ");
        } else {
          errorMessage = error.data.message;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      console.error("Error message:", errorMessage);
      toast.error(errorMessage);
    },
  });

  const handleScheduleSave = (data: {
    scheduledPublishDate?: Date | null;
    scheduledUnpublishDate?: Date | null;
    isScheduled: boolean;
  }) => {
    updateProduct({
      scheduledPublishDate: data.scheduledPublishDate || undefined,
      scheduledUnpublishDate: data.scheduledUnpublishDate || undefined,
      isScheduled: data.isScheduled,
    } as Partial<CreateProductInput>);
    
    if (data.isScheduled && (data.scheduledPublishDate || data.scheduledUnpublishDate)) {
      toast.success("Product availability scheduled successfully");
    }
  };

  const onSubmit = (data: CreateProductInput) => {
    // Validate required fields
    if (!product.title || !product.title.trim()) {
      toast.error("Product title is required");
      return;
    }

    if (!product.price || Number(product.price) === 0) {
      toast.error("Product price is required and must be greater than 0");
      return;
    }

    if (!product.storeId) {
      toast.error("Store ID is missing");
      return;
    }

    // Ensure all required fields are present and properly typed
    const finalData = {
      title: product.title?.trim() || data.title,
      storeId: storeId as string,
      status: "ACTIVE",
      // Ensure all numeric fields are properly converted
      price: Number(product.price) || Number(data.price) || 0,
      comparePrice: product.comparePrice || data.comparePrice
        ? Number(product.comparePrice || data.comparePrice)
        : undefined,
      costPerItem: product.costPerItem || data.costPerItem
        ? Number(product.costPerItem || data.costPerItem)
        : undefined,
      weight: product.weight || data.weight ? Number(product.weight || data.weight) : undefined,
      length: product.length || data.length ? Number(product.length || data.length) : undefined,
      width: product.width || data.width ? Number(product.width || data.width) : undefined,
      height: product.height || data.height ? Number(product.height || data.height) : undefined,
      // String fields
      description: product.description || data.description || undefined,
      category: product.category || data.category || undefined,
      vendor: product.vendor || data.vendor || undefined,
      tags: product.tags || data.tags || undefined,
      countryOfOrigin: product.countryOfOrigin || data.countryOfOrigin || undefined,
      harmonizedSystemCode: product.harmonizedSystemCode || data.harmonizedSystemCode || undefined,
      weightUnit: product.weightUnit || data.weightUnit || undefined,
      sizeUnit: product.sizeUnit || data.sizeUnit || undefined,
      // Schedule fields
      scheduledPublishDate: (product as any).scheduledPublishDate || undefined,
      scheduledUnpublishDate: (product as any).scheduledUnpublishDate || undefined,
      isScheduled: (product as any).isScheduled || false,
      // Sanitize variations to only include allowed fields (name, value, price, stock)
      // Filter out any variations with empty required fields
      variations:
        product.variations?.filter((v) => v.name && v.value)
          .map((v) => ({
            name: v.name,
            value: v.value,
            price: Number(v.price) || 0,
            stock: Number(v.stock) || 0,
          })) || [],
      // Sanitize images to only include url field
      // Filter out any images with empty urls
      images: product.images?.filter((img) => img.url).map((img) => ({ url: img.url })) || [],
      // Sanitize videos to only include url field
      // Filter out any videos with empty urls
      videos: product.videos?.filter((vid) => vid.url).map((vid) => ({ url: vid.url })) || [],
    };

    // Remove undefined fields to avoid validation errors
    Object.keys(finalData).forEach(key => {
      if (finalData[key as keyof typeof finalData] === undefined) {
        delete finalData[key as keyof typeof finalData];
      }
    });

    // Remove empty arrays to avoid potential validation issues
    if (finalData.variations && finalData.variations.length === 0) {
      delete (finalData as any).variations;
    }
    if (finalData.images && finalData.images.length === 0) {
      delete (finalData as any).images;
    }
    if (finalData.videos && finalData.videos.length === 0) {
      delete (finalData as any).videos;
    }

    console.log("Final data being sent:", finalData);
    createProductMutation.mutate(finalData as CreateProductInput);
  };

  const handleCancel = () => {
    reset();
    router.push(`/${storeId}/listings`);
  };

  // Show loading state until hydration completes
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product data...</p>
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
            <span className="hidden sm:inline">Back to product listing</span>
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
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none text-sm">Publish</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs activeTab="Publishing" />

            {/* Publishing Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-pink-500">
                  Let&apos;s check everything before publishing
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Make sure all info is correct before selling your product
                </p>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Basic information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Product title</Label>
                      <div className={`px-3 py-2 rounded-md ${product.title ? 'bg-muted text-foreground' : 'bg-red-50 text-red-600'}`}>
                        {product.title || "No title provided"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Product category</Label>
                      <div className={`px-3 py-2 rounded-md ${product.category ? 'bg-muted text-foreground' : 'bg-red-50 text-red-600'}`}>
                        {product.category ? getCategoryLabel(product.category) : "No category provided"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Vendor</Label>
                      <div className={`px-3 py-2 rounded-md ${product.vendor ? 'bg-muted text-foreground' : 'bg-red-50 text-red-600'}`}>
                        {product.vendor || "No vendor provided"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className={`px-3 py-2 rounded-md ${product.tags ? 'bg-muted text-foreground' : 'bg-red-50 text-red-600'}`}>
                        {product.tags || "No tags provided"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <div className={`px-3 py-2 rounded-md whitespace-pre-wrap ${product.description ? 'bg-muted text-foreground' : 'bg-red-50 text-red-600'}`}>
                      {product.description || "No description provided"}
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
                  {product.images && product.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {product.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No images</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sale Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Sale information</h3>
                  
                  {/* Price Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Price Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 font-medium mb-2">Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        {currencySymbol} {formatNumberWithCommas(product.price || 0)}
                      </p>
                    </div>

                    {/* Compare-at Price Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 font-medium mb-2">Compare-at price</p>
                      <p className="text-lg font-bold text-gray-900">
                        {currencySymbol} {formatNumberWithCommas(product.comparePrice || 0)}
                      </p>
                    </div>

                    {/* Profit Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 font-medium mb-2">Profit</p>
                      <p className="text-lg font-bold text-gray-900">
                        {currencySymbol} {formatNumberWithCommas((product.price || 0) - (product.costPerItem || 0))}
                      </p>
                    </div>

                    {/* Margin Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 font-medium mb-2">Margin</p>
                      <p className="text-lg font-bold text-gray-900">
                        {((((product.price || 0) - (product.costPerItem || 0)) / (product.price || 1)) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Tax Checkbox */}
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Checkbox id="tax" defaultChecked />
                    <Label htmlFor="tax" className="font-medium cursor-pointer">Charge tax on this product</Label>
                  </div>

                  {/* Variations Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Size</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Available</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.variations?.map((variation, index) => (
                        <TableRow key={index}>
                          <TableCell>{variation.value}</TableCell>
                          <TableCell>{currencySymbol} {formatNumberWithCommas(variation.price ?? 0)}</TableCell>
                          <TableCell>{variation.stock ?? 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Shipping Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Shipping</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label>Weight</Label>
                      <div className={`text-lg font-medium ${product.weight ? '' : 'text-red-600'}`}>
                        {product.weight && product.weightUnit
                          ? `${product.weight} ${product.weightUnit}`
                          : "Not specified"}
                      </div>
                    </div>
                    <div>
                      <Label>Parcel size</Label>
                      <div className={`text-lg font-medium ${product.length && product.width && product.height ? '' : 'text-red-600'}`}>
                        {product.length && product.width && product.height && product.sizeUnit
                          ? `${product.length} × ${product.width} × ${product.height} ${product.sizeUnit}`
                          : "Not specified"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="worldwide" defaultChecked />
                    <Label htmlFor="worldwide">
                      This product is available worldwide
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Country/Region of origin</Label>
                    <div className={`px-3 py-2 rounded-md ${product.countryOfOrigin ? 'bg-muted text-foreground' : 'bg-red-50 text-red-600'}`}>
                      {product.countryOfOrigin || "Not specified"}
                    </div>
                  </div>
                </div>

                {/* Publish Timing Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-medium">Publish Timing</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose when your listing goes live
                  </p>

                  <div className="space-y-3">
                    {/* Publish Immediately */}
                    <div
                      onClick={() => setPublishTiming("immediate")}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        publishTiming === "immediate"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                          publishTiming === "immediate"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {publishTiming === "immediate" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">Publish immediately</h4>
                        <p className="text-sm text-gray-500">Your listing will be visible right away</p>
                      </div>
                    </div>

                    {/* Schedule for Later */}
                    <div
                      onClick={() => setPublishTiming("scheduled")}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        publishTiming === "scheduled"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                          publishTiming === "scheduled"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {publishTiming === "scheduled" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">Schedule for Later</h4>
                        <p className="text-sm text-gray-500">Set a specific date and time for publishing</p>
                      </div>
                    </div>

                    {/* Save as Draft */}
                    <div
                      onClick={() => setPublishTiming("draft")}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        publishTiming === "draft"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                          publishTiming === "draft"
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {publishTiming === "draft" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">Save as Draft</h4>
                        <p className="text-sm text-gray-500">Save your progress and publish later</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Listing Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Featured Listing</h3>
                  <p className="text-sm text-muted-foreground">
                    Boost your visibility with a featured placement
                  </p>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 rounded-full p-2">
                          <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">Feature this listing</h4>
                          <p className="text-sm text-muted-foreground">
                            Appear at the top of search results
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isFeatured}
                        onCheckedChange={setIsFeatured}
                      />
                    </div>
                    {isFeatured && (
                      <p className="text-sm text-blue-600 font-medium mt-3">
                        +$9.99/month for featured placement
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/${storeId}/product/preview`)}
                  >
                    Preview Listing
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        updateProduct({ status: "DRAFT" } as Partial<CreateProductInput>);
                        toast.success("Product saved as draft");
                      }}
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Publish Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 order-first lg:order-last">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1">Status</Label>
                    <Select
                      {...register("status")}
                      defaultValue={product.status}
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
                      This product will be available to 2 sale channels
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Sale channels and Apps
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="select-all" defaultChecked />
                        <Label htmlFor="select-all">Select all</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="online-store" defaultChecked />
                        <Label htmlFor="online-store">Online Store</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="buy-button" defaultChecked />
                        <Label htmlFor="buy-button">Buy Button</Label>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="text-pink-500 mt-2 h-auto p-0"
                      onClick={() => setShowScheduleModal(true)}
                    >
                      Schedule availability
                    </Button>
                    
                    {/* Show scheduled info if exists */}
                    {(product as any).isScheduled && ((product as any).scheduledPublishDate || (product as any).scheduledUnpublishDate) && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs text-blue-800">
                          <strong>Scheduled:</strong>
                          {(product as any).scheduledPublishDate && (
                            <span className="block mt-1">
                              Publish: {new Date((product as any).scheduledPublishDate).toLocaleString()}
                            </span>
                          )}
                          {(product as any).scheduledUnpublishDate && (
                            <span className="block mt-1">
                              Unpublish: {new Date((product as any).scheduledUnpublishDate).toLocaleString()}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Discount Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Apply Discount</h3>
                        <p className="text-xs text-muted-foreground">
                          Create and manage coupons & discounts
                        </p>
                      </div>
                      <Switch
                        checked={hasDiscount}
                        onCheckedChange={handleDiscountToggle}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Availability Modal */}
      <ScheduleAvailabilityModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSave={handleScheduleSave}
        initialPublishDate={(product as any).scheduledPublishDate ? new Date((product as any).scheduledPublishDate) : null}
        initialUnpublishDate={(product as any).scheduledUnpublishDate ? new Date((product as any).scheduledUnpublishDate) : null}
        initialIsScheduled={(product as any).isScheduled || false}
      />
    </div>
  );
};

export default NewProductPublishingPage;
