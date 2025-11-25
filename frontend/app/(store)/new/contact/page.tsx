"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormData, storeFormSchema } from "@/lib/validations/store";
import { useStoreForm } from "@/store/use-store-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StoreFormLayout } from "../components/store-form-layout";
import { StorePreview } from "../components/store-preview";
import { Facebook, Instagram } from "lucide-react";

const ContactInformationPage = () => {
  const { formData, setFormData } = useStoreForm();

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

  return (
    <FormProvider {...methods}>
      <StoreFormLayout>
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              {/* Contact Information Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-6 text-gray-900">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        {...methods.register("phone")}
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        {...methods.register("email")}
                        type="email"
                        placeholder="horizon@gmail.com"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website <span className="text-gray-400">(optional)</span>
                    </label>
                    <Input
                      {...methods.register("website")}
                      type="url"
                      placeholder="www.horizonelectronics.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website <span className="text-gray-400">(optional)</span>
                    </label>
                    <Input
                      {...methods.register("website")}
                      type="url"
                      placeholder="www.horizonelectronics.com"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Store Address Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-6 text-gray-900">
                  Store Address
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <Input
                      {...methods.register("address")}
                      placeholder="123 Tech Avenue, Innovation District"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <Input 
                        {...methods.register("city")} 
                        placeholder="San Francisco"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <Input 
                        {...methods.register("state")} 
                        placeholder="CA"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP/Postal Code
                      </label>
                      <Input
                        {...methods.register("zip")}
                        placeholder="94102"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <Select defaultValue="usa">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="germany">Germany</SelectItem>
                          <SelectItem value="france">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-6 text-gray-900">
                  Social Media
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Facebook className="h-4 w-4 text-blue-600" />
                      </div>
                      <Input
                        placeholder="https://facebook.com/mystore"
                        className="pl-10 w-full"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Instagram className="h-4 w-4 text-pink-600" />
                      </div>
                      <Input
                        placeholder="https://instagram.com/mystore"
                        className="pl-10 w-full"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      X (formerly Twitter)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <Input
                        placeholder="https://x.com/mystore"
                        className="pl-10 w-full"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Button */}
              <div className="flex justify-end">
                <Button 
                  type="button"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 rounded-lg"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <StorePreview />
        </div>
      </StoreFormLayout>
    </FormProvider>
  );
};

export default ContactInformationPage;