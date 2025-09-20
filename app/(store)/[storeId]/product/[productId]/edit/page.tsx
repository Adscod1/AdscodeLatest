"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, updateProduct } from "@/actions/product";
import { useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
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
import { toast } from "sonner";
import Link from "next/link";
import { ProductTabs } from "../../components/product-tabs";

interface FormData {
  title: string;
  description?: string;
  category?: string;
  vendor?: string;
  tags?: string;
  price: number;
  comparePrice?: number;
  costPerItem?: number;
  status: string;
  storeId: string;
  variations?: Array<{
    name: string;
    value: string;
    price: number;
    stock: number;
  }>;
  images?: Array<{
    url: string;
  }>;
  videos?: Array<{
    url: string;
  }>;
}

const EditProductPage = () => {
  const { storeId, productId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId as string),
  });

  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      vendor: "",
      tags: "",
      price: 0,
      comparePrice: 0,
      costPerItem: 0,
      status: "DRAFT",
      storeId: storeId as string,
    },
  });

  // Set form values when product data is loaded
  React.useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("description", product.description || "");
      setValue("category", product.category || "");
      setValue("vendor", product.vendor || "");
      setValue("tags", product.tags || "");
      setValue("price", product.price);
      setValue("comparePrice", product.comparePrice || 0);
      setValue("costPerItem", product.costPerItem || 0);
      setValue("status", product.status);
    }
  }, [product, setValue]);

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: (data: FormData) => updateProduct(productId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      router.push(`/${storeId}/listings`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    },
  });

  const onSubmit = (data: FormData) => {
    updateProductMutation.mutate({
      ...data,
      storeId: storeId as string,
      // Convert numeric fields
      price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      costPerItem: data.costPerItem ? Number(data.costPerItem) : undefined,
      // Keep existing relations if not modified
      variations: product?.variations,
      images: product?.images,
      videos: product?.videos,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">Loading product data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900"
            asChild
          >
            <Link href={`/${storeId}/listings`}>
              <ChevronLeft className="w-5 h-5" />
              <span>Back to listings</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>Save Changes</Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs activeTab="Basic Information" />

            {/* Basic Information Form */}
            <Card>
              <CardHeader>
                <CardTitle>Basic information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Product Title & Category */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Product title</Label>
                      <Input
                        id="title"
                        {...register("title", { required: true })}
                        placeholder="Product title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Product category</Label>
                      <Input
                        id="category"
                        {...register("category")}
                        placeholder="Enter category"
                      />
                    </div>
                  </div>

                  {/* Vendor & Tags */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="vendor">Vendor</Label>
                      <Input
                        id="vendor"
                        {...register("vendor")}
                        placeholder="Enter vendor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        {...register("tags")}
                        placeholder="Search tags"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Write something to describe your product..."
                      className="min-h-[200px]"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        {...register("price", { required: true })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comparePrice">Compare-at price</Label>
                      <Input
                        id="comparePrice"
                        type="number"
                        {...register("comparePrice")}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="costPerItem">Cost per item</Label>
                      <Input
                        id="costPerItem"
                        type="number"
                        {...register("costPerItem")}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-2">
                    <Label>Media (images, video or 3D models)</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {product?.images?.map((image) => (
                        <div
                          key={image.id}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <img
                            src={image.url}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center">
                        <Button variant="ghost" size="icon">
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      {...register("status")}
                      defaultValue={product?.status}
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
