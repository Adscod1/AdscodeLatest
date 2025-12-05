"use client";
import React from "react";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../../components/product-tabs";
import { useForm } from "react-hook-form";
import { CreateProductInput } from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProductStore } from "@/store/use-product-store";

interface ExtendedDeliveryInput extends CreateProductInput {
  requiresShipping?: boolean;
  processingTime?: string;
  shippingMethod?: string;
  shippingCost?: number;
  offerFreeShipping?: boolean;
}

const DeliveryPage = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { product, updateProduct, reset: resetStore, _hasHydrated } = useProductStore();
  const hasSyncedRef = React.useRef(false);

  const { register, handleSubmit, watch, setValue, reset: resetForm } = useForm<ExtendedDeliveryInput>({
    defaultValues: {
      storeId: storeId as string,
      weightUnit: "kg",
      sizeUnit: "cm",
      requiresShipping: true,
      processingTime: "",
      shippingMethod: "standard",
      shippingCost: 0,
      offerFreeShipping: false,
    },
  });

  // Sync form with store data ONCE after hydration
  React.useEffect(() => {
    if (_hasHydrated && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      resetForm({
        ...product,
        storeId: storeId as string,
        weightUnit: product.weightUnit || "kg",
        sizeUnit: product.sizeUnit || "cm",
        requiresShipping: (product as ExtendedDeliveryInput).requiresShipping !== false,
        processingTime: (product as ExtendedDeliveryInput).processingTime || "",
        shippingMethod: (product as ExtendedDeliveryInput).shippingMethod || "standard",
        shippingCost: (product as ExtendedDeliveryInput).shippingCost || 0,
        offerFreeShipping: (product as ExtendedDeliveryInput).offerFreeShipping || false,
      });
    }
  }, [_hasHydrated]);

  const requiresShipping = watch("requiresShipping");
  const shippingMethod = watch("shippingMethod");
  const offerFreeShipping = watch("offerFreeShipping");

  // Get currency from product store
  const selectedCurrency = (product as any).currency || "UGX - Ugandan Shilling";

  // Get currency symbol based on selected currency
  const getCurrencySymbol = (currency: string): string => {
    const currencyMap: Record<string, string> = {
      "UGX - Ugandan Shilling": "UGX",
      "USD - US Dollar": "$",
      "EUR - Euro": "€",
      "GBP - British Pound": "£",
    };
    return currencyMap[currency] || "UGX";
  };

  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const onSubmit = (data: ExtendedDeliveryInput) => {
    updateProduct({
      ...data,
      storeId: storeId as string,
    });
    router.push(`/${storeId}/product/new/publishing`);
  };

  const handleCancel = () => {
    resetStore();
    router.push(`/${storeId}/listings`);
  };

  // Auto-save form data to store on change
  React.useEffect(() => {
    const subscription = watch((data) => {
      // Only save if we have hydrated to avoid overwriting with empty defaults
      if (hasSyncedRef.current) {
        updateProduct({
          ...data,
          storeId: storeId as string,
        } as Partial<ExtendedDeliveryInput>);
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
            <ProductTabs activeTab="Delivery" />

            {/* Delivery Form */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
                <p className="text-sm text-gray-500">
                  Configure shipping and delivery
                </p>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8">
                {/* Requires Shipping Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="requires-shipping" 
                    checked={requiresShipping ?? true}
                    onCheckedChange={(checked) => {
                      setValue("requiresShipping", checked as boolean);
                      updateProduct({ requiresShipping: checked as boolean });
                    }}
                  />
                  <Label htmlFor="requires-shipping" className="text-sm font-medium">
                    This product requires shipping
                  </Label>
                </div>

                {/* Dimensions Section */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      {...register("weight", { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      {...register("length", { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      {...register("width", { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      {...register("height", { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Processing Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="processing-time">Processing Time</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time needed to prepare order for shipping</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={watch("processingTime") || ""}
                    onValueChange={(value) => {
                      setValue("processingTime", value);
                      updateProduct({ processingTime: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select processing time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 business days</SelectItem>
                      <SelectItem value="3-5">3-5 business days</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Shipping Methods */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Shipping Methods</Label>
                  <RadioGroup
                    value={shippingMethod || "standard"}
                    onValueChange={(value) => {
                      setValue("shippingMethod", value);
                      updateProduct({ shippingMethod: value });
                    }}
                  >
                    <div className="flex items-center space-x-2 py-2 sm:py-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal cursor-pointer text-sm sm:text-base">
                        Standard Shipping (5-7 days)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 py-2 sm:py-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-normal cursor-pointer text-sm sm:text-base">
                        Express Shipping (2-3 days)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 py-2 sm:py-3">
                      <RadioGroupItem value="overnight" id="overnight" />
                      <Label htmlFor="overnight" className="font-normal cursor-pointer text-sm sm:text-base">
                        Overnight Shipping
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Offer Free Shipping */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                    <Checkbox 
                      id="free-shipping"
                      checked={offerFreeShipping ?? false}
                      onCheckedChange={(checked) => {
                        setValue("offerFreeShipping", checked as boolean);
                        updateProduct({ offerFreeShipping: checked as boolean });
                      }}
                    />
                    <Label htmlFor="free-shipping" className="font-normal cursor-pointer">
                      Offer free shipping
                    </Label>
                  </div>
                </div>

                {/* Shipping Cost */}
                {!offerFreeShipping && (
                  <div className="space-y-2">
                    <Label htmlFor="shipping-cost">Shipping Cost</Label>
                    <div className="relative w-full sm:w-48">
                      <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                        {currencySymbol}
                      </span>
                      <Input
                        id="shipping-cost"
                        {...register("shippingCost", { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-12"
                      />
                    </div>
                  </div>
                )}

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
                      <Select
                        value={watch("countryOfOrigin") || ""}
                        onValueChange={(value) => {
                          setValue("countryOfOrigin", value);
                          updateProduct({ countryOfOrigin: value });
                        }}
                      >
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
                          <SelectItem value="Uganda">Uganda</SelectItem>
                          <SelectItem value="Kenya">Kenya</SelectItem>
                          <SelectItem value="Tanzania">Tanzania</SelectItem>
                        </SelectContent>
                      </Select>
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