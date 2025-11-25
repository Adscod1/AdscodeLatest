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
  sku?: string;
  barcode?: string;
  stock: number;
  lowStockThreshold?: number;
  variations: Array<{
    id: string;
    productId: string;
    name: string;
    value: string;
    price: number;
    stock: number;
  }>;
  images: Array<{
    id: string;
    productId: string;
    url: string;
  }>;
  videos: Array<{
    id: string;
    productId: string;
    url: string;
  }>;
}

interface UpdateProductInput {
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
  sku?: string;
  barcode?: string;
  stock: number;
  lowStockThreshold?: number;
  variations?: Array<{
    id?: string;
    productId?: string;
    name: string;
    value: string;
    price: number;
    stock: number;
  }>;
}

interface FormData {
  variations: Array<{
    id?: string;
    productId?: string;
    name: string;
    value: string;
    price: number;
    stock: number;
  }>;
  sku?: string;
  barcode?: string;
  stock: number;
  lowStockThreshold?: number;
}

const EditSaleInfoPage = () => {
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
      variations: [],
      sku: "",
      barcode: "",
      stock: 0,
      lowStockThreshold: 5,
    },
  });

  // Set form values when product data is loaded
  React.useEffect(() => {
    if (product) {
      setValue("variations", product.variations || []);
      setValue("sku", product.sku || "");
      setValue("barcode", product.barcode || "");
      setValue("stock", product.stock || 0);
      setValue("lowStockThreshold", product.lowStockThreshold || 5);
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
        router.push(`/${storeId}/product/${productId}/edit/delivery`);
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
      stock: Number(data.stock),
      sku: data.sku,
      barcode: data.barcode,
      lowStockThreshold: data.lowStockThreshold
        ? Number(data.lowStockThreshold)
        : undefined,
      variations: data.variations.map((v) => ({
        ...v,
        price: Number(v.price),
        stock: Number(v.stock),
      })),
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
            <ProductTabs
              activeTab="Sale Information"
              productId={productId as string}
            />

            {/* Inventory Form */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* SKU & Barcode */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                      <Input
                        id="sku"
                        {...register("sku")}
                        placeholder="Enter SKU"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="barcode">
                        Barcode (ISBN, UPC, GTIN, etc.)
                      </Label>
                      <Input
                        id="barcode"
                        {...register("barcode")}
                        placeholder="Enter barcode"
                      />
                    </div>
                  </div>

                  {/* Stock Management */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        {...register("stock")}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">
                        Low stock threshold
                      </Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        {...register("lowStockThreshold")}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  {/* Variations */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Variations</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentVariations = product?.variations || [];
                          setValue("variations", [
                            ...currentVariations,
                            { name: "", value: "", price: 0, stock: 0 },
                          ]);
                        }}
                      >
                        Add Variation
                      </Button>
                    </div>
                    {product?.variations?.map((variation, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4">
                        <div>
                          <Input
                            {...register(`variations.${index}.name`)}
                            placeholder="Name (e.g. Size)"
                            defaultValue={variation.name}
                          />
                        </div>
                        <div>
                          <Input
                            {...register(`variations.${index}.value`)}
                            placeholder="Value (e.g. Large)"
                            defaultValue={variation.value}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            {...register(`variations.${index}.price`)}
                            placeholder="Price"
                            defaultValue={variation.price}
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            {...register(`variations.${index}.stock`)}
                            placeholder="Stock"
                            defaultValue={variation.stock}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Total Stock</p>
                  <p className="text-2xl font-bold">{product?.stock || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Variations</p>
                  <p className="text-2xl font-bold">
                    {product?.variations?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSaleInfoPage;
