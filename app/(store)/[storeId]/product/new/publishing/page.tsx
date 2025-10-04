"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductTabs } from "../../components/product-tabs";
import { useForm } from "react-hook-form";
import { CreateProductInput, createProduct } from "@/actions/product";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { useProductStore } from "@/store/use-product-store";
import { useParams } from "next/navigation";

const NewProductPublishingPage = () => {
  const router = useRouter();
  const { storeId } = useParams();
  const { product, reset } = useProductStore();

  const { register, handleSubmit } = useForm<CreateProductInput>({
    defaultValues: {
      ...product,
      storeId: storeId as string,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product published successfully!");
      reset();
      router.push(`/${storeId}/listings`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to publish product"
      );
    },
  });

  const onSubmit = (data: CreateProductInput) => {
    // Ensure all required fields are present and properly typed
    const finalData = {
      ...product,
      ...data,
      storeId: storeId as string,
      status: "ACTIVE",
      // Ensure all numeric fields are properly converted
      price: Number(product.price) || 0,
      comparePrice: product.comparePrice
        ? Number(product.comparePrice)
        : undefined,
      costPerItem: product.costPerItem
        ? Number(product.costPerItem)
        : undefined,
      weight: product.weight ? Number(product.weight) : undefined,
      length: product.length ? Number(product.length) : undefined,
      width: product.width ? Number(product.width) : undefined,
      height: product.height ? Number(product.height) : undefined,
      // Ensure arrays are properly initialized
      variations:
        product.variations?.map((v) => ({
          ...v,
          price: Number(v.price),
          stock: Number(v.stock),
        })) || [],
      images: product.images || [],
      videos: product.videos || [],
      // Ensure other fields are properly typed
      countryOfOrigin: product.countryOfOrigin || undefined,
      harmonizedSystemCode: product.harmonizedSystemCode || undefined,
      weightUnit: product.weightUnit || undefined,
      sizeUnit: product.sizeUnit || undefined,
    };

    createProductMutation.mutate(finalData);
  };

  const handleCancel = () => {
    reset();
    router.push(`/${storeId}/listings`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 bg-white border-b gap-4 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Back to product listing</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none text-sm">
            Back
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none text-sm">Publish</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <ProductTabs activeTab="Publishing" />

            {/* Publishing Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-pink-500">
                  Let&apos;s check everything before publishing
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Make sure all info is correct before selling your product
                </p>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Basic information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Product title</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {product.title || "No title provided"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Product category</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {product.category || "No category provided"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label>Vendor</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {product.vendor || "No vendor provided"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="px-3 py-2 bg-muted rounded-md">
                        {product.tags || "No tags provided"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <div className="px-3 py-2 bg-muted rounded-md whitespace-pre-wrap">
                      {product.description || "No description provided"}
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Media{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      (images, video or 3D models)
                    </span>
                  </h3>
                  {product.images && product.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {product.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No images</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sale Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Sale information</h3>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <Label>Price</Label>
                          <div className="text-lg font-medium">
                            $ {product.price?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                        <div>
                          <Label>Compare-at price</Label>
                          <div className="text-lg font-medium">
                            $ {product.comparePrice?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <Label>Cost per item</Label>
                          <div className="text-lg font-medium">
                            $ {product.costPerItem?.toFixed(2) || "0.00"}
                          </div>
                        </div>
                        <div>
                          <Label>Profit</Label>
                          <div className="text-lg font-medium">
                            ${" "}
                            {(
                              (product.price || 0) - (product.costPerItem || 0)
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <Label>Margin</Label>
                          <div className="text-lg font-medium">
                            {(
                              (((product.price || 0) -
                                (product.costPerItem || 0)) /
                                (product.price || 1)) *
                              100
                            ).toFixed(0)}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tax" defaultChecked />
                      <Label htmlFor="tax">Charge tax on this product</Label>
                    </div>
                  </div>

                  {/* Variations Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Size</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Available</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.variations?.map((variation, index) => (
                        <TableRow key={index}>
                          <TableCell>{variation.value}</TableCell>
                          <TableCell>$ {variation.price.toFixed(2)}</TableCell>
                          <TableCell>{variation.stock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Shipping Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Shipping</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label>Weight</Label>
                      <div className="text-lg font-medium">
                        {product.weight} {product.weightUnit}
                      </div>
                    </div>
                    <div>
                      <Label>Parcel size</Label>
                      <div className="text-lg font-medium">
                        {product.length} × {product.width} × {product.height}{" "}
                        {product.sizeUnit}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="worldwide" defaultChecked />
                    <Label htmlFor="worldwide">
                      This product is available worldwide
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Country/Region of origin</Label>
                    <div className="px-3 py-2 bg-muted rounded-md">
                      {product.countryOfOrigin || "Not specified"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 order-first lg:order-last">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1">Status</Label>
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
                        <Checkbox id="select-all" defaultChecked />
                        <Label htmlFor="select-all">Select all</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="online-store" defaultChecked />
                        <Label htmlFor="online-store">Online Store</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="buy-button" defaultChecked />
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

export default NewProductPublishingPage;
