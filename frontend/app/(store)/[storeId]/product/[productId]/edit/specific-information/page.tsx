"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { useForm, useFieldArray } from "react-hook-form";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ProductTabs } from "../../../components/product-tabs";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";

interface BenefitItem {
  id?: string;
  title: string;
  description: string;
}

interface IngredientItem {
  id?: string;
  name: string;
  image: string;
  description: string;
}

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

interface ExtendedProduct {
  id: string;
  title: string;
  benefitsIntroText?: string | null;
  benefitsSectionImage?: string | null;
  benefitItems?: BenefitItem[];
  ingredientItems?: IngredientItem[];
  howToUseVideo?: string | null;
  howToUseDescription?: string | null;
  faqItems?: FaqItem[];
}

interface FormData {
  benefitsIntroText: string;
  benefitsSectionImage: string;
  benefitItems: BenefitItem[];
  ingredientItems: IngredientItem[];
  howToUseVideo: string;
  howToUseDescription: string;
  faqItems: FaqItem[];
}

const EditSpecificInformationPage = () => {
  const { storeId, productId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch product data
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await api.products.getById(productId as string);
      return response.product as unknown as ExtendedProduct;
    },
    enabled: !!productId,
  });

  const { register, handleSubmit, watch, setValue, control, reset } = useForm<FormData>({
    defaultValues: {
      benefitsIntroText: "",
      benefitsSectionImage: "",
      benefitItems: [],
      ingredientItems: [],
      howToUseVideo: "",
      howToUseDescription: "",
      faqItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefitItems",
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredientItems",
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "faqItems",
  });

  // Set form values when product data is loaded - use only once with proper dependency
  React.useEffect(() => {
    if (product && !isLoading) {
      const formData: FormData = {
        benefitsIntroText: product.benefitsIntroText || "",
        benefitsSectionImage: product.benefitsSectionImage || "",
        benefitItems: product.benefitItems || [],
        ingredientItems: product.ingredientItems || [],
        howToUseVideo: product.howToUseVideo || "",
        howToUseDescription: product.howToUseDescription || "",
        faqItems: product.faqItems || [],
      };
      
      reset(formData);
    }
  }, [product, isLoading, reset]);

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: (data: FormData) => api.products.update(productId as string, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      router.push(`/${storeId}/product/${productId}/edit/sale`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    },
  });

  const onSubmit = (data: FormData) => {
    updateProductMutation.mutate(data);
  };

  const handleImageUpload = (url: string) => {
    setValue("benefitsSectionImage", url);
  };

  const handleIngredientImageUpload = (url: string, index: number) => {
    setValue(`ingredientItems.${index}.image`, url);
  };

  const handleVideoUpload = (url: string) => {
    setValue("howToUseVideo", url);
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
          <div className="border-l h-6 border-gray-300"></div>
          <h1 className="text-xl font-semibold">Edit Product - Specific Information</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={updateProductMutation.isPending}
          >
            {updateProductMutation.isPending ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <ProductTabs activeTab="Specific Information" productId={productId as string} />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Benefits Section */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Benefits</h3>
                <p className="text-sm text-gray-500">
                  Highlight the key selling points of your product
                </p>
              </div>

              {/* Introduction Text */}
              <div className="space-y-2">
                <Label htmlFor="benefitsIntroText">Introduction Text</Label>
                <Textarea
                  id="benefitsIntroText"
                  {...register("benefitsIntroText")}
                  placeholder="Describe the overall benefits of your product..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Section Image */}
              <div className="space-y-2">
                <Label>Section Image</Label>
                {watch("benefitsSectionImage") ? (
                  <div className="relative w-full h-42 rounded overflow-hidden border">
                    <img
                      src={watch("benefitsSectionImage")}
                      alt="Benefits section"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setValue("benefitsSectionImage", "")}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded p-8 text-center">
                    <FileUpload
                      type="product"
                      onUpload={handleImageUpload}
                      accept="image/*"
                      maxSize={5}
                      endpoint="/product/media"
                    >
                      <p className="text-sm text-gray-600">Click or drag to upload image</p>
                    </FileUpload>
                  </div>
                )}
              </div>

              {/* Benefit Items */}
              <div className="space-y-4">
                <Label>Items</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 rounded p-4 space-y-3">
                    <div className="flex gap-3">
                      <Input
                        {...register(`benefitItems.${index}.title`)}
                        placeholder="Item title"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      {...register(`benefitItems.${index}.description`)}
                      placeholder="Describe this benefit..."
                      className="min-h-[100px]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ title: "", description: "" })}
                  className="w-full border-2 border-dashed rounded py-4 text-sm text-blue-600 hover:bg-gray-50"
                >
                  + Add Item
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients Section */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Ingredients/Materials</h3>
                <p className="text-sm text-gray-500">
                  List key ingredients or materials used
                </p>
              </div>

              <div className="space-y-4">
                <Label>Items</Label>
                {ingredientFields.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 rounded p-4 space-y-3">
                    <div className="flex gap-3">
                      <Input
                        {...register(`ingredientItems.${index}.name`)}
                        placeholder="Name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      {...register(`ingredientItems.${index}.description`)}
                      placeholder="Description..."
                      className="min-h-[80px]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendIngredient({ name: "", image: "", description: "" })}
                  className="w-full border-2 border-dashed rounded py-4 text-sm text-blue-600 hover:bg-gray-50"
                >
                  + Add Item
                </button>
              </div>
            </CardContent>
          </Card>

          {/* How to Use Section */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">How to Use</h3>
                <p className="text-sm text-gray-500">
                  Provide instructions and a video tutorial
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="howToUseDescription">Description</Label>
                <Textarea
                  id="howToUseDescription"
                  {...register("howToUseDescription")}
                  placeholder="Provide step-by-step instructions..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">FAQ</h3>
                <p className="text-sm text-gray-500">
                  Answer common questions about your product
                </p>
              </div>

              <div className="space-y-4">
                {faqFields.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 rounded p-4 space-y-3">
                    <div className="flex gap-3">
                      <Input
                        {...register(`faqItems.${index}.question`)}
                        placeholder="Question"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFaq(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      {...register(`faqItems.${index}.answer`)}
                      placeholder="Answer..."
                      className="min-h-[80px]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendFaq({ question: "", answer: "" })}
                  className="w-full border-2 border-dashed rounded py-4 text-sm text-blue-600 hover:bg-gray-50"
                >
                  + Add FAQ
                </button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default EditSpecificInformationPage;
