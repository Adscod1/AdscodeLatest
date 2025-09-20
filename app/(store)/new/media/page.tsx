"use client";
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormData, storeFormSchema } from "@/lib/validations/store";
import { useStoreForm } from "@/store/use-store-form";
import { StoreFormLayout } from "../components/store-form-layout";
import { useMutation } from "@tanstack/react-query";
import { createStore as createStoreAction } from "../../../../actions/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Store } from "@prisma/client";

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
          // Skip null values and id (let database generate it)
          if (value === null || key === "id") return acc;
          // Convert Date objects to timestamps
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

      // reset the form
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
    // Only validate the name field
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Media</h2>
                <p className="text-sm text-yellow-600">
                  Image upload coming soon
                </p>
              </div>
              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Logo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <ImageIcon
                        className="mx-auto h-12 w-12 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-not-allowed bg-white rounded-md font-medium text-gray-400">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            disabled
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banner Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Banner
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <ImageIcon
                        className="mx-auto h-12 w-12 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-not-allowed bg-white rounded-md font-medium text-gray-400">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            disabled
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreFormLayout>
    </FormProvider>
  );
};

export default StoreMediaPage;
