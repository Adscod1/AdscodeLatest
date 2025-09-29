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
import { FileUpload } from "@/components/ui/file-upload";

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

  // Handle logo upload
  const handleLogoUpload = (url: string) => {
    setFormData({ ...formData, logo: url });
    methods.setValue('logo', url);
  };

  // Handle banner upload
  const handleBannerUpload = (url: string) => {
    setFormData({ ...formData, banner: url });
    methods.setValue('banner', url);
  };

  // Gallery state
  const [galleryImages, setGalleryImages] = React.useState<string[]>([]);
  const [galleryVideos, setGalleryVideos] = React.useState<string[]>([]);

  // Handle gallery image upload
  const handleGalleryImageUpload = (url: string) => {
    const updatedImages = [...galleryImages, url];
    setGalleryImages(updatedImages);
    // Gallery images will be stored separately for now
  };

  // Handle gallery video upload
  const handleGalleryVideoUpload = (url: string) => {
    const updatedVideos = [...galleryVideos, url];
    setGalleryVideos(updatedVideos);
    // Gallery videos will be stored separately for now
  };

  // Remove gallery item
  const removeGalleryImage = (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
  };

  const removeGalleryVideo = (index: number) => {
    const updatedVideos = galleryVideos.filter((_, i) => i !== index);
    setGalleryVideos(updatedVideos);
  };

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
                  <div className="h-48">
                    <FileUpload
                      type="logo"
                      onUpload={handleLogoUpload}
                      currentUrl={formData.logo || undefined}
                      accept="image/*"
                      maxSize={5}
                      className="h-full"
                    />
                  </div>
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Banner Image
                  </label>
                  <div className="h-64">
                    <FileUpload
                      type="banner"
                      onUpload={handleBannerUpload}
                      currentUrl={formData.banner || undefined}
                      accept="image/*"
                      maxSize={5}
                      className="h-full"
                    />
                  </div>
                </div>

                {/* Photo Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Photo Gallery
                    </label>
                    <span className="text-sm text-gray-500">
                      {galleryImages.length}/10 images
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* Existing gallery images */}
                    {galleryImages.map((imageUrl, index) => (
                      <div key={index} className="aspect-square relative group">
                        <FileUpload
                          type="gallery"
                          onUpload={() => {}} // Already uploaded
                          currentUrl={imageUrl}
                          className="h-full"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeGalleryImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    
                    {/* Add new image button */}
                    {galleryImages.length < 10 && (
                      <div className="aspect-square">
                        <FileUpload
                          type="gallery"
                          onUpload={handleGalleryImageUpload}
                          accept="image/*"
                          maxSize={5}
                          className="h-full"
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <Plus className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Add Image</span>
                          </div>
                        </FileUpload>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Video Gallery
                    </label>
                    <span className="text-sm text-gray-500">
                      {galleryVideos.length}/5 videos
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {/* Existing gallery videos */}
                    {galleryVideos.map((videoUrl, index) => (
                      <div key={index} className="aspect-video relative group">
                        <FileUpload
                          type="video"
                          onUpload={() => {}} // Already uploaded
                          currentUrl={videoUrl}
                          accept="video/*"
                          className="h-full"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeGalleryVideo(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    
                    {/* Add new video button */}
                    {galleryVideos.length < 5 && (
                      <div className="aspect-video">
                        <FileUpload
                          type="video"
                          onUpload={handleGalleryVideoUpload}
                          accept="video/*"
                          maxSize={10}
                          className="h-full"
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <Play className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Add Video</span>
                          </div>
                        </FileUpload>
                      </div>
                    )}
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