"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../components/product-tabs";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { CreateProductInput } from "@/actions/product";
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

const CreateNewProduct = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { product, updateProduct, reset } = useProductStore();

  const { register, handleSubmit } = useForm<CreateProductInput>({
    defaultValues: {
      ...product,
      storeId: storeId as string,
    },
  });

  const onSubmit = (data: CreateProductInput) => {
    updateProduct({
      ...data,
      storeId: storeId as string,
    });
    router.push(`/${storeId}/product/new/sale`);
  };

  const handleCancel = () => {
    reset();
    router.push(`/${storeId}/products`);
  };

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
            <Link href={`/${storeId}/products`}>
              <ChevronLeft className="w-5 h-5" />
              <span>Back to product listing</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)}>Next</Button>
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

                  {/* Media Upload */}
                  <div className="space-y-2">
                    <Label>Media (images, video or 3D models)</Label>
                    <div className="grid grid-cols-4 gap-4">
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
                        <Checkbox id="all" />
                        <Label htmlFor="all">Select all</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="online-store" />
                        <Label htmlFor="online-store">Online Store</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="buy-button" />
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
