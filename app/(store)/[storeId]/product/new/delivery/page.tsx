"use client";
import React from "react";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../../components/product-tabs";
import { useForm } from "react-hook-form";
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
import { useProductStore } from "@/store/use-product-store";

const DeliveryPage = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { product, updateProduct, reset } = useProductStore();

  const { register, handleSubmit } = useForm<CreateProductInput>({
    defaultValues: {
      ...product,
      storeId: storeId as string,
      weightUnit: "lb",
      sizeUnit: "inch",
    },
  });

  const onSubmit = (data: CreateProductInput) => {
    updateProduct({
      ...data,
      storeId: storeId as string,
    });
    router.push(`/${storeId}/product/new/publishing`);
  };

  const handleCancel = () => {
    reset();
    router.push(`/${storeId}/listings`);
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
            <ProductTabs activeTab="Delivery" />

            {/* Delivery Form */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Weight Section */}
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      {...register("weight", { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="w-32"
                    />
                    <Select {...register("weightUnit")} defaultValue="lb">
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lb">lb</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="oz">oz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Parcel Size Section */}
                <div className="space-y-2">
                  <Label>Parcel size</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      {...register("length", { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="w-24"
                    />
                    <span className="text-muted-foreground">×</span>
                    <Input
                      {...register("width", { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="w-24"
                    />
                    <span className="text-muted-foreground">×</span>
                    <Input
                      {...register("height", { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="w-24"
                    />
                    <Select {...register("sizeUnit")} defaultValue="inch">
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inch">inch</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox id="countrywide" defaultChecked />
                    <Label htmlFor="countrywide">
                      This product is available countrywide
                    </Label>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                      Worldwide Delivery information
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Information for worldwide shipping will be printed on
                      shipping forms & labels during fulfillment
                    </p>

                    {/* Country/Region Selection */}
                    <div className="space-y-2">
                      <Label>Country/Region of origin</Label>
                      <Select {...register("countryOfOrigin")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Enter region of origin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
                          <SelectItem value="European Union">
                            European Union
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* HS Code Search */}
                    <div className="space-y-2">
                      <Label>HS (Harmonize system code)</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          {...register("harmonizedSystemCode")}
                          type="text"
                          placeholder="Search (product keyword/code)"
                          className="pl-10"
                        />
                      </div>
                    </div>
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

export default DeliveryPage;
