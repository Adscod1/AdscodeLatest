"use client";
import React from "react";
import { ChevronLeft, Info, X } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../../components/product-tabs";
import { useForm, useFieldArray } from "react-hook-form";
import { CreateProductInput } from "@/actions/product";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProductStore } from "@/store/use-product-store";

interface ExtendedProductInput extends CreateProductInput {
  sku?: string;
  stockQuantity?: number;
  lowStockAlert?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  currency?: string;
  taxRate?: number;
}

const NewProductSaleInformation = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { product, updateProduct, reset } = useProductStore();

  const { register, control, watch, handleSubmit, setValue } =
    useForm<ExtendedProductInput>({
      defaultValues: {
        ...product,
        storeId: storeId as string,
        sku: "SKU-001",
        stockQuantity: 0,
        lowStockAlert: 5,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        currency: "UGX - Ugandan Shilling",
        taxRate: 0,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const price = watch("price");
  const costPerItem = watch("costPerItem");
  const profit = price && costPerItem ? price - costPerItem : 0;
  const margin =
    price && costPerItem ? ((price - costPerItem) / price) * 100 : 0;

  const onSubmit = (data: ExtendedProductInput) => {
    updateProduct({
      ...data,
      storeId: storeId as string,
    });
    router.push(`/${storeId}/product/new/delivery`);
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
              <span className="hidden sm:inline">Back to product listing</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none text-sm">
            Back
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none text-sm">Continue</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs activeTab="Sale Information" />

            {/* Sale Information Form */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Sales</CardTitle>
                <p className="text-sm text-gray-500">
                  Set your pricing and manage inventory
                </p>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8">
                {/* Pricing Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                        $
                      </span>
                      <Input
                        id="price"
                        {...register("price", { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comparePrice">Compare at Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                        $
                      </span>
                      <Input
                        id="comparePrice"
                        {...register("comparePrice", { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Original price to show discount
                    </p>
                  </div>
                </div>

                {/* SKU, Stock Quantity, Low Stock Alert */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      {...register("sku")}
                      placeholder="SKU-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">
                      Stock Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stockQuantity"
                      {...register("stockQuantity", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Get notified when stock is low</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="lowStockAlert"
                      {...register("lowStockAlert", { valueAsNumber: true })}
                      type="number"
                      placeholder="5"
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      {...register("weight", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      {...register("length", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      {...register("width", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      {...register("height", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Currency and Tax Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">
                      Currency <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={watch("currency")}
                      onValueChange={(value) => setValue("currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UGX - Ugandan Shilling">
                          UGX - Ugandan Shilling
                        </SelectItem>
                        <SelectItem value="USD - US Dollar">
                          USD - US Dollar
                        </SelectItem>
                        <SelectItem value="EUR - Euro">EUR - Euro</SelectItem>
                        <SelectItem value="GBP - British Pound">
                          GBP - British Pound
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      {...register("taxRate", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Cost and Profit Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="costPerItem">Cost per item</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cost to acquire or produce one unit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                        $
                      </span>
                      <Input
                        id="costPerItem"
                        {...register("costPerItem", { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profit</Label>
                    <div className="bg-muted px-3 py-2.5 rounded-md">
                      <span className="text-sm text-muted-foreground">
                        ${profit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Margin</Label>
                    <div className="bg-muted px-3 py-2.5 rounded-md">
                      <span className="text-sm text-muted-foreground">
                        {margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Variations Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Variations{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        (Sizes or colors)
                      </span>
                    </h3>
                  </div>

                  {/* Variations Table */}
                  {fields.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px] sm:w-[300px]">
                              <div className="flex items-center space-x-2">
                                <Checkbox />
                                <span>Size</span>
                              </div>
                            </TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Checkbox />
                                <Input
                                  {...register(`variations.${index}.value`)}
                                  className="max-w-[150px] sm:max-w-[200px]"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="relative w-24 sm:w-32">
                                <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                                  $
                                </span>
                                <Input
                                  {...register(`variations.${index}.price`, {
                                    valueAsNumber: true,
                                  })}
                                  type="number"
                                  step="0.01"
                                  className="pl-7"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                {...register(`variations.${index}.stock`, {
                                  valueAsNumber: true,
                                })}
                                type="number"
                                className="w-16 sm:w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      </Table>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() =>
                      append({
                        name: "Size",
                        value: "New Size",
                        price: price || 20,
                        stock: 0,
                      })
                    }
                  >
                    Add variation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 order-first lg:order-last">
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Total Quantity</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="track-quantity" />
                        <Label htmlFor="track-quantity" className="text-xs">
                          Track quantity
                        </Label>
                      </div>
                    </div>
                    <div className="text-2xl font-semibold">
                      {fields.reduce(
                        (sum, field) => sum + (field.stock || 0),
                        0
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="stop-selling" />
                    <Label htmlFor="stop-selling" className="text-sm">
                      Stop selling when out of stock
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="barcode" defaultChecked />
                    <Label htmlFor="barcode" className="text-sm">
                      Barcode/SKU
                    </Label>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Checkbox id="charge-tax" />
                    <Label htmlFor="charge-tax" className="text-sm">
                      Charge tax on this product
                    </Label>
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

export default NewProductSaleInformation;