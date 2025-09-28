"use client";
import React from "react";
import { Image as ImageIcon, Play, Plus } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormData, storeFormSchema } from "@/lib/validations/store";
import { useStoreForm } from "@/store/use-store-form";
import { StoreFormLayout } from "../components/store-form-layout";
import { StorePreview } from "../components/store-preview";
import { useMutation } from "@tanstack/react-query";
import { createStore as createStoreAction } from "../../../../actions/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Store } from "@prisma/client";
import { Button } from "@/components/ui/button";

const StoreMediaPage = () => {
  const router = useRouter();
  const { formData, setFormData, reset } = useStoreForm();

  const methods = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: formData,
  });

  // Update store data when form changes
  React.useEffect(() => {
    const subscription = methods.watch((value) => {
      setFormData(value as Partial<StoreFormData>);
    });
    return () => subscription.unsubscribe();
  }, [methods, setFormData]);

  const storeMutation = useMutation({
    mutationFn: async (data: Partial<StoreFormData>) => {
      if (!data.name) {
        throw new Error("Store name is required");
      }

      // Clean up the data by removing null values and converting dates
      const cleanData = Object.entries(data).reduce<Partial<Store>>(
        (acc, [key, value]) => {
          if (value === null || key === "id") return acc;
          if (value instanceof Date) {
            return { ...acc, [key]: value.getTime() };
          }
          return { ...acc, [key]: value };
        },
        {}
      );

      const storeData: Partial<Store> = {
        name: data.name,
        tagline: cleanData.tagline || null,
        description: cleanData.description || null,
        category: cleanData.category || null,
        regNumber: cleanData.regNumber || null,
        yearEstablished: cleanData.yearEstablished
          ? new Date(cleanData.yearEstablished).getFullYear()
          : null,
        phone: cleanData.phone || null,
        email: cleanData.email || null,
        address: cleanData.address || null,
        city: cleanData.city || null,
        state: cleanData.state || null,
        country: cleanData.country || null,
        zip: cleanData.zip || null,
        website: cleanData.website || null,
        logo: cleanData.logo || null,
        banner: cleanData.banner || null,
      };

      return createStoreAction(storeData);
    },
    onSuccess: (data) => {
      toast.success("Store created successfully!");
      const storeId = data.id;
      methods.reset();
      reset();
      router.push(`/${storeId}`);
    },
    onError: (error) => {
      console.error("Store creation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create store"
      );
    },
  });

  const handleSubmit = async () => {
    const isValid = await methods.trigger("name");
    if (!isValid) {
      toast.error("Please provide a store name.");
      return;
    }

    if (!formData.name) {
      toast.error("Store name is required.");
      return;
    }

    storeMutation.mutate(formData);
  };

  return (
    <FormProvider {...methods}>
      <StoreFormLayout
        onSubmit={handleSubmit}
        isSaving={storeMutation.isPending}
      >
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold text-gray-900">Media</h2>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Listings
                </Button>
              </div>

              <div className="space-y-8">
                {/* Business Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Business Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm" className="mb-3" disabled>
                        Upload Logo
                      </Button>
                      <p className="text-xs text-gray-500">
                        Recommended size: 512x512px (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Banner Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                    <div className="text-center">
                      <div className="w-20 h-12 bg-gray-100 rounded mx-auto mb-4 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm" className="mb-3" disabled>
                        Upload Banner
                      </Button>
                      <p className="text-xs text-gray-500">
                        Recommended size: 1920x1080px (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Photo Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Photo Gallery
                    </label>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Image
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { title: "Product Display", subtitle: "Interior" },
                      { title: "Customer Service", subtitle: "Team" },
                      { title: "Product Display", subtitle: "Interior" }
                    ].map((item, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-xs text-gray-700 font-medium text-center">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 text-center">
                          {item.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Video Gallery
                    </label>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Video
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                            <Play className="w-5 h-5 text-gray-600 ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                        
                        {/* Bottom text overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-xs text-white font-medium mb-1">
                            Product Review
                          </p>
                          <p className="text-xs text-white/80 line-clamp-2">
                            This product is very suitable for the children under the age of 5.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <StorePreview />
        </div>
      </StoreFormLayout>
    </FormProvider>
  );
};

export default StoreMediaPage;