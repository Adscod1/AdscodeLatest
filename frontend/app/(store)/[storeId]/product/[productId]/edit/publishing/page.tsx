"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductById, updateProduct } from "@/actions/product";
import { useForm } from "react-hook-form";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { ProductTabs } from "../../../components/product-tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  publishedAt?: string;
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
  publishedAt?: string;
}

interface FormData {
  status: string;
}

const EditPublishingPage = () => {
  const { storeId, productId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch product data
  const { data: product, isLoading } = useQuery<Product | null, Error>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const data = await getProductById(productId as string);
      if (!data) return null;
      return data as unknown as Product;
    },
  });

  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      status: "DRAFT",
    },
  });

  // Set form values when product data is loaded
  React.useEffect(() => {
    if (product) {
      setValue("status", product.status);
    }
  }, [product, setValue]);

  // Update product mutation
  const updateProductMutation = useMutation<Product, Error, UpdateProductInput>(
    {
      mutationFn: async (data) => {
        const result = await updateProduct(productId as string, data);
        return result as unknown as Product;
      },
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
    }
  );

  const onSubmit = (data: FormData) => {
    if (!product) return;

    const updateData: UpdateProductInput = {
      title: product.title,
      price: product.price,
      status: data.status,
      storeId: storeId as string,
      publishedAt:
        data.status === "ACTIVE" ? new Date().toISOString() : undefined,
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
          <Button onClick={handleSubmit(onSubmit)}>Save and Finish</Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs
              activeTab="Publishing"
              productId={productId as string}
            />

            {/* Publishing Form */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Status */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        {...register("status")}
                        defaultValue={product?.status}
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
                        This product will be hidden from all sales channels.
                      </p>
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
                <CardTitle>Publishing Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Current Status</p>
                  <p className="text-2xl font-bold capitalize">
                    {product?.status.toLowerCase()}
                  </p>
                </div>
                {product?.publishedAt && (
                  <div>
                    <p className="text-sm font-medium">Published At</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(product.publishedAt).toLocaleString()}
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

export default EditPublishingPage;
