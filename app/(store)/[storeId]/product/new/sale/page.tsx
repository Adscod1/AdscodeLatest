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

const NewProductSaleInformation = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { product, updateProduct, reset } = useProductStore();

  const { register, control, watch, handleSubmit } =
    useForm<CreateProductInput>({
      defaultValues: {
        ...product,
        storeId: storeId as string,
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

  const onSubmit = (data: CreateProductInput) => {
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
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
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
            <ProductTabs activeTab="Sale Information" />

            {/* Sale Information Form */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Sale information</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tax" />
                  <Label htmlFor="tax">Charge tax on this product</Label>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Pricing Section */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="flex flex-row items-center gap-3">
                      <div className="">
                        <p className="text-sm">UGX</p>
                      </div>
                      <Input
                        id="price"
                        {...register("price", { valueAsNumber: true })}
                        type="number"
                        step="1000"
                        defaultValue={20.0}
                        className=""
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comparePrice">Compare-at price</Label>
                    <div className="flex flex-row items-center gap-3">
                      <div className="">
                        <p className="text-sm">UGX</p>
                      </div>
                      <Input
                        id="comparePrice"
                        {...register("comparePrice", { valueAsNumber: true })}
                        type="number"
                        step="1000"
                        defaultValue={25.0}
                        className=""
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                            >
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Original price before discount</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                {/* Cost and Profit Section */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="costPerItem">Cost per item</Label>
                    <div className="flex flex-row items-center gap-3">
                      <div className="">
                        <p className="text-sm">UGX</p>
                      </div>
                      <Input
                        id="costPerItem"
                        {...register("costPerItem", { valueAsNumber: true })}
                        type="number"
                        step="1000"
                        defaultValue={5.0}
                        className=""
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                            >
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cost to acquire or produce one unit</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Profit</Label>
                    <div className="bg-muted px-3 py-2 rounded-md">
                      <span className="text-muted-foreground">
                        UGX {profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Margin</Label>
                    <div className="bg-muted px-3 py-2 rounded-md">
                      <span className="text-muted-foreground">
                        {margin.toLocaleString()}%
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">
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
                                className="max-w-[200px]"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="relative w-24">
                              <span className="absolute left-3 top-2 text-gray-500">
                                UGX
                              </span>
                              <Input
                                {...register(`variations.${index}.price`, {
                                  valueAsNumber: true,
                                })}
                                type="number"
                                step="1000"
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
                              className="w-20"
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
          <div className="w-80">
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
                        <Label htmlFor="track-quantity">Track quantity</Label>
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
                    <Label htmlFor="stop-selling">
                      Stop selling when out of stock
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="barcode" defaultChecked />
                    <Label htmlFor="barcode">Barcode/SKU</Label>
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
