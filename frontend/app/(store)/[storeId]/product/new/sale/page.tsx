"use client";
import React from "react";
import { ChevronLeft, Info, X, Copy, Check, ChevronDown, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../../components/product-tabs";
import { useForm, useFieldArray } from "react-hook-form";
import { CreateProductInput } from "@/lib/api-client";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ExtendedProductInput extends CreateProductInput {
  productId?: string;
  stockQuantity?: number;
  lowStockAlert?: number;
  currency?: string;
  taxRate?: number;
}

// Generate a secure, unique Product ID
const generateProductId = (): string => {
  // Use timestamp + random string for uniqueness and security
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `PRD-${timestamp}-${randomStr}`.toUpperCase();
};

const NewProductSaleInformation = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { product, updateProduct, reset: resetStore, _hasHydrated } = useProductStore();
  const [copied, setCopied] = React.useState(false);
  const [expandedVariants, setExpandedVariants] = React.useState<Record<string, boolean>>({
    Size: true, // Size expanded by default
  });
  const [selectedVariants, setSelectedVariants] = React.useState<Set<number>>(new Set());
  const [selectedVariantGroups, setSelectedVariantGroups] = React.useState<Set<string>>(new Set());
  const [showAddVariantDialog, setShowAddVariantDialog] = React.useState(false);
  const [newVariantName, setNewVariantName] = React.useState("");
  const hasSyncedRef = React.useRef(false);
  
  // Generate Product ID on component mount (or use existing from store)
  const productIdRef = React.useRef<string | null>(null);
  if (!productIdRef.current) {
    productIdRef.current = generateProductId();
  }

  const { register, control, watch, handleSubmit, setValue, reset: resetForm } =
    useForm<ExtendedProductInput>({
      defaultValues: {
        storeId: storeId as string,
        productId: productIdRef.current,
        stockQuantity: 0,
        lowStockAlert: 5,
        currency: "UGX - Ugandan Shilling",
        taxRate: 1.8,
      },
    });

  // Sync form with store data ONCE after hydration
  React.useEffect(() => {
    if (_hasHydrated && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      const storedProductId = (product as ExtendedProductInput).productId || productIdRef.current;
      resetForm({
        ...product,
        storeId: storeId as string,
        productId: storedProductId,
        stockQuantity: (product as ExtendedProductInput).stockQuantity || 0,
        lowStockAlert: (product as ExtendedProductInput).lowStockAlert || 5,
        currency: (product as ExtendedProductInput).currency || "UGX - Ugandan Shilling",
        taxRate: (product as ExtendedProductInput).taxRate || 0,
      });
    }
  }, [_hasHydrated]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  // Group variations by their name (e.g., "Size", "Color")
  const groupedVariations = React.useMemo(() => {
    const groups: Record<string, { index: number; field: typeof fields[0] }[]> = {};
    fields.forEach((field, index) => {
      const name = field.name || "Size";
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push({ index, field });
    });
    return groups;
  }, [fields]);

  const toggleVariantGroup = (name: string) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleAddVariantType = () => {
    setShowAddVariantDialog(true);
    setNewVariantName("");
  };

  const handleConfirmVariantType = () => {
    if (!newVariantName.trim()) return;

    const variantName = newVariantName.trim();

    // Add first item of new variant type
    append({
      name: variantName,
      value: `New ${variantName}`,
      price: price || 20,
      stock: 0,
    });

    // Auto-expand the new variant group
    setExpandedVariants((prev) => ({
      ...prev,
      [variantName]: true,
    }));

    // Close dialog and reset
    setShowAddVariantDialog(false);
    setNewVariantName("");
  };

  // Handle parent checkbox to select/deselect all variants in a group
  const handleGroupCheckboxChange = (variantName: string, items: typeof groupedVariations[string], checked: boolean) => {
    const newSelected = new Set(selectedVariants);
    if (checked) {
      // Select all items in this group
      items.forEach(({ index }) => {
        newSelected.add(index);
      });
      setSelectedVariantGroups(prev => new Set(prev).add(variantName));
    } else {
      // Deselect all items in this group
      items.forEach(({ index }) => {
        newSelected.delete(index);
      });
      setSelectedVariantGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(variantName);
        return newSet;
      });
    }
    setSelectedVariants(newSelected);
  };

  // Handle individual variant checkbox
  const handleVariantCheckboxChange = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedVariants);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedVariants(newSelected);
  };

  // Check if all variants in a group are selected
  const isGroupFullySelected = (items: typeof groupedVariations[string]): boolean => {
    return items.every(({ index }) => selectedVariants.has(index));
  };

  // Check if any variants in a group are selected
  const isGroupPartiallySelected = (items: typeof groupedVariations[string]): boolean => {
    return items.some(({ index }) => selectedVariants.has(index)) && !isGroupFullySelected(items);
  };

  const price = watch("price");
  const selectedCurrency = watch("currency") || "UGX - Ugandan Shilling";

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

  const onSubmit = (data: ExtendedProductInput) => {
    updateProduct({
      ...data,
      storeId: storeId as string,
    });
    router.push(`/${storeId}/product/new/delivery`);
  };

  const handleCancel = () => {
    resetStore();
    router.push(`/${storeId}/products`);
  };

  // Auto-save form data to store on change
  React.useEffect(() => {
    const subscription = watch((data) => {
      // Only save if we have hydrated to avoid overwriting with empty defaults
      if (hasSyncedRef.current) {
        updateProduct({
          ...data,
          storeId: storeId as string,
        } as Partial<ExtendedProductInput>);
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
                        {currencySymbol}
                      </span>
                      <Input
                        id="price"
                        {...register("price", { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comparePrice">Compare at Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                        {currencySymbol}
                      </span>
                      <Input
                        id="comparePrice"
                        {...register("comparePrice", { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-12"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Original price to show discount
                    </p>
                  </div>
                </div>

                {/* Product ID, Stock Quantity, Low Stock Alert */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productId">Product ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="productId"
                        value={productIdRef.current}
                        disabled
                        className="bg-gray-100"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(productIdRef.current);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Auto-generated unique identifier
                    </p>
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

                {/* Currency and Tax Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">
                      Currency <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={watch("currency") || "UGX - Ugandan Shilling"}
                      onValueChange={(value) => {
                        setValue("currency", value);
                        updateProduct({ currency: value });
                      }}
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
                      placeholder="1.8"
                    />
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddVariantType}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Variant Type
                    </Button>
                  </div>

                  {/* Hierarchical Variations */}
                  {Object.keys(groupedVariations).length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      {Object.entries(groupedVariations).map(([variantName, items]) => (
                        <div key={variantName} className="border-b last:border-b-0">
                          {/* Parent Variant Header (e.g., Size) */}
                          <div
                            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                            onClick={() => toggleVariantGroup(variantName)}
                          >
                            <div className="flex items-center space-x-3">
                              {expandedVariants[variantName] ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )}
                              <Checkbox 
                                checked={isGroupFullySelected(items)}
                                ref={el => {
                                  if (el && isGroupPartiallySelected(items)) {
                                    el.indeterminate = true;
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onCheckedChange={(checked) => {
                                  handleGroupCheckboxChange(variantName, items, checked as boolean);
                                }}
                              />
                              <span className="font-medium">{variantName}</span>
                              <span className="text-sm text-muted-foreground">
                                ({items.length} options)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                append({
                                  name: variantName,
                                  value: `New ${variantName}`,
                                  price: price || 20,
                                  stock: 0,
                                });
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add {variantName}
                            </Button>
                          </div>

                          {/* Sub-variants (e.g., Small, Medium, Large) */}
                          {expandedVariants[variantName] && (
                            <div className="bg-white">
                              {/* Sub-variant Header */}
                              <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b bg-gray-50/50 text-sm font-medium text-gray-500">
                                <div className="col-span-5 pl-8">Option</div>
                                <div className="col-span-3">Price</div>
                                <div className="col-span-3">Available</div>
                                <div className="col-span-1"></div>
                              </div>
                              
                              {/* Sub-variant Rows */}
                              {items.map(({ index, field }) => (
                                <div
                                  key={field.id}
                                  className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-b-0 items-center hover:bg-gray-50/50"
                                >
                                  <div className="col-span-5">
                                    <div className="flex items-center space-x-2 pl-8">
                                      <Checkbox 
                                        checked={selectedVariants.has(index)}
                                        onCheckedChange={(checked) => {
                                          handleVariantCheckboxChange(index, checked as boolean);
                                        }}
                                      />
                                      <Input
                                        {...register(`variations.${index}.value`)}
                                        className="max-w-[180px]"
                                        placeholder="e.g., Small (S)"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-span-3">
                                    <div className="relative w-28">
                                      <span className="absolute left-3 top-2.5 text-sm text-gray-500">
                                        {currencySymbol}
                                      </span>
                                      <Input
                                        {...register(`variations.${index}.price`, {
                                          valueAsNumber: true,
                                        })}
                                        type="number"
                                        step="0.01"
                                        className="pl-12"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-span-3">
                                    <Input
                                      {...register(`variations.${index}.stock`, {
                                        valueAsNumber: true,
                                      })}
                                      type="number"
                                      className="w-20"
                                    />
                                  </div>
                                  <div className="col-span-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => remove(index)}
                                    >
                                      <X className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {Object.keys(groupedVariations).length === 0 && (
                    <div className="border rounded-lg p-8 text-center bg-gray-50">
                      <p className="text-muted-foreground mb-4">
                        No variations added yet. Add variations like sizes or colors.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() =>
                          append({
                            name: "Size",
                            value: "Small (S)",
                            price: price || 20,
                            stock: 0,
                          })
                        }
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Size Variation
                      </Button>
                    </div>
                  )}
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

      {/* Add Variant Type Dialog */}
      <Dialog open={showAddVariantDialog} onOpenChange={setShowAddVariantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Variant Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="variantName">Variant Type Name</Label>
              <Input
                id="variantName"
                placeholder="e.g., Size, Color, Material, Style"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmVariantType();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddVariantDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmVariantType}
              disabled={!newVariantName.trim()}
            >
              Add Variant Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewProductSaleInformation;