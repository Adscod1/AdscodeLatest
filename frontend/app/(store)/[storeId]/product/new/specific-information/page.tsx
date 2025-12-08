"use client";
import React from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProductTabs } from "../../components/product-tabs";
import { useForm, useFieldArray } from "react-hook-form";
import { CreateProductInput } from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/use-product-store";
import { FileUpload } from "@/components/ui/file-upload";

interface BenefitItem {
  title: string;
  description: string;
}

interface IngredientItem {
  name: string;
  image: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ExtendedProductInput extends CreateProductInput {
  benefitsIntroText?: string;
  benefitsSectionImage?: string;
  benefitItems?: BenefitItem[];
  ingredientsIntroText?: string;
  ingredientItems?: IngredientItem[];
  howToUseVideo?: string;
  howToUseDescription?: string;
  faqItems?: FaqItem[];
}

const SpecificInformationPage = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { product, updateProduct, reset: resetStore, _hasHydrated } = useProductStore();
  const hasSyncedRef = React.useRef(false);

  const { register, handleSubmit, watch, setValue, control, reset: resetForm } = useForm<ExtendedProductInput>({
    defaultValues: {
      storeId: storeId as string,
      benefitsIntroText: "",
      benefitsSectionImage: "",
      benefitItems: [],
      ingredientsIntroText: "",
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

  // Sync form with store data ONCE after hydration
  React.useEffect(() => {
    if (_hasHydrated && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      resetForm({
        ...product,
        storeId: storeId as string,
        benefitsIntroText: (product as ExtendedProductInput).benefitsIntroText || "",
        benefitsSectionImage: (product as ExtendedProductInput).benefitsSectionImage || "",
        benefitItems: (product as ExtendedProductInput).benefitItems || [],
        ingredientsIntroText: (product as ExtendedProductInput).ingredientsIntroText || "",
        ingredientItems: (product as ExtendedProductInput).ingredientItems || [],
        howToUseVideo: (product as ExtendedProductInput).howToUseVideo || "",
        howToUseDescription: (product as ExtendedProductInput).howToUseDescription || "",
        faqItems: (product as ExtendedProductInput).faqItems || [],
      });
    }
  }, [_hasHydrated, product, resetForm, storeId]);

  // Auto-save form data to store on change
  React.useEffect(() => {
    const subscription = watch((data) => {
      if (hasSyncedRef.current) {
        updateProduct({
          ...data,
          storeId: storeId as string,
        } as Partial<ExtendedProductInput>);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProduct, storeId]);

  const handleImageUpload = (url: string) => {
    setValue("benefitsSectionImage", url);
    updateProduct({ benefitsSectionImage: url } as Partial<ExtendedProductInput>);
  };

  const onSubmit = (data: ExtendedProductInput) => {
    updateProduct({
      ...data,
      storeId: storeId as string,
    });
    router.push(`/${storeId}/product/new/sale`);
  };

  const handleCancel = () => {
    resetStore();
    router.push(`/${storeId}/products`);
  };

  const handleAddItem = () => {
    append({ title: "", description: "" });
  };

  const handleAddIngredient = () => {
    appendIngredient({ name: "", image: "", description: "" });
  };

  const handleIngredientImageUpload = (url: string, index: number) => {
    setValue(`ingredientItems.${index}.image`, url);
  };

  const handleAddFaq = () => {
    appendFaq({ question: "", answer: "" });
  };

  const handleVideoUpload = (url: string) => {
    setValue("howToUseVideo", url);
    updateProduct({ howToUseVideo: url } as Partial<ExtendedProductInput>);
  };

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
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none">
            Continue
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <ProductTabs activeTab="Specific Information" />

          {/* Specific Information Form */}
          <Card className="border-0 shadow-none">
            <CardContent className="p-6 space-y-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Benefits Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Benefits</h3>
                    <p className="text-sm text-gray-500">
                      Highlight the key selling points of your product
                    </p>
                  </div>

                  {/* Introduction Text */}
                  <div className="space-y-2">
                    <Label htmlFor="benefitsIntroText" className="text-sm font-medium text-gray-900">
                      Introduction Text
                    </Label>
                    <Textarea
                      id="benefitsIntroText"
                      {...register("benefitsIntroText")}
                      placeholder="Describe the overall benefits of your product..."
                      className="min-h-[100px] bg-white border-gray-200 focus:border-gray-300 focus:ring-0"
                    />
                  </div>

                  {/* Section Image */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Section Image</Label>
                    {watch("benefitsSectionImage") ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                          onClick={() => {
                            setValue("benefitsSectionImage", "");
                            updateProduct({ benefitsSectionImage: "" } as Partial<ExtendedProductInput>);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg">
                        <FileUpload
                          type="product"
                          onUpload={handleImageUpload}
                          accept="image/*"
                          maxSize={5}
                          endpoint="/product/media"
                          className="border-0"
                        >
                          <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                              <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-900 mb-1">
                              Click or drag to upload image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WEBP
                            </p>
                          </div>
                        </FileUpload>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-900">Items</Label>
                  
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="bg-gray-50 rounded-lg p-4 space-y-3 relative"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <Input
                            {...register(`benefitItems.${index}.title`)}
                            placeholder="Item title"
                            className="bg-white border-gray-200 focus:border-gray-300 focus:ring-0 flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 h-10 w-10 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <Textarea
                          {...register(`benefitItems.${index}.description`)}
                          placeholder="Item description"
                          className="min-h-[100px] bg-white border-gray-200 focus:border-gray-300 focus:ring-0 resize-none"
                        />
                      </div>
                    ))}

                    {/* Add Item Button */}
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 flex items-center justify-center text-sm text-blue-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <span className="mr-2">+</span> Add Item
                    </button>
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Ingredients</h3>
                    <p className="text-sm text-gray-500">
                      List the key components with images and descriptions
                    </p>
                  </div>

                  <div className="space-y-4">
                    {ingredientFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="bg-gray-50 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <Label className="text-sm font-medium text-gray-900">Name</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 h-10 w-10 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                            onClick={() => removeIngredient(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <Input
                          {...register(`ingredientItems.${index}.name`)}
                          placeholder="e.g., Hyaluronic acid, Leather, etc."
                          className="bg-white border-gray-200 focus:border-gray-300 focus:ring-0"
                        />

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-900">Image</Label>
                          {watch(`ingredientItems.${index}.image`) ? (
                            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={watch(`ingredientItems.${index}.image`)}
                                alt="Ingredient"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setValue(`ingredientItems.${index}.image`, "");
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg">
                              <FileUpload
                                type="product"
                                onUpload={(url) => handleIngredientImageUpload(url, index)}
                                accept="image/*"
                                maxSize={5}
                                endpoint="/product/media"
                                className="border-0"
                              >
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                                    <svg
                                      className="w-5 h-5 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                  <p className="text-sm text-gray-900 mb-1">
                                    Click or drag to upload image
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG, WEBP
                                  </p>
                                </div>
                              </FileUpload>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-900">Description</Label>
                          <Textarea
                            {...register(`ingredientItems.${index}.description`)}
                            placeholder="Describe this item..."
                            className="min-h-[100px] bg-white border-gray-200 focus:border-gray-300 focus:ring-0 resize-none"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add Item Button */}
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 flex items-center justify-center text-sm text-blue-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <span className="mr-2">+</span> Add Item
                    </button>
                  </div>
                </div>

                {/* How to Use Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">How to Use</h3>
                    <p className="text-sm text-gray-500">
                      Provide instructions and a video tutorial
                    </p>
                  </div>

                  {/* Tutorial Video */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Tutorial Video</Label>
                    {watch("howToUseVideo") ? (
                      <div className="relative w-full rounded-lg overflow-hidden border border-gray-200">
                        <video
                          src={watch("howToUseVideo")}
                          className="w-full h-64 object-cover"
                          controls
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setValue("howToUseVideo", "");
                            updateProduct({ howToUseVideo: "" } as Partial<ExtendedProductInput>);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg">
                        <FileUpload
                          type="video"
                          onUpload={handleVideoUpload}
                          accept="video/*"
                          maxSize={30}
                          endpoint="/product/media"
                          className="border-0"
                        >
                          <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                              <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-900 mb-1">
                              Click or drag to upload video
                            </p>
                            <p className="text-xs text-gray-500">
                              MP4, WEBM, MOV
                            </p>
                          </div>
                        </FileUpload>
                      </div>
                    )}
                  </div>

                  {/* Description (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="howToUseDescription" className="text-sm font-medium text-gray-900">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="howToUseDescription"
                      {...register("howToUseDescription")}
                      placeholder="Step-by-step instructions..."
                      className="min-h-[120px] bg-white border-gray-200 focus:border-gray-300 focus:ring-0"
                    />
                  </div>
                </div>

                {/* FAQs Section */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">FAQs</h3>
                      <p className="text-sm text-gray-500">
                        Add frequently asked questions and their answers
                      </p>
                    </div>

                    {faqFields.length === 0 ? (
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 flex items-center justify-center text-sm text-blue-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      >
                        <span className="mr-2">+</span> Add Question
                      </button>
                    ) : (
                      <div className="space-y-6">
                        {faqFields.map((field, index) => (
                          <div key={field.id} className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <Label className="text-sm font-semibold text-gray-900">Question</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                                onClick={() => removeFaq(index)}
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>

                            <Input
                              {...register(`faqItems.${index}.question`)}
                              placeholder="What question do customers frequently ask?"
                              className="bg-white border-gray-200 focus:border-gray-300 focus:ring-0"
                            />

                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-gray-900">Answer</Label>
                              <Textarea
                                {...register(`faqItems.${index}.answer`)}
                                placeholder="Provide a clear and helpful answer..."
                                className="min-h-[120px] bg-white border-gray-200 focus:border-gray-300 focus:ring-0 resize-none"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleAddFaq}
                          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 flex items-center justify-center text-sm text-blue-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          <span className="mr-2">+</span> Add Question
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpecificInformationPage;
