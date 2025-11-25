"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { ProductTabs } from "../../../components/product-tabs";
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string;
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
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  requiresShipping: boolean;
  variations: Array<{
    id: string;
    productId: string;
    name: string;
    value: string;
    price: number;
    stock: number;
  }>;
}

interface UpdateProductInput {
  title: string;
  price: number;
  status: string;
  storeId: string;
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  requiresShipping: boolean;
}

interface FormData {
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  requiresShipping: boolean;
}

const EditDeliveryPage = () => {
  const { storeId, productId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch product data
  const { data: product, isLoading } = useQuery<Product | null, Error>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await api.products.getById(productId as string);
      if (!response.product) return null;
      return response.product as unknown as Product;
    },
  });

  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      weight: 0,
      width: 0,
      height: 0,
      length: 0,
      requiresShipping: true,
    },
  });

  // Set form values when product data is loaded
  React.useEffect(() => {
    if (product) {
      setValue("weight", product.weight || 0);
      setValue("width", product.width || 0);
      setValue("height", product.height || 0);
      setValue("length", product.length || 0);
      setValue("requiresShipping", product.requiresShipping);
    }
  }, [product, setValue]);

  // Update product mutation
  const updateProductMutation = useMutation<Product, Error, UpdateProductInput>(
    {
      mutationFn: async (data) => {
        const result = await api.products.update(productId as string, data);
        return result.product as unknown as Product;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["product", productId] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product updated successfully");
        router.push(`/${storeId}/product/${productId}/edit/publishing`);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to update product"
        );
      },
    }
  );

  const onSubmit = (data: FormData) => {
    if (!product) return;

    const updateData: UpdateProductInput = {
      title: product.title,
      price: product.price,
      status: product.status,
      storeId: storeId as string,
      weight: data.weight ? Number(data.weight) : undefined,
      width: data.width ? Number(data.width) : undefined,
      height: data.height ? Number(data.height) : undefined,
      length: data.length ? Number(data.length) : undefined,
      requiresShipping: data.requiresShipping,
    };

    updateProductMutation.mutate(updateData);
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
          <Button onClick={handleSubmit(onSubmit)}>Save and Continue</Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs activeTab="Delivery" productId={productId as string} />

            {/* Shipping Form */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Requires Shipping */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Physical product</Label>
                      <p className="text-sm text-muted-foreground">
                        This is a physical item that needs to be shipped
                      </p>
                    </div>
                    <Switch
                      {...register("requiresShipping")}
                      defaultChecked={product?.requiresShipping}
                    />
                  </div>

                  {/* Weight & Dimensions */}
                  <div className="space-y-4">
                    <Label>Weight and dimensions</Label>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          {...register("weight")}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="length">Length (cm)</Label>
                        <Input
                          id="length"
                          type="number"
                          step="0.1"
                          {...register("length")}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (cm)</Label>
                        <Input
                          id="width"
                          type="number"
                          step="0.1"
                          {...register("width")}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          {...register("height")}
                          placeholder="0.0"
                        />
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
                <CardTitle>Shipping Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Shipping Type</p>
                  <p className="text-2xl font-bold">
                    {product?.requiresShipping ? "Physical" : "Digital"}
                  </p>
                </div>
                {product?.requiresShipping && (
                  <div>
                    <p className="text-sm font-medium">Package Details</p>
                    <p className="text-sm text-muted-foreground">
                      {product.weight ? `${product.weight}kg` : "No weight set"}
                      {product.length && product.width && product.height
                        ? ` · ${product.length}×${product.width}×${product.height}cm`
                        : ""}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryPage;
