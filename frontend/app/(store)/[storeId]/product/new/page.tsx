"use client";
import React from "react";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../components/product-tabs";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { CreateProductInput } from "@/lib/api-client";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductStore } from "@/store/use-product-store";
import { FileUpload } from "@/components/ui/file-upload";
import { X } from "lucide-react";

interface ExtendedCreateProductInput extends CreateProductInput {
  brand?: string;
  model?: string;
  condition?: string;
  warranty?: string;
  specifications?: string;
}

const CreateNewProduct = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { product, updateProduct, reset: resetStore, _hasHydrated } = useProductStore();
  const hasSyncedRef = React.useRef(false);
  
  // State for sale channels
  const [saleChannels, setSaleChannels] = React.useState({
    onlineStore: true,
    buyButton: true,
  });

  const { register, handleSubmit, setValue, watch, reset: resetForm } = useForm<ExtendedCreateProductInput>({
    defaultValues: {
      storeId: storeId as string,
      brand: "",
      model: "",
      condition: "",
      warranty: "",
      specifications: "",
    },
  });

  // Sync form with store data ONCE after hydration
  React.useEffect(() => {
    if (_hasHydrated && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      resetForm({
        ...product,
        storeId: storeId as string,
        brand: (product as ExtendedCreateProductInput).brand || "",
        model: (product as ExtendedCreateProductInput).model || "",
        condition: (product as ExtendedCreateProductInput).condition || "",
        warranty: (product as ExtendedCreateProductInput).warranty || "",
        specifications: (product as ExtendedCreateProductInput).specifications || "",
      });
    }
  }, [_hasHydrated]);

  // State for product images and videos - initialized lazily after hydration
  const [productImages, setProductImages] = React.useState<string[]>([]);
  const [productVideos, setProductVideos] = React.useState<string[]>([]);
  const hasMediaSyncedRef = React.useRef(false);

  // Handle sale channel checkbox changes
  const handleChannelChange = (channel: 'onlineStore' | 'buyButton', checked: boolean) => {
    setSaleChannels(prev => ({
      ...prev,
      [channel]: checked,
    }));
  };

  // Handle Select All checkbox
  const handleSelectAll = (checked: boolean) => {
    setSaleChannels({
      onlineStore: checked,
      buyButton: checked,
    });
  };

  // Check if all channels are selected
  const allChannelsSelected = saleChannels.onlineStore && saleChannels.buyButton;
  const someChannelsSelected = saleChannels.onlineStore || saleChannels.buyButton;

  // Sync images/videos state ONCE after hydration
  React.useEffect(() => {
    if (_hasHydrated && !hasMediaSyncedRef.current) {
      hasMediaSyncedRef.current = true;
      const storedImages = product.images?.map(img => img.url) || [];
      const storedVideos = product.videos?.map(vid => vid.url) || [];
      setProductImages(storedImages);
      setProductVideos(storedVideos);
    }
  }, [_hasHydrated, product.images, product.videos]);

  // Handle image upload
  const handleImageUpload = (url: string) => {
    const updatedImages = [...productImages, url];
    setProductImages(updatedImages);
    updateProduct({
      images: updatedImages.map(url => ({ url }))
    });
  };

  // Handle video upload
  const handleVideoUpload = (url: string) => {
    const updatedVideos = [...productVideos, url];
    setProductVideos(updatedVideos);
    updateProduct({
      videos: updatedVideos.map(url => ({ url }))
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
    updateProduct({
      images: updatedImages.map(url => ({ url }))
    });
  };

  // Remove video
  const removeVideo = (index: number) => {
    const updatedVideos = productVideos.filter((_, i) => i !== index);
    setProductVideos(updatedVideos);
    updateProduct({
      videos: updatedVideos.map(url => ({ url }))
    });
  };

  const onSubmit = (data: ExtendedCreateProductInput) => {
    updateProduct({
      ...data,
      storeId: storeId as string,
      images: productImages.map(url => ({ url })),
      videos: productVideos.map(url => ({ url })),
    });
    router.push(`/${storeId}/product/new/sale`);
  };

  const handleCancel = () => {
    resetStore();
    router.push(`/${storeId}/products`);
  };

  // Keep refs for current media state to avoid stale closures in auto-save
  const productImagesRef = React.useRef(productImages);
  const productVideosRef = React.useRef(productVideos);
  React.useEffect(() => {
    productImagesRef.current = productImages;
  }, [productImages]);
  React.useEffect(() => {
    productVideosRef.current = productVideos;
  }, [productVideos]);

  // Auto-save form data to store on change
  React.useEffect(() => {
    const subscription = watch((data) => {
      // Only save if we have fully hydrated and synced to avoid overwriting with empty defaults
      if (hasSyncedRef.current && hasMediaSyncedRef.current) {
        updateProduct({
          ...data,
          storeId: storeId as string,
        } as Partial<ExtendedCreateProductInput>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProduct, storeId]);

  // Show loading state until hydration completes
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
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
              <span className="hidden sm:inline">Back to product listing</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none">Continue</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs activeTab="Basic Information" />

            {/* Basic Information Form */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <p className="text-sm text-gray-500">
                  Provide essential details about your product
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  {/* Info Banner */}
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Info className="w-3 h-3 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-900">
                        Creating a Product Listing
                      </p>
                    </div>
                  </div>

                  {/* Product Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Product Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      {...register("title", { required: true })}
                      placeholder="e.g., Wireless Headphones Pro"
                    />
                  </div>

                  {/* Product Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Product Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={watch("category") || ""}
                      onValueChange={(value) => {
                        setValue("category", value);
                        updateProduct({ category: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {/* Electronics */}
                        <SelectItem value="smartphone">Smartphones</SelectItem>
                        <SelectItem value="laptop">Laptops</SelectItem>
                        <SelectItem value="tablet">Tablets</SelectItem>
                        <SelectItem value="desktop">Desktop Computers</SelectItem>
                        <SelectItem value="accessory">Electronics Accessories</SelectItem>
                        <SelectItem value="camera">Cameras</SelectItem>
                        <SelectItem value="headphones">Headphones & Audio</SelectItem>
                        
                        {/* Fashion & Clothing */}
                        <SelectItem value="mens_clothing">Men's Clothing</SelectItem>
                        <SelectItem value="womens_clothing">Women's Clothing</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="bags">Bags & Luggage</SelectItem>
                        <SelectItem value="accessories_fashion">Fashion Accessories</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="watches">Watches</SelectItem>
                        
                        {/* Home & Furniture */}
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="home_decor">Home Decor</SelectItem>
                        <SelectItem value="bedding">Bedding</SelectItem>
                        <SelectItem value="kitchen">Kitchen Appliances</SelectItem>
                        <SelectItem value="lighting">Lighting</SelectItem>
                        
                        {/* Health & Beauty */}
                        <SelectItem value="skincare">Skincare</SelectItem>
                        <SelectItem value="cosmetics">Cosmetics</SelectItem>
                        <SelectItem value="haircare">Hair Care</SelectItem>
                        <SelectItem value="health_supplements">Health Supplements</SelectItem>
                        <SelectItem value="fitness">Fitness Equipment</SelectItem>
                        
                        {/* Food & Beverages */}
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="bakery">Bakery Products</SelectItem>
                        <SelectItem value="organic_food">Organic Food</SelectItem>
                        
                        {/* Sports & Outdoors */}
                        <SelectItem value="sports_equipment">Sports Equipment</SelectItem>
                        <SelectItem value="outdoor_gear">Outdoor Gear</SelectItem>
                        <SelectItem value="bikes">Bikes</SelectItem>
                        <SelectItem value="camping">Camping Gear</SelectItem>
                        
                        {/* Books & Media */}
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="ebooks">E-Books</SelectItem>
                        <SelectItem value="magazines">Magazines</SelectItem>
                        <SelectItem value="music">Music & CDs</SelectItem>
                        
                        {/* Toys & Games */}
                        <SelectItem value="toys">Toys</SelectItem>
                        <SelectItem value="games">Games</SelectItem>
                        <SelectItem value="hobbies">Hobbies & Crafts</SelectItem>
                        
                        {/* Automotive */}
                        <SelectItem value="car_parts">Car Parts</SelectItem>
                        <SelectItem value="car_accessories">Car Accessories</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle Parts</SelectItem>
                        
                        {/* Pet Supplies */}
                        <SelectItem value="pet_food">Pet Food</SelectItem>
                        <SelectItem value="pet_accessories">Pet Accessories</SelectItem>
                        <SelectItem value="pet_toys">Pet Toys</SelectItem>
                        
                        {/* Office & Stationery */}
                        <SelectItem value="stationery">Stationery</SelectItem>
                        <SelectItem value="office_supplies">Office Supplies</SelectItem>
                        <SelectItem value="furniture_office">Office Furniture</SelectItem>
                        
                        {/* Services */}
                        <SelectItem value="service_repair">Repair Services</SelectItem>
                        <SelectItem value="service_cleaning">Cleaning Services</SelectItem>
                        <SelectItem value="service_consulting">Consulting Services</SelectItem>
                        <SelectItem value="service_tutoring">Tutoring Services</SelectItem>
                        <SelectItem value="service_photography">Photography Services</SelectItem>
                        <SelectItem value="service_personal_training">Personal Training</SelectItem>
                        
                        {/* Other */}
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
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Describe your product in detail. Include key features, materials, dimensions, and what makes it special."
                      className="min-h-[150px]"
                    />
                    <p className="text-xs text-gray-500">
                      A detailed description helps customers understand your offering better
                    </p>
                  </div>

                  {/* Vendor & Brand */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="vendor">Vendor (Optional)</Label>
                      <Input
                        id="vendor"
                        {...register("vendor")}
                        placeholder="Vendor or supplier name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">
                        Brand <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="brand"
                        {...register("brand")}
                        placeholder="Brand name"
                      />
                    </div>
                  </div>

                  {/* Model & Condition */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        {...register("model")}
                        placeholder="Model number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">
                        Condition <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={watch("condition") || ""}
                        onValueChange={(value) => {
                          setValue("condition", value);
                          updateProduct({ condition: value });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="refurbished">Refurbished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Warranty */}
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Warranty</Label>
                    <Input
                      id="warranty"
                      {...register("warranty")}
                      placeholder="e.g., 1 year manufacturer warranty"
                    />
                  </div>

                  {/* Specifications */}
                  <div className="space-y-2">
                    <Label htmlFor="specifications">Specifications</Label>
                    <Textarea
                      id="specifications"
                      {...register("specifications")}
                      placeholder="Enter product specifications: dimensions, weight, materials, technical details, etc."
                      className="min-h-[120px]"
                    />
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-2">
                    <Label>Images, Video or 3D</Label>
                    
                    {/* Display existing media or upload placeholder */}
                    {productImages.length === 0 && productVideos.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8">
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
                            type="product"
                            onUpload={handleImageUpload}
                            accept="image/*"
                            maxSize={5}
                            endpoint="/product/media"
                          >
                            <div>
                              <p className="text-sm text-gray-600 mb-2">
                                Drag and drop or click to upload
                              </p>
                              <p className="text-xs text-gray-400">
                                Supported formats: JPG, PNG, GIF, MP4, 3D models
                              </p>
                            </div>
                          </FileUpload>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Display existing images */}
                        {productImages.map((imageUrl, index) => (
                          <div key={`image-${index}`} className="relative aspect-square group">
                            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
                              <img
                                src={imageUrl}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}

                        {/* Display existing videos */}
                        {productVideos.map((videoUrl, index) => (
                          <div key={`video-${index}`} className="relative aspect-square group">
                            <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
                              <video
                                src={videoUrl}
                                className="w-full h-full object-cover"
                                controls
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeVideo(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}

                        {/* Add new image button */}
                        {productImages.length + productVideos.length < 10 && (
                          <div className="aspect-square">
                            <FileUpload
                              type="product"
                              onUpload={handleImageUpload}
                              accept="image/*"
                              maxSize={5}
                              endpoint="/product/media"
                              className="h-full"
                            >
                              <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                                <Button variant="ghost" size="icon" type="button">
                                  +
                                </Button>
                              </div>
                            </FileUpload>
                          </div>
                        )}

                        {/* Add new video button */}
                        {productImages.length + productVideos.length < 10 && productVideos.length < 3 && (
                          <div className="aspect-square">
                            <FileUpload
                              type="video"
                              onUpload={handleVideoUpload}
                              accept="video/*"
                              maxSize={30}
                              endpoint="/product/media"
                              className="h-full"
                            >
                              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                                <Button variant="ghost" size="sm" type="button">
                                  + Video
                                </Button>
                              </div>
                            </FileUpload>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Upload up to 10 images/videos. First image will be the main product image.
                    </p>
                  </div>
                </form>
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
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={watch("status") || "DRAFT"}
                      onValueChange={(value) => {
                        setValue("status", value);
                        updateProduct({ status: value });
                      }}
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
                        <Checkbox 
                          id="all"
                          checked={allChannelsSelected}
                          ref={el => {
                            if (el && someChannelsSelected && !allChannelsSelected) {
                              el.indeterminate = true;
                            }
                          }}
                          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                        />
                        <Label htmlFor="all">Select all</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="online-store"
                          checked={saleChannels.onlineStore}
                          onCheckedChange={(checked) => handleChannelChange('onlineStore', checked as boolean)}
                        />
                        <Label htmlFor="online-store">Online Store</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="buy-button"
                          checked={saleChannels.buyButton}
                          onCheckedChange={(checked) => handleChannelChange('buyButton', checked as boolean)}
                        />
                        <Label htmlFor="buy-button">Buy Button</Label>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewProduct;